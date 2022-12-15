from DAL.blacklist_db_dal import *
from bson import ObjectId

class BlacklistBL:
    def __init__(self):
        self.__blacklist_db_dal = BlacklistDBDAL()

    def get_all_blacklists(self):
        blacklists = self.__blacklist_db_dal.get_all_blacklists()
        return blacklists

    def get_blacklist_single_block(self,userId,userIdBlock):
        return self.__blacklist_db_dal.get_blacklist_single_block(userId, userIdBlock)

    def get_blacklist(self,userid): #get all blacklists by user id, instead of bid.
        blacklists = self.__blacklist_db_dal.get_all_blacklists()
        userid=ObjectId(userid)
        blacklists["data"] = list(filter(lambda item:item["userId"]==userid,blacklists["data"]))
        return blacklists

    def add_blacklist(self,obj):
        resp = self.__blacklist_db_dal.add_blacklist(obj)
        return resp

    def update_blacklist(self,id,obj):
        resp = self.__blacklist_db_dal.update_blacklist(id,obj)
        return resp



    def delete_blacklist(self,id):
        resp = self.__blacklist_db_dal.delete_blacklist(id)
        return resp