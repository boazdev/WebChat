from flask import request
from flask_socketio import SocketIO,emit, Namespace, leave_room
from datetime import datetime
from bson import ObjectId
from BLL.chat_bl import ChatBL
from BLL.group_bl import GroupBL
from BLL.blacklist_bl import BlacklistBL

#@socketio.on("connect")
class SocketRouter(Namespace):
    def __init__(self,path):
        super().__init__(path)
        self.__clients = {}
        self.__chat_bl = ChatBL()
        self.__group_bl = GroupBL()
        self.__blacklist_bl = BlacklistBL()

    def get_clients(self):
        return self.__clients

    def on_connect(self):
        """event listener when client connects to the server"""
        print(request.sid)
        print("client has connected")
        #request.
        """ print("environ:")
        print(request.environ) """
        username=request.headers.get("X-Username") #request.headers.get('x-access-token')
        print("username connected:")
        print(username)
        self.__clients[username] = request.sid
        
        emit("connect",{"data":f"id: {request.sid} is connected"})
        groups = self.__group_bl.get_groups_by_userid(username)
        for grp in  groups["data"]:
            self.enter_room(request.sid,room=str(grp["_id"]))

    #@socketio.on('data')
    def on_data(self,data):
        """event listener when client types a message"""
        print("data from the front end: ",str(data))
        #print(request.environ)
        
        emit("data",{'data':data,'id':request.sid},broadcast=True)
        #emit("data",{"sht":"shit",to=}

    #@socketio.on('send_to')
    def on_sendto(self,data):
        print("send to one of the clients:")
        print(str(self.__clients))
        emit("data",{'data':data,'id':request.sid},room=self.__clients["default-user"])

    def on_start_priv_chat(self,data):
        print("data from the front end: start:",str(data))
        #check block list
        curr_date = datetime.today().replace(microsecond=0)
        
        if self.__blacklist_bl.get_blacklist_single_block(data["userIdTo"],data["userIdFrom"])!=None:
            messageObj = {"content": "Message Blocked","userId":"server", "date":curr_date.strftime("%d/%m/%Y %H:%M")}
            respData = {"messageData": messageObj, "chatId": ""}
            emit("join_priv_chat", respData, room  = self.__clients[data["userIdFrom"]])
            return
        
        
        messageObj = {"content": data["message"],"userId":data["userIdFrom"], "date":curr_date
        }
        postObj = {"userIdFrom":ObjectId(data["userIdFrom"]), "userIdTo":ObjectId(data["userIdTo"]),
         "messages":[messageObj]}
        postObj["messages"][0]["userId"] = ObjectId(postObj["messages"][0]["userId"])
        resp = self.__chat_bl.add_chat(postObj)
        #print("resp obj :")
        #print(self.__clients)
        messageObj["date"] = messageObj["date"].strftime("%d/%m/%Y %H:%M")
        messageObj["userId"]=str(messageObj["userId"])
        respData = {"messageData": messageObj, "chatId": resp["chatId"]}
        print("respData join: ")
        print(respData)
        emit("join_priv_chat", respData, room  = self.__clients[data["userIdFrom"]])
        if data["userIdTo"] in self.__clients:
            emit("join_priv_chat", respData, room  = self.__clients[data["userIdTo"]])
    
    def on_data_priv_chat(self,data): #send message to both users and update db push message to array
        print("data from the front end(on_data): ",str(data))
        curr_date = datetime.today().replace(microsecond=0)

        if self.__blacklist_bl.get_blacklist_single_block(data["userIdTo"],data["userIdFrom"])!=None:
            messageObj = {"content": "Message Blocked","userId":"serverError", "date":curr_date.strftime("%d/%m/%Y %H:%M")}
            respData = {"messageData": messageObj, "chatId": data["chatDbId"]}
            emit("data_priv_chat", respData, room  = self.__clients[data["userIdFrom"]])
            return

        messageObj = {"content": data["message"],"userId":data["userIdFrom"], "date":curr_date.strftime("%d/%m/%Y %H:%M")}
        respData = {"messageData": messageObj, "chatId": data["chatDbId"]}
        emit("data_priv_chat", respData, room  = self.__clients[data["userIdFrom"]])
        if data["userIdTo"] in self.__clients:
            emit("data_priv_chat", respData, room  = self.__clients[data["userIdTo"]])
        messageObj["date"] = curr_date
        messageObj["userId"] = ObjectId(messageObj["userId"])
        self.__chat_bl.update_chat_messages(data["chatDbId"],messageObj)
    #@socketio.on("disconnect")

    def on_start_grp_chat(self,data):
        #print("data from the front end: start_grp_chat:",str(data))
        curr_date = datetime.today().replace(microsecond=0)
        message=""
        nicknamesLst=list(map(lambda member:member["nickname"],data["members"]))
        message = (', ').join(nicknamesLst)
        message += " have been added to the group"
        #print("message start: " +message)
        messageObj = {"content":message,"userId":"server","date":curr_date}
        postObj = {"name":data["name"], "creatorId":ObjectId(data["creatorId"]),"messages":[messageObj],
        "members": list(map(lambda member:ObjectId(member["userId"]),data["members"]))}
        groupIdObj = self.__group_bl.add_group(postObj)
        #print("resp: " +str(groupIdObj))
        emitObj={"groupId":groupIdObj["groupId"],"groupName":data["name"],"creatorId":data["creatorId"],
        "members": list(map(lambda member:member["userId"],data["members"])),
        "messages":[{**messageObj, "date":curr_date.strftime("%d/%m/%Y %H:%M")}]}
        #print(emitObj)
        for user in data["members"]:
            if user["userId"] in self.__clients:
                emit("join_grp_chat", emitObj,room=self.__clients[user["userId"]])
                self.enter_room(self.__clients[user["userId"]],groupIdObj["groupId"])

    def on_join_room(self,data):
        print("user "+ data["userId"] +"is joining rooms:")
        print(data["groups"])
        for roomId in data["groups"]:
            self.enter_room(sid=self.__clients[data["userId"]],room=roomId)

    def on_data_grp_chat(self,data):
        print("data from the front end: data_grp_chat:",str(data))
        curr_date = datetime.today().replace(microsecond=0)
        messageObj = {"content":data["message"],"userId":data["userIdFrom"],"date":curr_date.strftime("%d/%m/%Y %H:%M")}
        groupObj = self.__group_bl.get_group(data["chatDbId"])
        respData = {"messageData": messageObj, "chatId": data["chatDbId"]}
        """ print("rooms:")
        print(self.rooms(self.__clients[data["userIdFrom"]])) """
        emit("data_grp_chat", respData,room=data["chatDbId"])
        #for user in groupObj["members"]:
        """ if str(user) in self.__clients:
                emit("data_grp_chat", respData,room=self.__clients[str(user)]) """
            
            
        messageObj["date"] = curr_date
        self.__group_bl.update_group_messages(data["chatDbId"],messageObj)

    def on_user_add_grp(self,data):#user added to group by admin
        print("socket: on_user_add_grp: user is added to group room socket")
        curr_date = datetime.today().replace(microsecond=0)
        if data["userIdAdd"] in self.__clients:
            messageObj = {"content": "You have been added to the group","userId":"server","date":curr_date.strftime("%d/%m/%Y %H:%M")}
            emitObj={"groupId":data["groupId"],"groupName":data["groupName"],"messages":[messageObj]}            
            emit("join_grp_chat", emitObj,room=self.__clients[data["userIdAdd"]])
            self.enter_room(self.__clients[data["userIdAdd"]],room=data["groupId"])

    def on_user_remove_grp(self,data):#user removed from group by admin
        print("socket: on_user_remove_grp: user is removed from group by admin")
        curr_date = datetime.today().replace(microsecond=0)
        messageObj = {"content": data["nickname"] +" has been removed from the group","userId":"server","date":curr_date}
        self.__group_bl.update_group_remove_user(data["groupId"],data["userId"])
        self.__group_bl.update_group_messages(data["groupId"],messageObj)
        messageObj["date"] = curr_date.strftime("%d/%m/%Y %H:%M")
        emit("data_grp_chat", messageObj,room=data["groupId"])
        self.leave_room(sid=self.__clients[data["userId"]],room=data["groupId"])

    def on_disconnect(self):
        """event listener when client disconnects to the server"""
        print("user disconnected")
        #username=request.args.get("user")
        username=request.headers.get("X-Username")
        self.__clients.pop(username)
        #emit("disconnect",f"user {request.sid} disconnected",broadcast=True)