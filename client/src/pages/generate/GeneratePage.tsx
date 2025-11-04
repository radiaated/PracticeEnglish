import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import getParagraph from "../../api/getParagraph";
import { schema } from "../../types/PromptBody";

import type { DifficultyLevel } from "../../types/DifficultuLevel";
import type { ResponseLength } from "../../types/ResponseLength";
import type { PromptBody } from "../../types/PromptBody";
import type { PromptResponse } from "../../types/PromptResponse";

const DIFFICULTY_LEVELS: DifficultyLevel[] = ["easy", "medium", "hard"];
const RESPONSE_LENGTHS: ResponseLength[] = ["short", "medium", "long"];

const GeneratePage = () => {
  const navigate = useNavigate();
  const {
    watch,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: PromptBody) => {
    const data: PromptResponse = await getParagraph(formData);
    localStorage.removeItem("currentPractice");
    localStorage.removeItem("pronounciations");
    localStorage.setItem("currentPractice", JSON.stringify(data));

    navigate("/practice");
  };

  return (
    <div className="centered-box" style={{ width: "500px", maxWidth: "90%" }}>
      <div className="border border-secondary p-4 rounded">
        <h3>Paragraph Generator</h3>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group mb-2">
            <label
              htmlFor="prompt"
              className="d-flex gap-2 align-items-center mb-2"
            >
              Prompt <span className="text-danger">*</span>{" "}
              <div className="form-check form-switch d-flex gap-2 align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="switchCheckChecked"
                  {...register("newGen")}
                  style={{ fontSize: "0.75rem" }}
                />
                <label
                  className="form-check-label"
                  htmlFor="switchCheckChecked"
                >
                  Use AI
                </label>
              </div>
            </label>
            <textarea
              disabled={isSubmitting}
              className="form-control bg-secondary text-light"
              {...register("prompt")}
              id="prompt"
              placeholder={watch("newGen") ? "AI prompt..." : "Text prompt..."}
            />
            {errors.prompt?.message && (
              <div className="form-text text-danger">
                {errors.prompt?.message}
              </div>
            )}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="difficulty-level" className="form-label">
              Difficult Level <span className="text-danger">*</span>
            </label>
            <select
              {...register("difficultyLevel")}
              disabled={isSubmitting}
              id="difficulty-level"
              className="form-select bg-secondary text-light"
            >
              {DIFFICULTY_LEVELS.map((l, i) => (
                <option value={l} key={i}>
                  {l.charAt(0).toUpperCase() + l.substring(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.difficultyLevel?.message && (
              <div className="form-text text-danger">
                {errors.difficultyLevel?.message}
              </div>
            )}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="length" className="form-label">
              Length <span className="text-danger">*</span>
            </label>
            <select
              {...register("length")}
              disabled={isSubmitting}
              id="length"
              className="form-select bg-secondary text-light"
            >
              {RESPONSE_LENGTHS.map((l, i) => (
                <option value={l} key={i}>
                  {l.charAt(0).toUpperCase() + l.substring(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.difficultyLevel?.message && (
              <div className="form-text text-danger">
                {errors.length?.message}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="d-block btn btn-light text-dark w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span role="status ">Generating...</span>
                <span
                  className="spinner-grow spinner-grow-sm ms-1"
                  aria-hidden="true"
                ></span>
              </>
            ) : (
              "Generate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeneratePage;
