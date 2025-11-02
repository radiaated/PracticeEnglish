from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv


from utils import get_pronounciation_audio, get_pronounciation_text, get_paragraph

import os
import json

load_dotenv()


DEBUG = os.environ.get("DEBUG") == "True"

origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/pronounciation_audio")
def pronounciation_audio(request: Request):

    word = request.query_params.get("word")

    audio = get_pronounciation_audio(word=word)

    return Response(content=audio, media_type="audio/mpeg")


@app.get("/pronounciation_text")
def pronounciation_text(request: Request):

    word = request.query_params.get("word")

    pronounication_text = get_pronounciation_text(word=word)

    return {"type": "success", "pronounciation": {word: pronounication_text}}


@app.get("/paragraph")
def paragraph(request: Request):

    difficulty_level = request.query_params.get("difficulty")
    prompt = request.query_params.get("prompt")
    length = request.query_params.get("length")

    res = get_paragraph(prompt, length, difficulty_level)

    json_ = json.loads(res)

    return json_


if not DEBUG:
    print("Serving react files...")
    app.mount("/", StaticFiles(directory="dist/", html=True), name="static")
