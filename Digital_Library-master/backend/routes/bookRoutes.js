import express from "express";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================
   🔍 TÌM KIẾM SÁCH (đặt TRƯỚC /:id để tránh lỗi)
=============================================== */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
    }

    // Regex không phân biệt hoa/thường
    const regex = new RegExp(q, "i");

    // Tìm theo tên, tác giả, thể loại
    const books = await Book.find({
      $or: [
        { title: { $regex: regex } },
        { author: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    }).limit(30); // giới hạn số kết quả để tránh nặng server

    res.json(books);
  } catch (err) {
    console.error("❌ Lỗi tìm kiếm sách:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ============================================
   🟢 LẤY DANH SÁCH TẤT CẢ SÁCH
=============================================== */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách sách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ============================================
   🟣 LẤY CHI TIẾT 1 SÁCH
=============================================== */
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.json(book);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết sách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ============================================
   🔵 ADMIN: THÊM SÁCH
=============================================== */
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, author, category, year, description, quantity, image } = req.body;

    if (!title || !author || !category || !year) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin sách" });
    }

    const newBook = new Book({
      title,
      author,
      category,
      year,
      description,
      quantity,
      image,
    });

    await newBook.save();
    res.status(201).json({ message: "✅ Thêm sách thành công", book: newBook });
  } catch (err) {
    console.error("❌ Lỗi khi thêm sách:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

/* ============================================
   🟡 ADMIN: CẬP NHẬT SÁCH
=============================================== */
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.json({ message: "Cập nhật thành công", book: updatedBook });
  } catch (err) {
    console.error("❌ Lỗi cập nhật sách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ============================================
   🔴 ADMIN: XÓA SÁCH
=============================================== */
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Không tìm thấy sách" });

    // Cập nhật các borrow liên quan
    await Borrow.updateMany(
      { bookId: req.params.id },
      { $set: { status: "deleted", bookId: null } }
    );

    res.json({ message: "Đã xóa sách và cập nhật borrow liên quan" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa sách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
