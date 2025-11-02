import axios from "axios";
import type { PromptResponse } from "../types/PromptResponse";
import type { PromptBody } from "../types/PromptBody";

const getParagraph = async ({
  prompt,
  difficultyLevel,
  length,
}: PromptBody): Promise<PromptResponse> => {
  const { data } = await axios({
    method: "GET",
    url:
      import.meta.env.VITE_API_URL +
      `/paragraph?prompt=${prompt}&difficulty=${difficultyLevel}&length=${length}`,
  });
  return data;
};

export default getParagraph;
