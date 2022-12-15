from flask import Blueprint,jsonify,request,make_response
from BLL.user_bl import *
from routers.auth_router import *

users = Blueprint('users',__name__)
users_bl = UserBL()

#get ALL
@users.route("/", methods=['GET'])
def get_all_users():
    #is_existing=request.args.get("is_existing")
    #print(is_existing)
    #users = action_verify_token(users_bl.get_all_users,[is_existing])
    users = users_bl.get_all_users()
    return users


@users.route("/<id>",methods=['GET'])
def get_user(id):
    #user_recv = action_verify_token(users_bl.get_user,[id])
    user_recv = users_bl.get_user(id)
    return user_recv


@users.route("/",methods=['POST'])
def add_user():
    obj = request.json
    resp= users_bl.add_user(obj)
    if resp==403:
        return make_response({"error" : "Username already exists"},403)
    return resp


@users.route("/<id>",methods=['PUT'])
def update_user(id):
    obj=request.json
    resp=users_bl.update_user(id,obj)
    return resp

@users.route("/<id>",methods=['DELETE'])
def delete_user(id):
    obj=request.json
    resp=users_bl.delete_user(id)
    return resp



 