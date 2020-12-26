from flask import Flask, request
import uuid
import json
import os
from colorthief import ColorThief
from utils.colors import determine_text_color


app = Flask(__name__)

@app.route("/", methods=["GET"])
def picasso() -> dict:
    """Handler for service discovery

    :returns: picasso service descriptor
    :rtype: dict
    """
    return {"app": "demo-man", "svc": "picasso", "version": os.environ["VERSION"]}

@app.route("/healthz", methods=["GET"])
def healthz() -> str:
    """Cosmetic GET route to health-check the service. Used by Kubernetes' pod controller to 
    check pod health

    :returns: ok
    :rtype: str
    """
    return "ok"

@app.route("/ping", methods=["GET"])
def ping() -> str:
    """Cosmetic GET route to check the service. Can be used by users to check the responsiveness 
    of the service

    :returns: pong
    :rtype: str
    """
    return "pong"

@app.route("/palette/<no>", methods=["POST"])
def palette(no: str) -> dict:
    """Returns the dominant color palette of an image

    :param no: number of colors to calculate in the palette
    :type no: int
    :returns: theme object for API to receive
    :rtype: dict
    """
    image_url = request.json["url"]
    # print(f"Calculating color palette for cover at {image_url}")
    path = f"{os.environ['VOLUME']}{image_url}"
    palette = ColorThief(path).get_palette(color_count=int(no), quality=5)
    color = ColorThief(path).get_color(quality=5)
    # print(f"Calculated palette {palette}")
    return {
        "color": color,
        "textColor": determine_text_color(color),
        "accent": palette[1],
        "palette": palette,
    }

@app.route("/color/<quality>", methods=["POST"])
def color(quality: str) -> dict:
    """Returns the dominant color palette of an image

    :param quality: ColorThief quality parameter
    :type quality: int
    :returns: theme object for API to receive
    :rtype: dict
    """
    image_url = request.json["url"]
    path = f"{os.environ['VOLUME']}{image_url}"
    color = ColorThief(path).get_color(quality=quality)
    return {
        "color": color,
        "textColor": determine_text_color(color),
        "accent": None
    }
