import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import * as pdfParse from "pdf-parse"; // ✅ import đúng cú pháp cho ESM
import mammoth from "mammoth";
import Book from "../models/Book.js";

dotenv.config();
const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* 🔹 Hàm đọc nội dung file theo loại */
const extractTextFromFile = async (filePath, mimetype) => {
  try {
    if (mimetype.includes("pdf")) {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse.default(dataBuffer); // ✅ phải gọi pdfParse.default()
      return pdfData.text;
    }

    if (mimetype.includes("word") || mimetype.includes("docx")) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    if (mimetype.includes("text") || mimetype.includes("plain")) {
      return fs.readFileSync(filePath, "utf8");
    }

    return ""; // nếu không hỗ trợ loại file
  } catch (err) {
    console.error("❌ Lỗi đọc file:", err.message);
    return "";
  }
};

/* 🔹 API: Gợi ý theo query hoặc file */
router.post("/suggest", upload.single("file"), async (req, res) => {
  try {
    const { query } = req.body;
    const file = req.file;

    if (!query && !file) {
      return res.status(400).json({ message: "Thiếu 'query' hoặc 'file'" });
    }

    // Lấy danh sách sách hiện có trong DB
    const books = await Book.find({}, "title author category description");
    const bookList = books
      .map((b, i) => `${i + 1}. ${b.title} - ${b.author} (${b.category})`)
      .join("\n");

    let contentSummary = "";
    if (file) {
      const text = await extractTextFromFile(file.path, file.mimetype);
      fs.unlinkSync(file.path); // xóa file tạm
      contentSummary = text.slice(0, 4000); // cắt ngắn nội dung để tiết kiệm token
    }

    // Prompt gửi đến Gemini
    const prompt = file
      ? `
Bạn là trợ lý thư viện thông minh. Người dùng vừa tải lên một tài liệu. 
Dưới đây là nội dung tóm tắt của tài liệu:

${contentSummary}

Dựa trên nội dung tài liệu, hãy gợi ý những sách trong danh sách sau đây có liên quan nhất:
${bookList}

Hãy:
1. Chọn các sách phù hợp nhất và giải thích ngắn gọn vì sao.
2. Gợi ý thêm 3–5 tài liệu khác (nếu có) mà bạn nghĩ người dùng nên đọc.
3. Trả lời tự nhiên, rõ ràng, dễ hiểu.
`
      : `
Người dùng đang tìm tài liệu liên quan đến: "${query}"

Dưới đây là danh sách sách hiện có trong thư viện:
${bookList}

Hãy chọn ra những sách liên quan nhất, giải thích ngắn gọn, và gợi ý thêm 3–5 tài liệu khác.
`;

    // Gọi Gemini API
    const aiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const aiText =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Không có gợi ý nào được tìm thấy.";

    res.json({ aiText });
  } catch (err) {
    console.error("❌ Lỗi AI Suggestion:", err.response?.data || err.message);
    res.status(500).json({
      message: "Lỗi AI Suggestion",
      error: err.response?.data || err.message,
    });
  }
});

export default router;
