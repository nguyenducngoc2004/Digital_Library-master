import React, { useState } from "react";
import axios from "axios";

const AISuggestion = () => {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() && !file) return;

    setLoading(true);
    setAiText("");

    try {
      const formData = new FormData();
      if (query) formData.append("query", query);
      if (file) formData.append("file", file);

      const res = await axios.post("http://localhost:5000/api/ai/suggest", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAiText(res.data?.aiText || "Không có gợi ý nào được tìm thấy.");
    } catch (err) {
      console.error("❌ Lỗi:", err);
      setAiText("❌ Lỗi khi gọi AI Suggestion!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-8 drop-shadow-sm text-center">
        🤖 Gợi ý tài liệu thông minh
      </h1>

      {/* Form nhập chủ đề hoặc tải file */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 border border-indigo-100 flex flex-col gap-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nhập chủ đề bạn muốn tìm..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-600 active:scale-95 transition-all shadow-md"
          >
            Tìm
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <label className="text-sm text-gray-600">
            Hoặc tải lên tài liệu (.pdf, .docx, .txt):
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </form>

      {/* Kết quả AI */}
      {loading ? (
        <p className="mt-8 text-gray-500 animate-pulse text-lg">⏳ Đang phân tích tài liệu...</p>
      ) : (
        aiText && (
          <div
            className="mt-10 w-full max-w-3xl bg-white border border-indigo-100 shadow-lg rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl animate-fadeIn"
          >
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center gap-2">
              Kết quả gợi ý
            </h2>

            <div
              className="prose prose-indigo max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: aiText
                  .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // tô đậm Markdown
                  .replace(/\n/g, "<br/>") // xuống dòng
                  .replace(/\*(.*?)\*/g, "<i>$1</i>"), // in nghiêng
              }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default AISuggestion;
