from flask import Blueprint,jsonify,request
from BLL.blacklist_bl import *

blacklists = Blueprint('blacklists',__name__)
blacklists_bl = BlacklistBL()

#get ALL
@blacklists.route("/", methods=['GET'])
def get_all_blacklists():
    blacklists = blacklists_bl.get_all_blacklists()
    return blacklists


@blacklists.route("/<id>",methods=['GET'])
def get_blacklist(id):
    
    blacklist_recv = blacklists_bl.get_blacklist(id)
    return blacklist_recv


@blacklists.route("/",methods=['POST'])
def add_blacklist():
    obj = request.json
    resp= blacklists_bl.add_blacklist(obj)
    return resp


@blacklists.route("/<id>",methods=['PUT'])
def update_blacklist(id):
    obj=request.json
    resp=blacklists_bl.update_blacklist(id,obj)
    return resp

@blacklists.route("/<id>",methods=['DELETE'])
def delete_blacklist(id):
    resp=blacklists_bl.delete_blacklist(id)
    return resp



 