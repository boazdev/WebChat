from pymongo import MongoClient
from bson import ObjectId
#from datetime import datetime
class ChatDBDAL:
    def __init__(self):
        self.__client = MongoClient(port=27017)
        self.__db = self.__client["webchatDB"]
        self.__collection = self.__db["chats"]
    
    def get_chat(self,id): 
        chat = self.__collection.find_one({"_id":ObjectId(id)})
        return chat

    def get_chat_aggr(self,pipeline):
        chat = self.__collection.aggregate(pipeline)
        return {"data":list(chat)}

    
    def get_all_chats(self):
        chats = list(self.__collection.find({}))
        return {"data":chats}
    
    def add_chat(self,obj):
        """ obj["uid"] = ObjectId(obj["uid"]) """
        self.__collection.insert_one(obj)
        return {"chatId":str(obj["_id"]), "message":"Created chat with ID " +str(obj["_id"])}


    def delete_chat(self,id):
        self.__collection.delete_one({"_id":ObjectId(id)})
        return "Deleted chat!"

    def update_chat(self,id,obj):
        """ if (obj.get("uid")!=None):
            obj["uid"] = ObjectId(obj["uid"]) """
        self.__collection.update_one({"_id": ObjectId(id)},{"$set":obj})
        return "Updated chat"

    def update_chat_messages(self,id,obj):
        self.__collection.update_one({"_id": ObjectId(id)},{"$push":{"messages":obj}})
        return "Updated chat"