import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Swal from "sweetalert2";
import {
  BookOpenIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

export default function MyBorrowedBooks() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Lấy danh sách sách đã mượn
  const fetchMyBorrows = async () => {
    try {
      const res = await api.get("/borrow/my-borrows");

      // ✅ Sắp xếp sách chưa trả lên đầu
      const sorted = res.data.sort((a, b) => {
        if (a.status === "borrowed" && b.status === "returned") return -1;
        if (a.status === "returned" && b.status === "borrowed") return 1;
        return 0;
      });

      setBorrows(sorted);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Lỗi tải dữ liệu",
        text: "Không thể tải danh sách sách đã mượn!",
        confirmButtonColor: "#4F46E5",
        background: "#f8fafc",
        color: "#1e293b",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBorrows();
  }, []);

  // 🔹 Trả sách
  const handleReturn = async (id) => {
    const confirm = await Swal.fire({
      title: "Xác nhận trả sách?",
      text: "Bạn có chắc chắn muốn trả cuốn sách này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Trả sách",
      cancelButtonText: "Hủy",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl shadow-xl p-4 bg-white",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition",
        cancelButton:
          "bg-gray-300 text-gray-800 px-4 ml-3 py-2 rounded hover:bg-gray-400 transition",
      },
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.put(`/borrow/${id}/return`);
      await Swal.fire({
        icon: "success",
        title: "Trả sách thành công!",
        text: "Cảm ơn bạn đã trả sách đúng hạn 📗",
        confirmButtonColor: "#22c55e",
        background: "#f0fdf4",
        color: "#166534",
      });
      fetchMyBorrows();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi trả sách!",
        text: "Vui lòng thử lại sau.",
        confirmButtonColor: "#dc2626",
        background: "#fef2f2",
        color: "#7f1d1d",
      });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-indigo-600">
          <svg
            className="animate-spin h-10 w-10 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p className="animate-pulse text-lg">Đang tải danh sách...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen py-12">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 flex items-center gap-2">
        <BookOpenIcon className="w-8 h-8 text-indigo-500" />
        Sách bạn đã mượn
      </h1>

      {borrows.length === 0 ? (
        <div className="text-gray-500 text-center mt-10 text-lg">
          Bạn chưa mượn sách nào
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {borrows.map((b) => (
            <div
              key={b._id}
              className={`bg-white border rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col relative overflow-hidden ${
                b.status === "borrowed" ? "ring-2 ring-indigo-300" : ""
              }`}
            >
              {b.bookId?.image ? (
                <img
                  src={b.bookId.image}
                  alt={b.bookId.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpenIcon className="w-16 h-16 text-indigo-400" />
                </div>
              )}

              <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                {b.bookId?.title}
              </h2>
              <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                <UserIcon className="w-4 h-4 text-indigo-500" />
                {b.bookId?.author}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">Thể loại:</span>{" "}
                {b.bookId?.category}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Năm:</span>{" "}
                {b.bookId?.year}
              </p>

              <div className="mt-3 text-sm space-y-1 text-gray-700">
                <p className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-4 h-4 text-indigo-500" />
                  <span>
                    Ngày mượn:{" "}
                    {new Date(b.borrowDate).toLocaleDateString("vi-VN")}
                  </span>
                </p>
                {b.returnDate && (
                  <p className="flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>
                      Ngày trả:{" "}
                      {new Date(b.returnDate).toLocaleDateString("vi-VN")}
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-auto">
                {b.status === "borrowed" ? (
                  <button
                    onClick={() => handleReturn(b._id)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 mt-4 rounded-lg hover:from-green-600 hover:to-green-700 transition"
                  >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    Trả sách
                  </button>
                ) : (
                  <span className="text-green-600 font-medium block mt-4 text-center flex items-center justify-center gap-1">
                    <CheckCircleIcon className="w-5 h-5" />
                    Đã trả
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
