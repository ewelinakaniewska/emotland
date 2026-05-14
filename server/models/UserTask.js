import mongoose from "mongoose";

const userTaskSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  block: { type: mongoose.Schema.Types.ObjectId, ref: "Block", required: true },
  attempt: {type: String},
  correct: {type: Boolean, required: true},
  time_taken: {type: Number }, 
  score: {type: Number},
  selected_answer: {type: Number},
  comment: {type: String}
}, { timestamps: true });

export const UserTask = mongoose.model("UserTask", userTaskSchema);
