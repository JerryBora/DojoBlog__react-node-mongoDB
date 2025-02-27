import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  image: String, // Optional: For featured images
});

export default mongoose.model("Post", postSchema);