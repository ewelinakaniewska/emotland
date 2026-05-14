import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
    title: { type: String },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    }],
    xPercent: { type: Number, required: true },
    yPercent: { type: Number, required: true },
    chapter: {
         type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
    }


}, { timestamps: true });

export const Block = mongoose.model("Block", blockSchema);
