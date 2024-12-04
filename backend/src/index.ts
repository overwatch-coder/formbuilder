import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import formRoutes from "./routes/formRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/formbuilder"
);

app.use("/api/forms", formRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
