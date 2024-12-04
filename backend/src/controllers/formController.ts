import { Request, Response } from "express";
import Form, { IForm } from "../models/Form";
import ResponseModel, { IResponse } from "../models/Response";

export const createForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const form: IForm = new Form(req.body);
    await form.save();
    res.status(201).json({
      message: "Form created successfully",
      success: true,
      data: form,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating form", error, success: false });
  }
};

export const getAllForms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const forms: IForm[] = await Form.find({});
    res.status(200).json({
      message: "Forms fetched successfully",
      success: true,
      data: forms,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching forms", error, success: false });
  }
};

export const getFormById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const form: IForm | null = await Form.findById(req.params.id);

    if (!form) {
      res.status(404).json({ message: "Form not found", success: false });
      return;
    }

    res.json({
      message: "Form fetched successfully",
      success: true,
      data: form,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching form", error, success: false });
  }
};

export const updateForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const formId = req.params.id;

    if (!formId) {
      res.status(400).json({ message: "Form ID is required", success: false });
      return;
    }

    const form: IForm | null = await Form.findById(formId);

    if (!form) {
      res.status(404).json({ message: "Form not found", success: false });
      return;
    }

    const updatedForm = await Form.findByIdAndUpdate(formId, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Form updated successfully",
      success: true,
      data: updatedForm,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating form", error, success: false });
  }
};

export const submitFormResponse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const form: IForm | null = await Form.findById(req.params.id);
    if (!form) {
      res.status(404).json({ message: "Form not found" });
      return;
    }
    const response: IResponse = new ResponseModel({
      formId: form._id,
      answers: req.body.answers,
    });
    await response.save();
    res.status(201).json({
      message: "Form response submitted successfully",
      success: true,
      data: response,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting form", error, success: false });
  }
};

export const deleteForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const formId = req.params.id;

    const form: IForm | null = await Form.findById(formId);
    if (!form) {
      res.status(404).json({ message: "Form not found" });
      return;
    }

    const removedForm = await Form.findByIdAndDelete(formId);
    if (!removedForm) {
      res.status(404).json({ message: "Form not found" });
      return;
    }

    const responses: IResponse[] = await ResponseModel.find({
      formId: removedForm._id,
    });

    for (const response of responses) {
      await ResponseModel.findByIdAndDelete(response._id);
    }

    res
      .status(200)
      .json({ message: "Form deleted successfully", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting form", error, success: false });
  }
};
