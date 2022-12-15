from DAL.user_db_dal import *

from datetime import datetime, timedelta
from BLL.user_bl import UserBL
import jwt
from flask import g
from enconder import JSONEncoder
from datetime import timezone
class AuthBL:
    def __init__(self):
        self.__user_db_dal = UserDBDAL()
        self.__key = "server_key"
        self.__algorithm = "HS256"

        self.__user_bl=UserBL()

    def get_token(self, username,password):
        user = self.__user_db_dal.get_user_by_username(username)
        if user==None:
            return "username_error"        
        elif user["password"] != password:
            return "password_error"
        
        id= str(user["_id"])
        data = self.__user_bl.get_user(id)
        
        """ print("user data: " +str(data)) """
        token = jwt.encode(data,self.__key,self.__algorithm,json_encoder=JSONEncoder)#),headers={"exp": timeObj}) #jwt.encode({"exp": datetime.now(tz=timezone.utc)}, "secret") - with session timeout
        return token

    def verify_token(self,token): 
        try:
            data = jwt.decode(token,self.__key,self.__algorithm)
            return True
        except Exception as e:
            print("jwt error:" + str(e) +" " +str(e.__traceback__))
            return False   
        except jwt.ExpiredSignatureError:
            print("session time out expire error")
            return False
        