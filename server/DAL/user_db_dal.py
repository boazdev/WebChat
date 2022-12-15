from pymongo import MongoClient
from bson import ObjectId

class UserDBDAL:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["webchatDB"]
        self.__collection = self.__db["users"]
    
    def get_user(self,id): 
        user = self.__collection.find_one({"_id":ObjectId(id)})
        return user

    def get_user_by_username(self,username): 
        user = self.__collection.find_one({"username":username})
        return user

    def get_user_aggr(self,pipeline):
        user = self.__collection.aggregate(pipeline)
        return {"data":list(user)}
        #return list(user)

    
    def get_all_users(self):
        users = list(self.__collection.find({}))
        return {"data":users}
        #return users
    
    def add_user(self,obj):
        self.__collection.insert_one(obj)
        return "Created user with ID " +str(obj["_id"])


    def delete_user(self,id):
        self.__collection.delete_one({"_id":ObjectId(id)})
        return "Deleted user!"

    def update_user(self,id,obj):
        self.__collection.update_one({"_id": ObjectId(id)},{"$set":obj})
        return "Updated user"