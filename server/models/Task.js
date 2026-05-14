import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  correctIndex: { type: Number },
  hint: { type: String },
  img: { type: String },
  category: { type: String, enum: ["happiness", "sadness", "fear", "anger", "disgust", "surprise"] },
  questionType: { type: String, enum: ["single_choice", "ai", "true_false"] },
  ageCategory: { type: String, enum: ["junior", "middle", "senior"] },
  difficulty: { type: String, enum: ["easy", "hard"] },
  explanation: { type: String },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);
