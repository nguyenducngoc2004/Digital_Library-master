import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = ({ role: roleProp }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("Admin");
  const [role, setRole] = useState(roleProp || "user");

  // 🔹 Lấy dữ liệu từ sessionStorage
  useEffect(() => {
    const storedName = sessionStorage.getItem("username");
    const storedRole = sessionStorage.getItem("role");

    if (storedRole) setRole(storedRole);

    if (storedName && storedName.trim() !== "") {
      setUsername(storedName);
    } else if (storedRole === "admin") {
      setUsername("Quản trị viên");
    }
  }, []);

  // 🔍 Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setTimeout(() => {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setLoading(false);
    }, 800);
  };

  // 🚪 Xử lý đăng xuất
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-700 to-blue-500 text-white shadow-lg">
      <div className="flex flex-wrap justify-between items-center px-6 py-3">
        {/* 🔹 Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold tracking-wide">
          <i className="bi bi-book-half text-yellow-300"></i>
          <span>Thư viện Số</span>
        </div>

        {/* 🔍 Ô tìm kiếm — chỉ hiển thị cho user */}
        {role === "user" && (
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full px-3 py-1 shadow-inner w-full md:w-96 mt-3 md:mt-0"
          >
            <i className="bi bi-search text-gray-400 mr-2"></i>
            <input
              type="text"
              placeholder="Tìm sách, tác giả, thể loại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-700 bg-transparent placeholder-gray-400"
            />
            {loading && (
              <div className="animate-spin text-indigo-600">
                <i className="bi bi-arrow-repeat"></i>
              </div>
            )}
          </form>
        )}

        {/* 🔹 Menu */}
        <div className="flex items-center gap-6 text-sm font-medium mt-3 md:mt-0">
          {role === "admin" ? (
            <>
              <a
                href="/admin/books"
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <i className="bi bi-journal-text"></i>
                Quản lý sách
              </a>
              <a
                href="/admin/stats"
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <i className="bi bi-bar-chart-fill"></i>
                Thống kê
              </a>
            </>
          ) : (
            <>
              <a
                href="/"
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <i className="bi bi-house-door-fill"></i>
                Trang chủ
              </a>
              <a
                href="/borrowed"
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <i className="bi bi-bookmark-heart-fill"></i>
                Sách đã mượn
              </a>
              <a
                href="/ai-suggest"
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <i className="bi bi-robot"></i>
                AI Gợi ý
              </a>
            </>
          )}

          {/* 👤 Tên người dùng + Đăng xuất */}
          <div className="flex items-center gap-3 bg-indigo-600 px-3 py-1.5 rounded-lg shadow-md">
            <i className="bi bi-person-circle text-yellow-300 text-lg"></i>
            <span className="font-medium">{username}</span>

            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="ml-2 text-red-300 hover:text-red-500 transition"
            >
              <i className="bi bi-box-arrow-right text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
