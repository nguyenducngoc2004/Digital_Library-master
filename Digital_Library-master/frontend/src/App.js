import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Borrowed from "./pages/MyBorrowedBooks";
import AISuggestion from "./pages/AISuggestion";
import AdminBooks from "./pages/AdminBooks";
import AdminStats from "./pages/AdminStats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import SearchResults from "./pages/SearchResults";

function App() {
  // 🔹 Lấy thông tin người dùng từ sessionStorage
  const role = sessionStorage.getItem("role") || "user";
  const email = sessionStorage.getItem("email");
  const name = sessionStorage.getItem("name");

  // Nếu không có name thì lấy phần trước dấu @ của email (nếu có)
  const username =
    name ||
    (email && email !== "undefined"
      ? email.split("@")[0]
      : "Người dùng");

  return (
    <Router>
      <Routes>
        {/* ---------- USER ---------- */}
        <Route
          path="/"
          element={
            <UserLayout username={username} role={role}>
              <Home />
            </UserLayout>
          }
        />
        <Route
          path="/borrowed"
          element={
            <UserLayout username={username} role={role}>
              <Borrowed />
            </UserLayout>
          }
        />
        <Route
          path="/ai-suggest"
          element={
            <UserLayout username={username} role={role}>
              <AISuggestion />
            </UserLayout>
          }
        />
        <Route
          path="/search"
          element={
            <UserLayout username={username} role={role}>
              <SearchResults />
            </UserLayout>
          }
        />

        {/* ---------- AUTH ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout username={username} role={role}>
                <AdminBooks />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout username={username} role={role}>
                <AdminStats />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
