import express from "express";
import {
  createForm,
  deleteForm,
  getAllForms,
  getFormById,
  submitFormResponse,
  updateForm,
} from "../controllers/formController";

const router = express.Router();

router.get("/", getAllForms);
router.post("/", createForm);
router.get("/:id", getFormById);
router.put("/:id", updateForm);
router.post("/:id/submit", submitFormResponse);
router.delete("/:id", deleteForm);

export default router;
