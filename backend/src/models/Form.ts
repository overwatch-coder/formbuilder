import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  type: "categorize" | "cloze" | "comprehension";
  content: any;
}

export interface IForm extends Document {
  title: string;
  headerImage?: string;
  questions: IQuestion[];
}

const QuestionSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["categorize", "cloze", "comprehension"],
    required: true,
  },
  content: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const FormSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  headerImage: String,
  questions: [QuestionSchema],
});

export default mongoose.model<IForm>("Form", FormSchema);
