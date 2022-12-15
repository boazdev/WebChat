from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
class groupDBDAL:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["webchatDB"]
        self.__collection = self.__db["groups"]
    
    def get_group(self,id): 
        group = self.__collection.find_one({"_id":ObjectId(id)})
        return group

    def get_group_aggr(self,pipeline):
        group = self.__collection.aggregate(pipeline)
        return {"data": list(group)}

    
    def get_all_groups(self):
        groups = list(self.__collection.find({}))
        return {"data": groups}
    

    def add_group(self,obj):
        """ obj["listId"] = ObjectId(obj["listId"])
        datetime_obj = datetime.strptime(obj["date"], '%Y-%m-%d')
        obj["date"] = datetime_obj """
        self.__collection.insert_one(obj)
        return {"groupId": str(obj["_id"])}


    def delete_group(self,id):
        self.__collection.delete_one({"_id":ObjectId(id)})
        return "Deleted group!"

    def update_group(self,id,obj):
        """ if (obj.get("listId")!=None):
            obj["listId"] = ObjectId(obj["listId"])
        if (obj.get("date")!=None):
            datetime_obj = datetime.strptime(obj["date"], '%Y-%m-%d')
            obj["date"] = datetime_obj """
        self.__collection.update_one({"_id": ObjectId(id)},{"$set":obj})
        return "Updated group"

    def update_group_messages(self,id,obj):
        self.__collection.update_one({"_id": ObjectId(id)},{"$push":{"messages":obj}})
        return "Updated Group Messages"
    
    def update_group_leave_member(self,id,obj):
        self.__collection.update_one({"_id": ObjectId(id)},{"$pull":{"members":ObjectId(obj)}})
        return "Updated group members"

    def update_group_add_member(self,id,obj):
        self.__collection.update_one({"_id": ObjectId(id)},{"$push":{"members":ObjectId(obj)}})
        return "Updated group members"