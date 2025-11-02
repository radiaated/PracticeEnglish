import requests
from bs4 import BeautifulSoup
from google import genai
from dotenv import load_dotenv

import re
import os


load_dotenv()


google_client = genai.Client(api_key=os.environ.get("GOOGLE_API_TOKEN"))


def getSoupForWord(word):

    r = requests.get(f"https://www.merriam-webster.com/dictionary/{word}")

    soup = BeautifulSoup(r.text, "html.parser")

    return soup


def get_pronounciation_audio(word):

    soup = getSoupForWord(word=word)

    a = soup.find(attrs={"class_", "play-pron-v2"})

    audio_url = a.get("data-url")

    print(audio_url)

    update_audio_url = (
        "https://media.merriam-webster.com/audio/prons/en/us/mp3/%s/%s.mp3"
        % (word[0], audio_url.split("=")[-1])
    )

    r = requests.get(update_audio_url)

    return r.content or None


def get_pronounciation_text(word):

    soup = getSoupForWord(word=word)

    a = soup.find(attrs={"class_", "play-pron-v2"})

    return a.get_text()


def get_paragraph(prompt, length, difficulty_level):

    response = google_client.models.generate_content(
        model="gemini-2.5-pro",
        contents='For practising speaking english to pronounce, give a %s length paragraph of difficulty level %s that is related to %s. Give the response in JSON: {"paragraph": string<generated_paragraph>, "words_to_pronounce": string[]<words_to_pronounce_except_the_easier_ones_like_too_a_an_the_etc>}'
        % (length, difficulty_level, prompt),
    )

    json_regex = re.compile(r"(?:```json)?\s*(\{.*\})\s*(?:```)?", re.DOTALL)

    match = json_regex.search(response.text)

    if match:
        json_str = match.group(1)

        return json_str

    return None
