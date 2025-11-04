import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import getPronounciationTextsForWords from "../../api/getPronounciationTextsForWords";

import type { PromptResponse } from "../../types/PromptResponse";
import type { Pronounciation } from "../../types/Pronounciation";

const PracticePage = () => {
  const navigate = useNavigate();

  const [text, setText] = useState<string | null>(null);
  const [proWords, setProWords] = useState<Pronounciation | null>(null);
  const [showPronounciation, setShowPronounciation] = useState<boolean>(true);

  let [pronounciationAudio, setPronounciationAudio] =
    useState<HTMLAudioElement | null>(null);
  let currentWordButtonElement = useRef<HTMLButtonElement | null>(null);

  const onPronounceClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    word: string
  ) => {
    const audio_ = new Audio(
      import.meta.env.VITE_API_URL +
        `/pronounciation_audio?word=${word.toLowerCase()}`
    );
    setPronounciationAudio(audio_);

    currentWordButtonElement.current = event.currentTarget;

    audio_.play();
  };

  const onClickShowPronounciation = () => {
    setShowPronounciation((prev) => {
      const newValue = !prev;
      localStorage.setItem("showPronounciation", newValue ? "1" : "0");
      return newValue;
    });
  };

  useEffect(() => {
    const currPractice = localStorage.getItem("currentPractice");

    if (currPractice) {
      const parsedCurrPractice: PromptResponse = JSON.parse(currPractice);
      setText(parsedCurrPractice.paragraph);
      const pronounciations = localStorage.getItem("pronounciations");

      if (pronounciations) {
        const parsedPronounciations: Pronounciation =
          JSON.parse(pronounciations);
        setProWords(parsedPronounciations);
      } else {
        getPronounciationTextsForWords(
          parsedCurrPractice.words_to_pronounce
        ).then((words) => {
          localStorage.setItem("pronounciations", JSON.stringify(words));
          setProWords(words);
        });
      }

      const showPronounciation_ = localStorage.getItem("showPronounciation");

      if (showPronounciation_) {
        setShowPronounciation(!!+showPronounciation_);
      }
    } else {
      navigate("/generate");
    }
  }, []);

  useEffect(() => {
    if (pronounciationAudio && currentWordButtonElement.current) {
      pronounciationAudio.onplaying = function () {
        currentWordButtonElement.current?.classList.add(
          "pronounciation-playing"
        );
      };
      pronounciationAudio.onended = function () {
        currentWordButtonElement.current?.classList.remove(
          "pronounciation-playing"
        );
        pronounciationAudio.load();
      };
    }
  }, [pronounciationAudio]);

  return (
    <div
      className="centered-box main-container"
      style={{
        transform: "translate(-50%, -50%)",
        maxHeight: "90%",
      }}
    >
      <h5 className="w-100 text-center">Response</h5>

      <div className="form-check form-switch d-flex w-100 justify-content-end gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="switchCheckDefault"
          checked={showPronounciation}
          onChange={() => onClickShowPronounciation()}
        />
        <label className="form-check-label" htmlFor="switchCheckDefault">
          {showPronounciation ? "Show Pronounciation" : "Hide pronounciation"}
        </label>
      </div>

      <div className="border border-secondary p-4 rounded">
        <div>
          {text?.split(/\r?\n/).map((paragraph: string, idx_) => (
            <p
              className="d-flex"
              style={{ flexWrap: "wrap", columnGap: "0.35em" }}
              key={idx_}
            >
              {paragraph.split(" ").map((word, idx) => (
                <span
                  key={idx}
                  className="d-flex flex-column align-items-center"
                >
                  <span className="word">{word}</span>

                  {showPronounciation &&
                    proWords &&
                    proWords[word.replace(/[.|,]/, "").toLowerCase()] && (
                      <button
                        className={"pronounciation btn text-light"}
                        onClick={(event) => onPronounceClick(event, word)}
                      >
                        {proWords[word.replace(/[.|,]/, "").toLowerCase()]}
                      </button>
                    )}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
