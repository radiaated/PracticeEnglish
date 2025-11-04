import * as yup from "yup";

export const schema = yup.object({
  prompt: yup.string().required("Prompt is required."),
  difficultyLevel: yup.string().required("Difficulty level is required."),
  length: yup.string().required("Length is required."),
  newGen: yup.boolean().default(false).required("New generation is required."),
});
export type PromptBody = yup.InferType<typeof schema>;
