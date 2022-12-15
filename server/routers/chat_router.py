from flask import Blueprint,jsonify,request
from BLL.chat_bl import *
from routers.auth_router import *

chats = Blueprint('chats',__name__)
chats_bl = ChatBL()

#get ALL
@chats.route("/", methods=['GET'])
def get_all_chats():
    is_userid=request.args.get("is_userid")   
    if is_userid!= None:
        chats= chats_bl.get_chats_by_userid(is_userid)
    else:
        chats = chats_bl.get_all_chats()
    return chats


@chats.route("/<id>",methods=['GET'])
def get_chat(id):
    
    chat_recv = chats_bl.get_chat(id)
    return chat_recv


@chats.route("/",methods=['POST'])
def add_chat():
    obj = request.json
    resp= chats_bl.add_chat(obj)
    return resp


@chats.route("/<id>",methods=['PUT'])
def update_chat(id):
    obj=request.json
    resp=chats_bl.update_chat(id,obj)
    return resp

@chats.route("/<id>",methods=['DELETE'])
def delete_chat(id):
    obj=request.json
    resp=chats_bl.delete_chat(id)
    return resp



 