from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv


from utils import (
    get_pronounciation_audio,
    get_pronounciation_text_for_words,
    get_paragraph,
)

import os

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


class PronounciationBody(BaseModel):
    words: List[str]


@app.post("/pronounciation_text")
def pronounciation_text(pronounciation: PronounciationBody):

    pronounication_texts = get_pronounciation_text_for_words(words=pronounciation.words)

    return {"type": "success", "pronounciations": pronounication_texts}


class PromptBody(BaseModel):
    prompt: str
    difficultyLevel: str
    length: str
    newGen: bool


@app.post("/paragraph")
def paragraph(prompt_body: PromptBody):

    json_ = get_paragraph(
        prompt=prompt_body.prompt,
        length=prompt_body.length,
        difficulty_level=prompt_body.difficultyLevel,
        is_new_gen=prompt_body.newGen,
    )

    return json_


if not DEBUG:
    print("Serving react files...")
    app.mount("/", StaticFiles(directory="dist/", html=True), name="static")
