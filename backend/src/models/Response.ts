import mongoose, { Document, Schema } from 'mongoose';

export interface IResponse extends Document {
  formId: mongoose.Types.ObjectId;
  answers: any;
  submittedAt: Date;
}

const ResponseSchema: Schema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  answers: {
    type: Schema.Types.Mixed,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IResponse>('Response', ResponseSchema);

