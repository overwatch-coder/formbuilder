import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "../lib/file-upload";

interface ClozeEditorProps {
  content: any;
  onUpdate: (content: any) => void;
}

export default function ClozeEditor({ content, onUpdate }: ClozeEditorProps) {
  const [sentence, setSentence] = useState(content.sentence || "");
  const [options, setOptions] = useState<string[]>(content.options || []);

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
    onUpdate({ sentence, options, image });
  }, [sentence, options, image]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 pb-4">
        <h4 className="-mb-2 font-semibold">Add Image (Optional)</h4>
        <input
          type="file"
          accept="image/*"
          className="file:text-white file:bg-green-500 file:border-0 file:py-2 file:px-4 file:rounded w-full p-2 border rounded"
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
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        placeholder="Enter sentence with blanks (use _ for blanks)"
        rows={3}
      />
      <h4 className="mb-2 font-semibold">Options</h4>
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => updateOption(index, e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder={`Option ${index + 1}`}
        />
      ))}

      <button
        onClick={addOption}
        className="px-2 py-1 text-white bg-green-500 rounded"
      >
        Add Option
      </button>
    </div>
  );
}
