import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app import app


def test_healthz():
    res = app.test_client().get("/healthz")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


def test_greet():
    res = app.test_client().get("/greet")
    assert res.get_json()["service"] == "python-service"
