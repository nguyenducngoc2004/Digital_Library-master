import api from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function BookCard({ book }) {
  // ✅ Dùng sessionStorage thay vì localStorage
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const handleBorrow = async () => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Bạn chưa đăng nhập",
        text: "Vui lòng đăng nhập trước khi mượn sách.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const res = await api.post("/borrow", { bookId: book._id });
      Swal.fire({
        icon: "success",
        title: "Mượn sách thành công!",
        text: `Bạn đã mượn "${book.title}"`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi mượn sách",
        text: err.response?.data?.message || "Vui lòng thử lại sau.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="border rounded-xl shadow-md hover:shadow-lg transition bg-white overflow-hidden">
      {/* Ảnh bìa */}
      <img
        src={book.image}
        alt={book.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800">{book.title}</h2>
        <p className="text-sm text-gray-600 mb-1">Tác giả: {book.author}</p>
        <p className="text-sm text-gray-500">
          Thể loại: {book.category} • Năm: {book.year}
        </p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
          {book.description}
        </p>
        <p
          className={`text-sm mt-2 ${
            book.quantity > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          Còn lại: {book.quantity} quyển
        </p>

        {role === "user" && (
          <button
            onClick={handleBorrow}
            disabled={book.quantity === 0}
            className={`w-full mt-3 py-2 rounded-lg text-white font-medium transition ${
              book.quantity === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {book.quantity === 0 ? "Hết sách" : "Mượn sách"}
          </button>
        )}
      </div>
    </div>
  );
}
