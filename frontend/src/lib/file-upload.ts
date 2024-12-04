import axios from "axios";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    formData
  );

  if (!response.data.secure_url) {
    throw new Error("Error uploading file");
  }

  return response.data.secure_url as string;
};
