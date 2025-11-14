import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // Tên sách
    author: { type: String, required: true },       // Tác giả
    category: { type: String, required: true },     // Thể loại
    year: { type: Number, required: true },         // Năm xuất bản
    description: { type: String },                  // Mô tả
    quantity: { type: Number, default: 1 },         // Số lượng sách hiện có
    image: { type: String },                        // Link ảnh bìa
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
