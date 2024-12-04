import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "../lib/file-upload";

interface CategorizeEditorProps {
  content: any;
  onUpdate: (content: any) => void;
}

export default function CategorizeEditor({
  content,
  onUpdate,
}: CategorizeEditorProps) {
  const [categories, setCategories] = useState<string[]>(
    content.categories || [""]
  );
  const [items, setItems] = useState<string[]>(content.items || [""]);
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
    onUpdate({ categories, items, image });
  }, [categories, items, image]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  const addCategory = () => setCategories([...categories, ""]);

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const addItem = () => setItems([...items, ""]);
  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 pb-4">
        <h4 className="-mb-2 font-semibold">Add Image (Optional)</h4>
        <input
          type="file"
          accept="image/*"
          className="file:text-white file:bg-blue-500 file:border-0 file:py-2 file:px-4 file:rounded w-full p-2 border rounded"
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

      <h4 className="mb-2 font-semibold">Categories</h4>
      {categories.map((category, index) => (
        <input
          key={index}
          type="text"
          value={category}
          onChange={(e) => updateCategory(index, e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder={`Category ${index + 1}`}
        />
      ))}
      <button
        onClick={addCategory}
        className="px-2 py-1 mb-4 text-white bg-blue-500 rounded"
      >
        Add Category
      </button>

      <h4 className="mb-2 font-semibold">Items</h4>
      {items.map((item, index) => (
        <input
          key={index}
          type="text"
          value={item}
          onChange={(e) => updateItem(index, e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder={`Item ${index + 1}`}
        />
      ))}

      <button
        onClick={addItem}
        className="px-2 py-1 text-white bg-blue-500 rounded"
      >
        Add Item
      </button>
    </div>
  );
}
