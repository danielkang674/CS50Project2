import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

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
    return render_template("channel.html", chat=chat[room], title=room)

@socketio.on("post message")
def postMessage(data):
    messageDict = {"message": data["message"], "displayName": data["displayName"]}
    chat[channelsList["current"]].append(messageDict)
    emit("all messages", messageDict, room=channelsList["current"], broadcast=True)

@socketio.on("join")
def on_join(data):
    displayName = data["displayName"]
    room = channelsList["current"]
    join_room(room)
    emit(displayName + ' has entered the room.', room=room)