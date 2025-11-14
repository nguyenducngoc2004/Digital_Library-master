import { useState } from "react";
import axios from "axios";

export default function AISearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await axios.post("http://localhost:5000/api/ai/suggest", { query });
    setResult(res.data.suggestions);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">🔍 AI Gợi ý tài liệu</h1>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập chủ đề bạn muốn tìm..."
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Tìm
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-500">Đang xử lý...</p>}
      {result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
