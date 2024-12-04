import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import formRoutes from "./routes/formRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger.json";

dotenv.config();

const SWAGGER_UI_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.1/swagger-ui.css";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://formbuilder-super.vercel.app"],
  })
);

app.use(express.json());

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/formbuilder"
);

app.use("/api/forms", formRoutes);

app.use(
  "*/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { customCssUrl: SWAGGER_UI_CSS_URL })
);

app.use("*", (req, res) => {
  res.status(200).json({ message: "API working fine", success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
