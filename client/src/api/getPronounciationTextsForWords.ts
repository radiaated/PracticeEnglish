import axios from "axios";
import type { Pronounciation } from "../types/Pronounciation";

const getPronounciationTextsForWords = async (
  words: string[]
): Promise<Pronounciation> => {
  const { data }: { data: { pronounciations: Pronounciation } } = await axios({
    method: "POST",
    url: import.meta.env.VITE_API_URL + "/pronounciation_text",
    data: {
      words: words,
    },
  });

  return data.pronounciations;
};

export default getPronounciationTextsForWords;
