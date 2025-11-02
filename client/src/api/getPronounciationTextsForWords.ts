import axios from "axios";
import type { Pronounciation } from "../types/Pronounciation";

const getPronounciationTextsForWords = async (
  words: string[]
): Promise<Pronounciation> => {
  const res = await Promise.all(
    words.map((word) =>
      axios({
        method: "GET",
        url:
          import.meta.env.VITE_API_URL +
          `/pronounciation_text?word=${word.toLowerCase()}`,
      })
    )
  );

  let result = {};

  res.forEach(
    ({ data }: { data: { pronounciation: Pronounciation } }) =>
      (result = { ...result, ...data.pronounciation })
  );
  return result;
};

export default getPronounciationTextsForWords;
