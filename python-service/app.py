from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/healthz")
def healthz():
    return jsonify(status="ok")


@app.get("/greet")
def greet():
    return jsonify(service="python-service", message="Hello from Python!")
