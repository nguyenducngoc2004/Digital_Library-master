import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log("API response:", res.data);
      sessionStorage.clear();

      const { user, token } = res.data;
      sessionStorage.setItem("token", token || "");
      sessionStorage.setItem("role", user.role || "user");

      const username =
        user.username || user.name || user.email?.split("@")[0] || "Admin";

      sessionStorage.setItem("username", username);
      sessionStorage.setItem("email", user.email || "");

      if (user.role === "admin") navigate("/admin/books");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message)
        setError(err.response.data.message);
      else
        setError("Lỗi kết nối server hoặc máy chủ không phản hồi.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
        {/* Logo + Tiêu đề */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-full mb-3 shadow-inner">
            <i className="bi bi-book-half text-3xl text-indigo-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-indigo-700">
            Hệ thống Thư viện Số
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Đăng nhập để tiếp tục
          </p>
        </div>

        {/* Hiển thị lỗi */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 p-2 mb-4 rounded-md text-sm text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
          >
            Đăng nhập
          </button>
        </form>

        {/* Đăng ký */}
        <p className="text-center mt-5 text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
