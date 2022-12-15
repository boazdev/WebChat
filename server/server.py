from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
from enconder import JSONEncoder
from enconder import SocketEncoder
from routers.user_router import users
from routers.auth_router import auth, verify_token
from routers.socket_router import SocketRouter
from routers.chat_router import chats
from routers.group_router import groups
from routers.blacklist_router import blacklists

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['SECRET_KEY'] = 'secret!'
app.json_encoder = JSONEncoder
CORS(app,resources={r"/*":{"origins":"*"}})
app.before_request(verify_token)
app.register_blueprint(users, url_prefix="/users")
app.register_blueprint(auth, url_prefix="/login")
app.register_blueprint(chats, url_prefix="/chats")
app.register_blueprint(groups, url_prefix="/groups")
app.register_blueprint(blacklists, url_prefix="/blacklists")
socketio = SocketIO(app,cors_allowed_origins="*") #json=SocketEncoder


@app.route("/http-call")
def http_call():
    """return JSON with string data as the value"""
    #print(f"client http call with sid: {request.sid}")
    data = {'data':'This text was fetched using an HTTP call to server on render'}
    return jsonify(data)



if __name__ == '__main__':
    socketio.on_namespace(SocketRouter('/'))
    socketio.run(app, debug=True,port=5001)
    
