import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title: {type: String, required:true},
    text: {type: String, required:true},
    images: [String],
    category: [{type: String}],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }

}, { timestamps: true });   

export const Article = mongoose.model("Article", articleSchema);
