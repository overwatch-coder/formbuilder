import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "../lib/file-upload";

interface ComprehensionEditorProps {
  content: any;
  onUpdate: (content: any) => void;
}

export default function ComprehensionEditor({
  content,
  onUpdate,
}: ComprehensionEditorProps) {
  const [passage, setPassage] = useState(content.passage || "");
  const [questions, setQuestions] = useState<
    { question: string; options: string[] }[]
  >(content.questions || []);
  const [image, setImage] = useState("");

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // check if file size is bigger than 5MB
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          return;
        }

        const url = await uploadFile(file);

        setImage(url);
      }
    },
    []
  );

  const handleUpdate = useCallback(() => {
    onUpdate({ passage, questions, image });
  }, [passage, questions, image]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  const addQuestion = () =>
    setQuestions([...questions, { question: "", options: [""] }]);
  const updateQuestion = (index: number, question: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = question;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 pb-4">
        <h4 className="-mb-2 font-semibold">Add Image (Optional)</h4>
        <input
          type="file"
          accept="image/*"
          className="file:text-white file:bg-purple-500 file:border-0 file:py-2 file:px-4 file:rounded w-full p-2 border rounded"
          onChange={handleImageUpload}
        />
        {image && (
          <img
            src={image}
            alt="Header"
            className="max-h-40 object-cover w-full mt-2"
          />
        )}
      </div>

      <textarea
        value={passage}
        onChange={(e) => setPassage(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter comprehension passage"
        rows={5}
      />
      <h4 className="mb-2 font-semibold">Questions</h4>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="p-2 mb-4 border rounded">
          <input
            type="text"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder={`Question ${qIndex + 1}`}
          />
          <h5 className="mb-2 font-semibold">Options</h5>
          {q.options.map((option, oIndex) => (
            <input
              key={oIndex}
              type="text"
              value={option}
              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder={`Option ${oIndex + 1}`}
            />
          ))}
          <button
            onClick={() => addOption(qIndex)}
            className="px-2 py-1 text-white bg-purple-500 rounded"
          >
            Add Option
          </button>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="px-2 py-1 text-white bg-purple-500 rounded"
      >
        Add Question
      </button>
    </div>
  );
}
