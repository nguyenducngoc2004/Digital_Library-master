import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import Borrow from "../models/Borrow.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const mode = req.query.mode || "month"; // ✅ month | week
    const currentYear = new Date().getFullYear();
    const now = new Date();

    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBorrowed = await Borrow.countDocuments({ status: "borrowed" });
    const totalReturned = await Borrow.countDocuments({ status: "returned" });

    // ✅ Tạo điều kiện lọc theo mode
    let matchCondition = {};
    if (mode === "month") {
      matchCondition = {
        borrowDate: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        },
      };
    } else if (mode === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Chủ nhật đầu tuần
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      matchCondition = { borrowDate: { $gte: startOfWeek, $lte: endOfWeek } };
    }

    // ✅ Top 5 sách được mượn nhiều nhất theo thời gian lọc
    const topBooks = await Borrow.aggregate([
      { $match: { ...matchCondition, bookId: { $ne: null } } },
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          _id: 0,
          title: "$book.title",
          author: "$book.author",
          count: 1,
        },
      },
    ]);

    // ✅ Thống kê mượn / trả (giữ nguyên phần cũ)
    let borrowStats = [];
    let returnStats = [];

    if (mode === "month") {
      borrowStats = await Borrow.aggregate([
        {
          $match: {
            status: "borrowed",
            borrowDate: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$borrowDate" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      returnStats = await Borrow.aggregate([
        {
          $match: {
            status: "returned",
            returnDate: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$returnDate" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      const months = Array.from({ length: 12 }, (_, i) => i + 1);

      borrowStats = months.map((m) => ({
        label: `Tháng ${m}`,
        value: borrowStats.find((b) => b._id === m)?.count || 0,
      }));

      returnStats = months.map((m) => ({
        label: `Tháng ${m}`,
        value: returnStats.find((r) => r._id === m)?.count || 0,
      }));
    }

    if (mode === "week") {
      borrowStats = await Borrow.aggregate([
        { $match: { status: "borrowed" } },
        {
          $group: {
            _id: { $week: "$borrowDate" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      returnStats = await Borrow.aggregate([
        { $match: { status: "returned" } },
        {
          $group: {
            _id: { $week: "$returnDate" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id": 1 } },
      ]);

      const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

      borrowStats = weeks.map((w) => ({
        label: `Tuần ${w}`,
        value: borrowStats.find((b) => b._id === w)?.count || 0,
      }));

      returnStats = weeks.map((w) => ({
        label: `Tuần ${w}`,
        value: returnStats.find((r) => r._id === w)?.count || 0,
      }));
    }

    res.json({
      totalBooks,
      totalUsers,
      totalBorrowed,
      totalReturned,
      topBooks,
      borrowStats,
      returnStats,
      mode,
    });
  } catch (err) {
    console.error("❌ Lỗi thống kê:", err);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu thống kê" });
  }
});


export default router;
