import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { BookOpen, Users, ClipboardList, CheckCircle } from "lucide-react";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement
);

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [mode, setMode] = useState("month");

  useEffect(() => {
    api
      .get(`/stats?mode=${mode}`)
      .then((res) => setStats(res.data))
      .catch(() => alert("Không thể tải dữ liệu thống kê"));
  }, [mode]);

  if (!stats)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-lg">
          Đang tải thống kê...
        </p>
      </div>
    );

  // ✅ Dữ liệu biểu đồ mượn - trả
  const labels = stats.borrowStats.map((x) => x.label);
  const borrowCounts = stats.borrowStats.map((x) => x.value);
  const returnCounts = stats.returnStats.map((x) => x.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Lượt mượn sách",
        data: borrowCounts,
        borderColor: "rgba(37,99,235,0.8)",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Lượt trả sách",
        data: returnCounts,
        borderColor: "rgba(16,185,129,0.8)",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // ✅ Top sách
  const topBookLabels = stats.topBooks.map((b) => b.title);
  const topBookCounts = stats.topBooks.map((b) => b.count);

  const topBooksChart = {
    labels: topBookLabels,
    datasets: [
      {
        label: "Số lượt mượn",
        data: topBookCounts,
        backgroundColor: "rgba(99,102,241,0.6)",
        borderColor: "rgba(99,102,241,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
            Thống kê hoạt động thư viện
          </h1>
          <p className="text-gray-500 mt-2">
            Tổng quan số liệu mượn và trả sách theo thời gian
          </p>
        </div>

        {/* Chọn chế độ xem */}
        <div className="flex justify-center mb-6">
          <select
            className="border px-4 py-2 rounded-lg shadow-sm bg-white"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="month">Theo tháng</option>
            <option value="week">Theo tuần</option>
          </select>
        </div>

        {/* Cards tổng quan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Tổng số sách",
              value: stats.totalBooks,
              color: "blue",
              icon: <BookOpen size={30} />,
            },
            {
              title: "Người dùng",
              value: stats.totalUsers,
              color: "green",
              icon: <Users size={30} />,
            },
            {
              title: "Đang được mượn",
              value: stats.totalBorrowed,
              color: "yellow",
              icon: <ClipboardList size={30} />,
            },
            {
              title: "Đã trả",
              value: stats.totalReturned,
              color: "purple",
              icon: <CheckCircle size={30} />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col items-center justify-center text-center"
            >
              <div
                className={`rounded-full p-4 bg-${item.color}-100 text-${item.color}-600 mb-4`}
              >
                {item.icon}
              </div>
              <h3 className={`text-3xl font-bold text-${item.color}-700 mb-1`}>
                {item.value}
              </h3>
              <p className="text-gray-600 text-sm">{item.title}</p>
            </div>
          ))}
        </div>

        {/* ✅ Hai biểu đồ cạnh nhau */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

          {/* Biểu đồ mượn - trả */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
              Biểu đồ lượt mượn và trả sách (
              {mode === "month" ? "theo tháng" : "theo tuần"})
            </h2>

            {labels.length > 0 ? (
              <div className="h-80">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: true, position: "bottom" },
                    },
                    scales: {
                      x: { ticks: { color: "#4B5563" } },
                      y: { beginAtZero: true, ticks: { color: "#4B5563" } },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                Chưa có dữ liệu thống kê.
              </p>
            )}
          </div>

          {/* Biểu đồ top sách */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
              Top 5 sách được mượn nhiều nhất (
              {mode === "month" ? "trong tháng này" : "trong tuần này"})
            </h2>

            {topBookLabels.length > 0 ? (
              <div className="h-80">
                <Bar
                  data={topBooksChart}
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: "#4B5563" } },
                      y: {
                        beginAtZero: true,
                        ticks: { color: "#4B5563" },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                Chưa có dữ liệu về top sách.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
