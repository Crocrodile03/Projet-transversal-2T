from flask import Flask, jsonify, request
from flask_cors import CORS
import paho.mqtt.client as mqtt
import threading, json

app = Flask(__name__)
CORS(app)

state = {"temperature": 0, "led": False}

def on_message(client, userdata, msg):
    if msg.topic == "pico/temperature":
        state["temperature"] = float(msg.payload)

client = mqtt.Client()
client.on_message = on_message
client.connect("localhost", 1883)
client.subscribe("pico/temperature")
threading.Thread(target=client.loop_forever, daemon=True).start()

@app.route("/api/data")
def get_data():
    return jsonify(state)

@app.route("/api/led", methods=["POST"])
def set_led():
    state["led"] = request.json["led"]
    client.publish("pico/led", "on" if state["led"] else "off")
    return jsonify(state)

app.run(host="0.0.0.0", port=5000)