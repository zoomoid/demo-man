from flask import Flask, request
import uuid
import json
import os
from colorthief import ColorThief

app = Flask(__name__)

"""
Handler for service discovery
"""
@app.route("/", methods=["GET"])
def waveman():
  return {"app": "demo-man", "svc": "picasso", "version": os.environ["VERSION"]}


"""
Cosmetic GET route to health-check the service. Used by Kubernetes' pod controller to check pod
health
"""
@app.route("/healthz", methods=["GET"])
def healthz():
  return "ok"

"""
Cosmetic GET route to check the service. Can be used by users to check the responsiveness of the service
"""
@app.route("/ping", methods=["GET"])
def ping():
  return "pong"

"""
Returns the dominant color palette of an image
"""
@app.route("/palette/<no>", methods=["POST"])
def palette(no):
  image_url = request.json["url"]
  print(f"Calculating color palette for cover at {image_url}")
  path = f"{os.environ['VOLUME']}{image_url}"
  palette = ColorThief(path).get_palette(color_count=int(no), quality=5)
  print(f"Calculated palette {palette}")
  return {"palette": palette}


"""
Returns the dominant color palette of an image
"""
@app.route("/color/<quality>", methods=["POST"])
def color(quality):
  image_url = request.json["url"]
  path = f"{os.environ['VOLUME']}{image_url}"
  palette = ColorThief(path).get_color(quality=quality)
  return {"color": color}
