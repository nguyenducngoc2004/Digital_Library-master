import express from "express";
import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🟢 Người dùng mượn sách
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book)
      return res.status(404).json({ message: "Không tìm thấy sách" });

    if (book.quantity <= 0)
      return res.status(400).json({ message: "Sách đã hết" });

    const existingBorrow = await Borrow.findOne({
      userId,
      bookId,
      status: "borrowed",
    });
    if (existingBorrow)
      return res.status(400).json({
        message: "Bạn đã mượn sách này và chưa trả",
      });

    const borrow = new Borrow({
      userId,
      bookId,
      borrowDate: new Date(),
      status: "borrowed",
    });

    book.quantity -= 1;
    await book.save();
    await borrow.save();

    res.status(201).json({
      message: "Mượn sách thành công",
      borrow,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

/**
 * 🟡 Người dùng trả sách
 */
router.put("/:id/return", verifyToken, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow)
      return res.status(404).json({ message: "Không tìm thấy bản ghi mượn" });

    if (borrow.userId.toString() !== req.user.id)
      return res.status(403).json({
        message: "Bạn không có quyền trả sách này",
      });

    if (borrow.status === "returned")
      return res.status(400).json({ message: "Sách này đã được trả" });

    borrow.status = "returned";
    borrow.returnDate = new Date();
    await borrow.save();

    await Book.findByIdAndUpdate(borrow.bookId, { $inc: { quantity: 1 } });

    res.json({
      message: "Trả sách thành công",
      borrow,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

/**
 * 🔵 Admin xem toàn bộ danh sách mượn
 */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("userId", "username email")
      .populate("bookId", "title author");
    res.json(borrows);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

/**
 * 🟢 Người dùng xem danh sách sách đã mượn của chính mình
 * 🔹 Tự động lọc bỏ các sách bị admin xóa hoặc borrow có bookId null
 */
router.get("/my-borrows", verifyToken, async (req, res) => {
  try {
    const borrows = await Borrow.find({
      userId: req.user.id,
      status: { $ne: "deleted" }, // bỏ các bản ghi đã bị đánh dấu xóa
    })
      .populate("bookId", "title author category year image")
      .sort({ borrowDate: -1 });

    // 🔹 Lọc thêm (phòng trường hợp bookId bị null)
    const validBorrows = borrows.filter((b) => b.bookId !== null);

    res.json(validBorrows);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

export default router;
