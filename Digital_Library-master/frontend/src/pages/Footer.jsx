export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 🏛 Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="bi bi-book-half text-yellow-400"></i>
            Thư viện Số Việt Nam
          </h3>
          <p className="text-sm leading-relaxed">
            Nền tảng đọc và chia sẻ tài liệu trực tuyến.  
            Giúp người dùng tiếp cận tri thức dễ dàng hơn mọi lúc, mọi nơi.
          </p>
        </div>

        {/* 🔗 Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="bi bi-link-45deg text-yellow-400"></i>
            Liên kết nhanh
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-yellow-400"><i className="bi bi-house-door-fill mr-2"></i>Trang chủ</a></li>
            <li><a href="/about" className="hover:text-yellow-400"><i className="bi bi-info-circle-fill mr-2"></i>Giới thiệu</a></li>
            <li><a href="/books" className="hover:text-yellow-400"><i className="bi bi-journal-bookmark-fill mr-2"></i>Sách</a></li>
            <li><a href="/contact" className="hover:text-yellow-400"><i className="bi bi-envelope-fill mr-2"></i>Liên hệ</a></li>
          </ul>
        </div>

        {/* 💬 Cột 3: Hỗ trợ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="bi bi-life-preserver text-yellow-400"></i>
            Hỗ trợ
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-yellow-400"><i className="bi bi-question-circle-fill mr-2"></i>Câu hỏi thường gặp</a></li>
            <li><a href="/guide" className="hover:text-yellow-400"><i className="bi bi-book-fill mr-2"></i>Hướng dẫn sử dụng</a></li>
            <li><a href="/terms" className="hover:text-yellow-400"><i className="bi bi-file-earmark-text-fill mr-2"></i>Điều khoản</a></li>
            <li><a href="/privacy" className="hover:text-yellow-400"><i className="bi bi-shield-lock-fill mr-2"></i>Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* 📞 Cột 4: Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="bi bi-telephone-fill text-yellow-400"></i>
            Liên hệ
          </h3>
          <p className="text-sm flex items-center">
            <i className="bi bi-geo-alt-fill text-yellow-400 mr-2"></i> Hà Đông, Hà Nội
          </p>
          <p className="text-sm mt-2 flex items-center">
            <i className="bi bi-telephone-forward-fill text-yellow-400 mr-2"></i>
            Hotline: <span className="text-yellow-400 ml-1">0123 456 789</span>
          </p>
          <p className="text-sm mt-1 flex items-center">
            <i className="bi bi-envelope-paper-fill text-yellow-400 mr-2"></i>
            Email: <a href="mailto:contact@thuvien.vn" className="text-yellow-400 hover:underline ml-1">contact@thuvien.vn</a>
          </p>

          {/* Mạng xã hội */}
          <div className="flex gap-4 mt-4 text-lg">
            <a href="#" className="hover:text-yellow-400"><i className="bi bi-facebook"></i></a>
            <a href="#" className="hover:text-yellow-400"><i className="bi bi-youtube"></i></a>
            <a href="#" className="hover:text-yellow-400"><i className="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* ⚙️ Dòng bản quyền */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        © 2025 Thư viện Số Việt Nam — Phát triển bởi <span className="text-yellow-400">Nhóm NGỌC, THÀNH</span>.
      </div>
    </footer>
  );
}
