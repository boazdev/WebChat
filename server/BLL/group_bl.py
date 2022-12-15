from DAL.group_db_dal import *
from flask_socketio import emit, leave_room
from flask import request
class GroupBL:
    def __init__(self):
        self.__group_db_dal = groupDBDAL()

    def get_all_groups(self):
        groups = self.__group_db_dal.get_all_groups()
        return groups

    def get_groups_by_userid(self,userid):
        groups = self.__group_db_dal.get_all_groups()
        userid=ObjectId(userid)
        groups["data"] = list(filter(lambda item:userid in item["members"],groups["data"]))
        """ print("groups for userid: " +str(userid))
        print(groups["data"]) """
        return groups

    def get_group(self,id):
        group = self.__group_db_dal.get_group(id)
        return group

    def add_group(self,obj):
        resp = self.__group_db_dal.add_group(obj)
        return resp
                
    def update_group(self,id,obj):
        if "userIdLeave" in obj:
            curr_date = datetime.today().replace(microsecond=0)
            messageObj = {"content":obj["nickname"]+" has left the group","userId":"server","date":curr_date.strftime("%d/%m/%Y %H:%M")}
            respData = {"messageData": messageObj, "chatId": id}
            emit("data_grp_chat",respData,namespace='/',to=id)
            resp = self.__group_db_dal.update_group_leave_member(id,obj["userIdLeave"])
            resp2 = self.__group_db_dal.update_group_messages(id,{**messageObj,"date":curr_date})
            return resp
        elif "userIdAdd" in obj:
            curr_date = datetime.today().replace(microsecond=0)
            messageObj = {"content":obj["nickname"]+" has been added the group","userId":"server","date":curr_date.strftime("%d/%m/%Y %H:%M")}
            respData = {"messageData": messageObj, "chatId": id}
            emit("data_grp_chat",respData,namespace='/',to=id)
            
            resp1 = self.__group_db_dal.update_group_add_member(id,obj["userIdAdd"])
            objMessage ={**messageObj,"date":curr_date}
            print(" user add to group: will update message obj:")
            print(objMessage)
            resp2 = self.__group_db_dal.update_group_messages(id,objMessage)
            return resp1
        else:
            resp = self.__group_db_dal.update_group(id,obj)
            return resp

    def update_group_remove_user(self,id, obj):
        return self.__group_db_dal.update_group_leave_member(id,obj)

    def update_group_messages(self,id,obj):
        resp = self.__group_db_dal.update_group_messages(id,obj)
        return resp

    def delete_group(self,id):
        resp = self.__group_db_dal.delete_group(id)
        return resp