from flask import Flask, request
from pydub import AudioSegment
import uuid
import soundfile
import json
import os

app = Flask(__name__)

"""
AbstractConfig contains the general config settings that both, full and small share
"""
class AbstractConfig:
  def __init__(self, obj):
    self.step_width = obj["step_width"]
    self.height = obj["height"]
    self.rounded = obj["rounded"]
    self.steps = obj["steps"]
    self.gap = obj["gap"]
    self.width = obj["step_width"] * obj["steps"]

"""
Full is a config type for full waveforms
"""
class Full(AbstractConfig):
  pass

"""
Small is a config type for small waveforms
"""
class Small(AbstractConfig):
  pass

"""
Config contains both the full and the small config parsed from a given path to a json file
"""
class Config:
  def __init__(self, path="config/config.json"):
    with open(path, "r") as f:
      d = json.load(f)
    try:
      self._full = Full(d["full"])
      self._small = Small(d["small"])
    except AttributeError:
      raise AttributeError
  @property
  def full(self):
    return self._full
  @property
  def small(self):
    return self._small

"""config initializes the config to be globally available"""
config = Config(path="config/config.json")

@app.route("/", methods=["POST"])
def wavify(): 
  url = request.json["url"]
  Logger.info("Received new wave-man request", url=url)
  wave_fn = transcode(url, vol="files")
  
  chunks = []
  Logger.info("Creating stream from wav", fn=wave_fn)
  f = open(wave_fn, "rb")
  with soundfile.SoundFile(wave_fn, "rb") as f:
    block_length = int(f.frames // config.full.steps)
    i = 0
    chunk_window = 2048
    interpolation = 16
    while i < config.full.steps and f.tell() < f.frames:
      data = f.read(chunk_window * interpolation)[::interpolation] 
      mono_block = [abs((s1 + s2) / 2) for (s1,s2) in data]
      chunk = sum(mono_block) / chunk_window
      chunks.append(chunk)
      i += 1
      f.seek(i * block_length)
  print()
  chunks_full = normalize(chunks)
  Logger.info("Reduced and normalized audio chunks", chunks=len(chunks_full))
  """Assumption that the small waveform contains exactly half the number of steps than the full one"""
  chunks_small = [(x1 + x2) / 2 for (x1,x2) in zip(chunks_full[0::2], chunks_full[1::2])]
  blocks = { "full": [], "small": [] }
  """Generate lists of SVG strings for all audio chunks"""
  for i, v in enumerate(chunks_full):
    pos, size = pos_size_tuple(i, v, config.full)
    blocks["full"] += [drawHook(pos[0], pos[1], size[0], size[1], config.full.rounded)]
    
  Logger.info("Rendered full SVG waveform")
  for i, v in enumerate(chunks_small):
    pos, size = pos_size_tuple(i, v, config.small)
    blocks["small"] += [drawHook(pos[0], pos[1], size[0], size[1], config.small.rounded)]
  Logger.info("Rendered small SVG waveform")
  cleanup(wave_fn)
  Logger.info("Cleaned up and removed wav file")
  o = {
    "full": template(config.full.width, config.full.height, "".join(blocks["full"])),
    "small": template(config.small.width, config.small.height, "".join(blocks["small"]))
  }
  print(o['full'])
  return o

"""
Handler for service discovery
"""
@app.route("/", methods=["GET"])
def waveman():
  return {"app": "demo-man", "svc": "waveman", "version": os.environ["VERSION"]}

"""
Cosmetic GET route to health-check the service. Used by Kubernetes' pod controller to check pod
health
"""
@app.route("/healthz")
def healthz():
  return "ok"

"""
Cosmetic GET route to check the service. Can be used by users to check the responsiveness of the service
"""
@app.route("/ping")
def ping():
  return "pong"

"""
Transcodes an mp3 file located at vol/fn to a waveform which we can process using streams
""" 
def transcode(fn, vol="files"):
  output_fn = str(uuid.uuid4())
  sound = AudioSegment.from_mp3(f"{vol}/{fn}")
  sound.export(f"/tmp/{output_fn}.wav", format="wav")
  Logger.info("Finished transcoding mp3 to wav", source=fn, target=output_fn, vol=vol)
  return f"/tmp/{output_fn}.wav"

"""
Calculates pair of position and size for the currently (i-th) inspected value of 
the reduced samples 
"""
def pos_size_tuple(i, v, config):
  pos =  (i * (config.step_width), (0.5 * config.height) - (0.5 * v * config.height))
  size = (config.step_width - config.gap, v * config.height)
  return pos, size

"""
This draw hook is responsible for writing the actual svg element dependend on the
data point previously calculated in the read audio logic.
This way, we can easily patch in different drawing routines.
"""
def drawHook(x, y, w, h, r, c='{{.color}}'):
  return f'<rect width="{w}" height="{h}" x="{x}" y="{y}" rx="{r}" ry="{r}"/>'
  # return f'h{w/4} v{h/2} h{w/4} v-{h} h{w/4} v{h/2} '
  # return f'l {w/4} {h/2} l {w/2} -{h} l {w/4} {h/2} '

"""
Binds the calculated svg elements into the SVG canvas, which is the final template in question
This string is then responded to the client
"""
def template(w, h, d):
  style = "<defs><style>rect { fill: {{.color}}; }</style></defs>"
  return f'<svg baseProfile="tiny" height="100%" preserveAspectRatio="none" version="1.2" viewBox="0 0 {w} {h}" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink">{style}{d}</svg>'
  # return f'<svg baseProfile="tiny" height="100%" preserveAspectRatio="none" version="1.2" viewBox="0 0 {w} {h}" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink"><defs/><path stroke="black" fill="transparent" d="M 0 {h/2} {d}"></path></svg>'

"""
Normalizes a given list of numbers
"""
def normalize(l):
  m = max([abs(x) for x in l])
  return [x / m for x in l]

class Logger:
  """
  Small JSON logger using keyworded varargs

  @param msg logger status message
  @param **kwargs keyworded logger values
  """
  @staticmethod
  def info(msg, **kwargs):
    log_obj = Logger._log(msg, kwargs)
    print(f"[INFO] {log_obj}")

  """
  Small JSON logger using keyworded varargs

  @param msg logger status message
  @param **kwargs keyworded logger values
  """
  @staticmethod
  def error(msg, **kwargs):
    log_obj = Logger._log(msg, kwargs)
    print(f"[ERROR] {log_obj}")

  @staticmethod
  def _log(msg, kwargs):
    log_obj = {}
    for key in kwargs:
      log_obj[key] = kwargs[key]
    log_obj['msg'] = msg
    return log_obj

"""
Simply removes a file located at fn
"""
def cleanup(fn):
  os.unlink(fn)
  return True