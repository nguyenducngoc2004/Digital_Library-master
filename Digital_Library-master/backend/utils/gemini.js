import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const suggestBooks = async (query) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Gợi ý 5 tài liệu hoặc sách liên quan đến chủ đề: "${query}".
  Mỗi tài liệu ghi theo dạng:
  - Tên tài liệu
  - Tác giả (nếu biết)
  - Lý do liên quan
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
