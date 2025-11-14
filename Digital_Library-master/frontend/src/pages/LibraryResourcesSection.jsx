import React from "react";

const resources = [
  {
    img: "/images/tainguyengiay.png",
    title: "TÀI NGUYÊN GIẤY",
    desc: "Tìm kiếm sách in, báo, tạp chí tại Thư viện",
  },
  {
    img: "/images/tainguyendientu.png",
    title: "TÀI NGUYÊN ĐIỆN TỬ",
    desc: "Tìm kiếm e-book, e-journal, research paper... thuộc các nhà xuất bản lớn",
  },
  {
    img: "/images/static-3.png",
    title: "GIỜ MỞ CỬA",
    desc: (
      <>
        <p><strong>Thời gian mở cửa:</strong> 07h30 - 21h30</p>
        <p>Thứ 7 theo giờ hành chính</p>
      </>
    ),
  },
];

export default function LibraryResourcesSection() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-24 px-4"
      style={{
        backgroundImage: "url('/images/brg_book.jpg')", // ảnh nền lớn
      }}
    >
      {/* Lớp phủ làm mờ + gradient xanh nhạt */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-sky-100/60 backdrop-blur-[2px]"></div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Tiêu đề */}
        <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-16 drop-shadow-md tracking-wide">
          TÀI NGUYÊN THƯ VIỆN
        </h2>

        {/* Các khối nội dung */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {resources.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center bg-white/90 rounded-3xl shadow-lg p-10 transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >
              {/* Icon tròn */}
              <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-50 mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-28 h-28 object-contain"
                />
              </div>

              {/* Tiêu đề */}
              <h3 className="text-xl font-semibold text-blue-700 mb-3 group-hover:text-sky-600 transition-colors duration-300">
                {item.title}
              </h3>

              {/* Mô tả */}
              <div className="text-gray-700 text-sm leading-relaxed max-w-xs">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
