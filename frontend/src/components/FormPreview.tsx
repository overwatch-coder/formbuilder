import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api-url";

interface Question {
  type: "categorize" | "cloze" | "comprehension";
  content: any;
}

interface Form {
  _id: string;
  title: string;
  headerImage?: string;
  questions: Question[];
}

export default function FormPreview() {
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchForm = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/forms/${id}`);
      setForm(response.data.data);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const handleResponse = (questionId: string, response: any) => {
    setResponses({ ...responses, [questionId]: response });
  };

  const submitForm = async () => {
    //  check if responses is empty and show error
    if (Object.keys(responses).length === 0) {
      toast.error("Please answer all questions");
      return;
    }

    try {
      await axios.post(`${apiUrl}/forms/${id}/submit`, {
        answers: responses,
      });
      toast.success("Form submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case "categorize":
        return (
          <div key={index} className="mb-4">
            <h2 className="mb-2 font-semibold">
              Categorize Question {index + 1}
            </h2>
            {question?.content?.image && (
              <img
                src={question?.content?.image}
                alt="Form Header"
                className="max-h-40 object-cover w-full mb-4"
              />
            )}

            <h3 className="mb-2 font-semibold">
              Categorize the following items:
            </h3>
            {question?.content?.items?.map(
              (item: string, itemIndex: number) => (
                <div key={itemIndex} className="mb-2">
                  <span>{item}</span>
                  <select
                    onChange={(e) =>
                      handleResponse(crypto.randomUUID(), e.target.value)
                    }
                    className="p-1 ml-2 border rounded"
                  >
                    <option value="">Select category</option>
                    {question.content.categories.map(
                      (category: string, catIndex: number) => (
                        <option key={catIndex} value={category}>
                          {category}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )
            )}
          </div>
        );
      case "cloze":
        return (
          <div key={index} className="mb-4">
            <h2 className="mb-2 font-semibold">Cloze Question {index + 1}</h2>

            {question?.content?.image && (
              <img
                src={question?.content?.image}
                alt="Form Header"
                className="max-h-40 object-cover w-full mb-4"
              />
            )}

            <h3 className="mb-2 font-semibold">Fill in the blanks:</h3>
            <p className="mb-2">
              {question?.content?.sentence
                .split("_")
                .map((part: string, partIndex: number, array: string[]) => (
                  <React.Fragment key={partIndex}>
                    {part}
                    {partIndex < array.length - 1 && (
                      <select
                        onChange={(e) =>
                          handleResponse(crypto.randomUUID(), e.target.value)
                        }
                        className="p-1 mx-1 border rounded"
                      >
                        <option value="">Select</option>
                        {question.content.options.map(
                          (option: string, optionIndex: number) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </React.Fragment>
                ))}
            </p>
          </div>
        );
      case "comprehension":
        return (
          <div key={index} className="mb-4">
            <h2 className="mb-2 font-semibold">
              Comprehension Question {index + 1}
            </h2>
            {question?.content?.image && (
              <img
                src={question?.content?.image}
                alt="Form Header"
                className="max-h-40 object-cover w-full mb-4"
              />
            )}

            <h3 className="mb-2 font-semibold">
              Read the passage and answer the questions:
            </h3>
            <p className="mb-4">{question.content.passage}</p>
            {question?.content?.questions?.map((q: any, qIndex: number) => (
              <div key={qIndex} className="mb-4">
                <p className="mb-2 font-semibold">{q.question}</p>
                {q.options.map((option: string, oIndex: number) => (
                  <div key={oIndex} className="mb-1">
                    <input
                      type="radio"
                      id={`q${index}-${qIndex}-o${oIndex}`}
                      name={`q${index}-${qIndex}`}
                      value={option}
                      onChange={() =>
                        handleResponse(crypto.randomUUID(), option)
                      }
                    />
                    <label
                      htmlFor={`q${index}-${qIndex}-o${oIndex}`}
                      className="ml-2"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">{form.title}</h2>
      {form.headerImage && (
        <img
          src={form.headerImage}
          alt="Form Header"
          className="max-h-40 object-cover w-full mb-4"
        />
      )}
      {form?.questions?.map((question, index) =>
        renderQuestion(question, index)
      )}

      <div className="flex items-center justify-end gap-4">
        <button
          onClick={submitForm}
          className="px-4 py-2 mt-4 text-white bg-green-600 rounded"
        >
          Submit
        </button>

        <Link
          to={"/"}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
