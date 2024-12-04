import CategorizeEditor from "./CategorizeEditor";
import ClozeEditor from "./ClozeEditor";
import ComprehensionEditor from "./ComprehensionEditor";

interface QuestionEditorProps {
  question: {
    _id: string;
    type: "categorize" | "cloze" | "comprehension";
    content: any;
  };
  onUpdate: (content: any) => void;
  onRemove: () => void;
}

export default function QuestionEditor({
  question,
  onUpdate,
  onRemove,
}: QuestionEditorProps) {
  const renderEditor = () => {
    switch (question.type) {
      case "categorize":
        return (
          <CategorizeEditor content={question.content} onUpdate={onUpdate} />
        );
      case "cloze":
        return <ClozeEditor content={question.content} onUpdate={onUpdate} />;
      case "comprehension":
        return (
          <ComprehensionEditor content={question.content} onUpdate={onUpdate} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 mb-4 border rounded">
      <h3 className="mb-2 text-lg font-semibold">
        {question.type.charAt(0).toUpperCase() + question.type.slice(1)}{" "}
        Question
      </h3>

      {renderEditor()}
      <button
        onClick={onRemove}
        className="px-2 py-1 mt-2 text-white bg-red-500 rounded"
      >
        Remove Question
      </button>
    </div>
  );
}
