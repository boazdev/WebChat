from pymongo import MongoClient
from bson import ObjectId
#from datetime import datetime
class BlacklistDBDAL:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["webchatDB"]
        self.__collection = self.__db["blacklists"]
    
    def get_blacklist(self,id): 
        blacklist = self.__collection.find_one({"_id":ObjectId(id)})
        return blacklist

    def get_blacklist_userid(self,id):
        blacklist = self.__collection.find({"userId":ObjectId(id)})
        return {"data":list(blacklist)}

    def get_blacklist_single_block(self,userId,userIdBlock):
        """ print("blacklist db dal find one: ")
        print({"userId":ObjectId(userId),"userIdBlock":ObjectId(userIdBlock)}) """
        blacklist = self.__collection.find_one({"userId":ObjectId(userId),"userIdBlock":ObjectId(userIdBlock)})
        #blacklist =  self.__collection.find_one({"userId":ObjectId("6388bd1f624a194c949bb1b0"),"userIdBlock" : ObjectId("6388bc17624a194c949bb1a9")})
        return blacklist

    def get_blacklist_aggr(self,pipeline):
        blacklist = self.__collection.aggregate(pipeline)
        return {"data":list(blacklist)}

    
    def get_all_blacklists(self):
        blacklists = list(self.__collection.find({}))
        return {"data":blacklists}
    
    def add_blacklist(self,obj):
        obj["userId"] = ObjectId(obj["userId"])
        obj["userIdBlock"] = ObjectId(obj["userIdBlock"])
        self.__collection.insert_one(obj)
        return {"blacklistId":str(obj["_id"]), "message":"Created blacklist with ID " +str(obj["_id"])}


    def delete_blacklist(self,id):
        self.__collection.delete_one({"_id":ObjectId(id)})
        return "Deleted blacklist!"

    def update_blacklist(self,id,obj):
        """ if (obj.get("uid")!=None):
            obj["uid"] = ObjectId(obj["uid"]) """
        self.__collection.update_one({"_id": ObjectId(id)},{"$set":obj})
        return "Updated blacklist"

    def update_blacklist_messages(self,id,obj):
        self.__collection.update_one({"_id": ObjectId(id)},{"$push":{"messages":obj}})
        return "Updated blacklist"