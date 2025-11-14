import React from "react";
import Navbar from "../components/Navbar";
import { HouseDoor, Book, BarChart, People, Gear } from "react-bootstrap-icons";

const AdminLayout = ({ children }) => {
  // 👉 Lấy đường dẫn hiện tại để highlight link đang chọn
  const currentPath = window.location.pathname;

  const menuItems = [
    {
      href: "/admin/books",
      label: "Quản lý sách",
      icon: <Book className="w-5 h-5" />,
    },
    {
      href: "/admin/stats",
      label: "Thống kê",
      icon: <BarChart className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-10">
      {/* 🔷 Navbar */}
      <Navbar role="admin" />

      {/* 🔹 Layout chính */}
      <div className="flex flex-1">
        {/* 🟦 Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-indigo-700 to-indigo-800 text-white p-6 flex flex-col shadow-xl">
          <div className="text-center mb-8">
            <div className="text-3xl font-bold tracking-wide text-yellow-400">
              Admin
            </div>
            <p className="text-sm text-indigo-200 mt-1">Thư viện số Việt Nam</p>
          </div>

          <nav className="flex flex-col space-y-2 text-[15px]">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
                  currentPath === item.href
                    ? "bg-indigo-600 text-yellow-300 shadow-md"
                    : "hover:bg-indigo-600 hover:text-yellow-300"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* 🟡 Footer nhỏ trong sidebar */}
          <div className="mt-auto text-sm text-indigo-200 border-t border-indigo-500 pt-4 text-center">
            © 2025 Thư viện số Việt Nam
            <br />
            <span className="text-yellow-400">Admin Dashboard</span>
          </div>
        </aside>

        {/* 🟩 Khu vực nội dung */}
        <main className="flex-1 p-8 bg-white rounded-tl-3xl shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
