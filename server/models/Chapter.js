import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  blocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block"
  }],
  difficulty: { type: String, enum: ["easy", "hard"] },
  img: { type: String, required: true },
  ageCategory: { type: String },
  assignedChildren: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }], 
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },


}, { timestamps: true });

export const Chapter = mongoose.model("Chapter", chapterSchema);
