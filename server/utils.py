import requests
from bs4 import BeautifulSoup
from google import genai
from dotenv import load_dotenv

import re
import os
import json


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


def get_pronounciation_text_for_words(words):

    pronuns = {}

    for word in words:

        try:

            soup = getSoupForWord(word=word)

            a = soup.find(attrs={"class_", "play-pron-v2"})

            pronuns[word] = a.get_text()

        except Exception as e:
            print(f"[GRACED]: Can't get pronuns for word '{word}'")
            print("[GRACED] Cause of error: " + str(e))

    return pronuns


def get_paragraph(prompt, length, difficulty_level, is_new_gen):

    if is_new_gen:

        response = google_client.models.generate_content(
            model="gemini-2.5-pro",
            contents='For practising speaking english to pronounce, give a %s length paragraph of difficulty level %s that is related to %s. Give the response in JSON: {"paragraph": string<generated_paragraph>, "words_to_pronounce": string[]<words_to_pronounce_except_pronouns_auxilliary_verbs_article_words_etc_convert_all_words_to_lowercase>}'
            % (length, difficulty_level, prompt),
        )

    else:
        response = google_client.models.generate_content(
            model="gemini-2.5-pro",
            contents='For practising speaking english to pronounce from the text "%s", Give the response in JSON: {"words_to_pronounce": string[]<words_to_pronounce_except_pronouns_auxilliary_verbs_article_words_etc_convert_all_words_to_lowercase>}'
            % (prompt),
        )

    json_regex = re.compile(r"(?:```json)?\s*(\{.*\})\s*(?:```)?", re.DOTALL)
    match = json_regex.search(response.text)

    if match:
        json_str = match.group(1)

        json_ = json.loads(json_str)

        if not is_new_gen:

            json_["paragraph"] = prompt

        return json_

    return None
