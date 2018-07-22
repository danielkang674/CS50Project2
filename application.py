import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = []

@app.route("/")
def index():
    return render_template("index.html", messages=messages)

@socketio.on("post message")
def postMessage(data):
    messageDict = {"message": data["message"], "displayName": data["displayName"]}
    messages.append(messageDict)
    emit("all messages", messageDict, broadcast=True)