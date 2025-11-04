import axios from "axios";
import type { PromptResponse } from "../types/PromptResponse";
import type { PromptBody } from "../types/PromptBody";

const getParagraph = async (body: PromptBody): Promise<PromptResponse> => {
  const { data } = await axios({
    method: "POST",
    url: import.meta.env.VITE_API_URL + "/paragraph",
    data: body,
  });
  return data;
};

export default getParagraph;
