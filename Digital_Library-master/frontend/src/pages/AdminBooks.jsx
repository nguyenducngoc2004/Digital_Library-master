import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    description: "",
    image: "",
    quantity: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const role = sessionStorage.getItem("role") || localStorage.getItem("role");

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch {
      toast.error("Không tải được danh sách sách");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token || role !== "admin") {
        toast.error("Vui lòng đăng nhập bằng tài khoản admin!");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await api.put(`/books/${editingId}`, form, config);
        toast.success("Cập nhật thành công!");
      } else {
        await api.post("/books", form, config);
        toast.success("Thêm sách mới thành công!");
      }

      setForm({
        title: "",
        author: "",
        category: "",
        year: "",
        description: "",
        image: "",
        quantity: 1,
      });
      setEditingId(null);
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      console.error("Lỗi khi lưu sách:", err);
      toast.error(
        err.response?.data?.message ||
          "Lỗi khi lưu sách. Kiểm tra token hoặc quyền admin!"
      );
    }
  };

  const confirmDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!bookToDelete) return;
    try {
      await api.delete(`/books/${bookToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa sách thành công!");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa sách!");
    } finally {
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      year: book.year,
      description: book.description,
      image: book.image,
      quantity: book.quantity || 1,
    });
    setEditingId(book._id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setForm({
      title: "",
      author: "",
      category: "",
      year: "",
      description: "",
      image: "",
      quantity: 1,
    });
    setEditingId(null);
    setShowModal(true);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
          <CheckCircleIcon className="w-8 h-8 text-teal-500" />
          Quản lý sách
        </h1>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Thêm sách
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-indigo-100 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white">
            <tr>
              <th className="px-5 py-3 font-medium">Tên sách</th>
              <th className="px-5 py-3 font-medium">Tác giả</th>
              <th className="px-5 py-3 font-medium">Thể loại</th>
              <th className="px-5 py-3 font-medium">Năm</th>
              <th className="px-5 py-3 text-center font-medium">Số lượng</th>
              <th className="px-5 py-3 text-center font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((b, i) => (
              <tr
                key={b._id}
                className={`border-b ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50 transition`}
              >
                <td className="px-5 py-3">{b.title}</td>
                <td className="px-5 py-3">{b.author}</td>
                <td className="px-5 py-3">{b.category}</td>
                <td className="px-5 py-3">{b.year}</td>
                <td className="px-5 py-3 text-center">{b.quantity ?? 0}</td>
                <td className="px-5 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm hover:shadow-md transition"
                  >
                    <PencilSquareIcon className="w-4 h-4" /> Sửa
                  </button>
                  <button
                    onClick={() => confirmDelete(b)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm hover:shadow-md transition"
                  >
                    <TrashIcon className="w-4 h-4" /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg border transition font-medium ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-scaleIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-indigo-700 text-center">
              {editingId ? "Cập nhật sách" : "Thêm sách mới"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tên sách"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tác giả"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Thể loại"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Năm xuất bản"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Link ảnh bìa (tùy chọn)"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none col-span-2"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <textarea
                placeholder="Mô tả"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none col-span-2 resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Số lượng"
                min="0"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: Number(e.target.value) })
                }
                required
              />

              <button
                type="submit"
                className="col-span-2 bg-gradient-to-r from-indigo-600 to-teal-500 hover:opacity-90 text-white py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                {editingId ? "Cập nhật" : "Thêm sách"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-scaleIn">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Xác nhận xoá
            </h2>
            <p className="mb-6 text-gray-700">
              Bạn có chắc muốn xoá{" "}
              <strong className="text-indigo-600">{bookToDelete?.title}</strong>{" "}
              khỏi thư viện?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                Xoá
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>
        {`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
        .animate-scaleIn { animation: scaleIn 0.25s ease forwards; }
      `}
      </style>
    </div>
  );
}
