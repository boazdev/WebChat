from DAL.user_db_dal import *
#from DAL.emp_to_user_db_dal import *
#from BLL.action_bl import ActionBL
from flask import g
class UserBL:
    def __init__(self):
        self.__user_db_dal = UserDBDAL()

    def get_all_users(self):
        users = self.__user_db_dal.get_all_users()
        users["data"] = list(map(lambda item:{"userId":item["_id"],"nickname":item["nickname"]},users["data"]))
        """ print("sending users obj:")
        print(users) """
        return users

    def get_user(self,id):
        user = self.__user_db_dal.get_user(id)
        return user

    def add_user(self,obj):
        if self.__user_db_dal.get_user_by_username(obj["username"])!= None:
            return 403
        resp = self.__user_db_dal.add_user(obj)
        return resp

    def update_user(self,id,obj):
        resp = self.__user_db_dal.update_user(id,obj)
        return resp

    def delete_user(self,id):
        resp = self.__user_db_dal.delete_user(id)
        return resp