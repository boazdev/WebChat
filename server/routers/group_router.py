from flask import Blueprint,jsonify,request
from BLL.group_bl import *
from routers.auth_router import *

groups = Blueprint('groups',__name__)
groups_bl = GroupBL()

#get ALL
@groups.route("/", methods=['GET'])
def get_all_groups():
    is_userid=request.args.get("is_userid")   
    if is_userid!= None:
        groups= groups_bl.get_groups_by_userid(is_userid)
    else:
        groups = groups_bl.get_all_groups()
    return groups
    


@groups.route("/<id>",methods=['GET'])
def get_group(id):
    #group_recv = action_verify_token(groups_bl.get_group,[id])
    group_recv = groups_bl.get_group(id)
    return group_recv


@groups.route("/",methods=['POST'])
def add_group():
    obj = request.json
    resp= groups_bl.add_group(obj)
    return resp


@groups.route("/<id>",methods=['PUT'])
def update_group(id):
    obj=request.json
    resp=groups_bl.update_group(id,obj)
    return resp

@groups.route("/<id>",methods=['DELETE'])
def delete_group(id):
    obj=request.json
    resp=groups_bl.delete_group(id)
    return resp



 