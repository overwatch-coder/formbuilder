import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuestionEditor from "./QuestionEditor";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api-url";
import { uploadFile } from "../lib/file-upload";

interface Question {
  _id: string;
  type: "categorize" | "cloze" | "comprehension";
  content: any;
}

export default function FormEditor() {
  const [formTitle, setFormTitle] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchForm = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/forms/${id}`);
      const form = response.data.data;
      setFormTitle(form.title);
      setHeaderImage(form.headerImage || "");
      setQuestions(form.questions);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const addQuestion = useCallback(
    (type: "categorize" | "cloze" | "comprehension") => {
      const newQuestion: Question = {
        _id: crypto.randomUUID(),
        type,
        content: {},
      };
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    },
    []
  );

  const updateQuestion = useCallback((id: string, content: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q._id === id ? { ...q, content } : q))
    );
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== id));
  }, []);

  const handleHeaderImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // check if file size is bigger than 5MB
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          return;
        }

        const url = await uploadFile(file);

        setHeaderImage(url);
      }
    },
    []
  );

  const saveForm = useCallback(async () => {
    try {
      const formData = {
        title: formTitle,
        headerImage,
        questions: questions.map(({ type, content }) => ({ type, content })),
      };

      if (!formData.title) {
        toast.error("Form title is required");
        return;
      }

      if (formData.questions.length === 0) {
        toast.error("Form must have at least one question");
        return;
      }

      if (id) {
        await axios.put(`${apiUrl}/forms/${id}`, formData);
        toast.success("Form updated successfully!");
      } else {
        await axios.post(`${apiUrl}/forms`, formData);
        toast.success("Form created successfully!");
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error saving form:", error);
      toast.error("Error saving form");
    }
  }, [formTitle, headerImage, questions, id, navigate]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        {id ? "Edit Form" : "Create Form"}
      </h2>
      <input
        type="text"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        placeholder="Form Title"
        className="w-full p-2 mb-4 border rounded"
      />

      <div className="mb-4">
        <label className="block mb-2">Header Image</label>
        <input
          type="file"
          onChange={handleHeaderImageUpload}
          className="file:text-white file:bg-gray-500 file:border-0 file:py-2 file:px-4 file:rounded w-full p-2 mb-2 border rounded"
          accept="image/*"
        />
        {headerImage && (
          <img
            src={headerImage}
            alt="Header"
            className="max-h-40 object-cover w-full mt-2"
          />
        )}
      </div>

      <div className="mb-4">
        <button
          onClick={() => addQuestion("categorize")}
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
        >
          Add Categorize
        </button>

        <button
          onClick={() => addQuestion("cloze")}
          className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
        >
          Add Cloze
        </button>

        <button
          onClick={() => addQuestion("comprehension")}
          className="px-4 py-2 text-white bg-purple-500 rounded"
        >
          Add Comprehension
        </button>
      </div>
      {useMemo(
        () =>
          questions.map((question) => (
            <QuestionEditor
              key={question._id}
              question={question}
              onUpdate={(content) => updateQuestion(question._id, content)}
              onRemove={() => removeQuestion(question._id)}
            />
          )),
        [questions, updateQuestion, removeQuestion]
      )}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={saveForm}
          className="px-4 py-2 mt-4 text-white bg-green-600 rounded"
        >
          Save Form
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
