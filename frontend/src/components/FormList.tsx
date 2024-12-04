import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../lib/api-url";

interface Form {
  _id: string;
  title: string;
}

export default function FormList() {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get(`${apiUrl}/forms`);
      setForms(response.data.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const handleDelete = async (formId: string) => {
    try {
      await axios.delete(`${apiUrl}/forms/${formId}`);
      fetchForms();
      toast.success("Form deleted successfully!");
    } catch (error) {
      console.error("Error deleting form:", error);
      toast.error("Error deleting form. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Forms</h2>
      <Link
        to="/create"
        className="inline-block px-4 py-2 mb-4 text-white bg-green-500 rounded"
      >
        Create New Form
      </Link>
      <ul className="space-y-2">
        {forms.map((form) => (
          <li key={form._id} className="p-4 border rounded">
            <span className="pb-4 font-semibold">{form.title}</span>
            <div className="flex items-center gap-4 mt-4">
              <Link
                to={`/edit/${form._id}`}
                className="px-2 py-1 text-white bg-blue-500 rounded"
              >
                Edit
              </Link>
              <Link
                to={`/preview/${form._id}`}
                className="px-2 py-1 text-white bg-purple-500 rounded"
              >
                Preview
              </Link>
              <button
                onClick={() => handleDelete(form._id)}
                className="px-2 py-1 text-white bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
