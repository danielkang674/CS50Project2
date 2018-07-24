import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room, send

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channelsList = {}
chat = {}

@app.route("/", methods=["GET"])
def index():
    if request.method == "GET":
        return render_template("index.html", chat=chat)

@app.route("/createChannel", methods=["POST"])
def createChannel():
    if request.method == "POST":
        room = request.form.get("channelInput")
        chat[room] = []
        return render_template("index.html", chat=chat)

@app.route("/channel/<string:room>")
def channel(room):
    channelsList["current"] = room
    if "current" not in channelsList:
        return render_template("error.html", error=404, message='Channel does not exist')
    if room not in chat:
        return render_template("error.html", error=404, message='Channel does not exist')
    return render_template("channel.html", chat=chat, title=room, chatRooms=chat[room])

@socketio.on("post message")
def postMessage(data):
    messageDict = {"message": data["message"], "displayName": data["displayName"]}
    chat[channelsList["current"]].append(messageDict)
    while len(chat[channelsList["current"]]) > 100:
        chat[channelsList["current"]].pop(0)
    emit("all messages", messageDict, room=channelsList["current"])

@socketio.on("join")
def on_join(data):
    if "current" in channelsList:
        displayName = data["displayName"]
        room = channelsList["current"]
        join_room(room)
        emit("joined room", displayName + ' has entered the room.', room=room)

@socketio.on("leave")
def on_leave(data):
    if "current" in channelsList:
        displayName = data["displayName"]
        room = channelsList["current"]
        leave_room(room)
        emit("left room", displayName + 'has left the room.', room=room)