import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Đăng ký thành công! Hãy đăng nhập để tiếp tục.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Lỗi kết nối server. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
        {/* Logo + tiêu đề */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-full mb-3 shadow-inner">
            <i className="bi bi-person-plus-fill text-3xl text-indigo-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-indigo-700">
            Tạo tài khoản mới
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Đăng ký để truy cập Thư viện Số
          </p>
        </div>

        {/* Thông báo */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 p-2 mb-4 rounded-md text-sm text-center shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-2 mb-4 rounded-md text-sm text-center shadow-sm">
            {success}
          </div>
        )}

        {/* Form đăng ký */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Tạo mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
          >
            Đăng ký
          </button>
        </form>

        {/* Chuyển hướng đăng nhập */}
        <p className="text-center mt-5 text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
