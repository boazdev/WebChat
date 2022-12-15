from flask import Blueprint,jsonify, request, make_response

from BLL.auth_bl import AuthBL

auth = Blueprint('auth', __name__)

auth_bl = AuthBL()

""" def foo():
    print("request headers:")
    print(request.headers)
    return None """

def verify_token():
    #print("query string: " + str(request.path))
    #print(request.headers)
    #print("request method: " +request.method +" " + request.path)
    if request.method=="OPTIONS":# and request.path=="/users":
        return None
    if request.path=="/login":
        return None
    if request.headers and request.headers.get('x-access-token'):
        token = request.headers.get('x-access-token')
        is_verified = auth_bl.verify_token(token)
        #print("verifying token...")
        if(not is_verified):
            return make_response({"error" : "token error" },401)
        else:
            return None
    else:
        return make_response({"error" : "Unauthorized. No Token Provided" },401)

@auth.route("/", methods=['POST'])
def login():
    username = request.json["username"]
    password = request.json["password"]

    token = auth_bl.get_token(username,password)
    if token == "username_error":
        return make_response({"error" : "Incorrect username" },401)
    elif token=="user_not_created":
        return make_response({"error" : "Username was not created" },401)
    elif token=="password_error":
        return make_response({"error" : "Incorrect password" },401)
    else:
        return make_response({"token" : token},200)