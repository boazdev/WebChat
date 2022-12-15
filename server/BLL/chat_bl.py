from DAL.chat_db_dal import *
from bson import ObjectId

from flask import g
class ChatBL:
    def __init__(self):
        self.__chat_db_dal = ChatDBDAL()

    def get_all_chats(self):
        rchats = self.__chat_db_dal.get_all_chats()
        return rchats
    def get_chats_by_userid(self,userid):
        rchats = self.__chat_db_dal.get_all_chats()
        userid=ObjectId(userid)
        rchats["data"] = list(filter(lambda item:item["userIdFrom"]==userid or item["userIdTo"]==userid,rchats["data"]))
        return rchats
    def get_chat(self,id):
        rchat = self.__chat_db_dal.get_chat(id)
        return rchat

    def add_chat(self,obj):
        resp = self.__chat_db_dal.add_chat(obj)
        return resp

    def update_chat(self,id,obj):
        resp = self.__chat_db_dal.update_chat(id,obj)
        return resp

    def update_chat_messages(self,id,obj):
        resp = self.__chat_db_dal.update_chat_messages(id,obj)
        return resp

    def delete_chat(self,id):
        resp = self.__chat_db_dal.delete_chat(id)
        return resp