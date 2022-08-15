import json
import os

from flask import Flask, request
from os import listdir, system
from os.path import isfile, join, splitext
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3

directory = "D:\_MusicLibrary"
songs = []
for file in [f for f in listdir(directory) if isfile(join(directory, f))]:
    path = join(directory, file)
    _, extension = splitext(path)

    if extension != ".mp3":
        continue

    audio = MP3(path, ID3=EasyID3)

    try:
        title = audio["title"][0]
        songs.append(title.lower().strip())
        # artists = audio["artist"]
        # genre = audio["genre"]
    except:
        continue
print(len(songs))
app = Flask(__name__)

@app.route("/", methods=["POST"])
def result():
    os.system("cls")
    if request.json["title"].lower().strip() in songs:
        return json.dumps(True)

    return json.dumps(False)