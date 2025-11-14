import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import BookCard from "../components/BookCard";
import Footer from "./Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import LibraryResourcesSection from "./LibraryResourcesSection";

export default function Home() {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await api.get("/books");
      const grouped = res.data.reduce((acc, book) => {
        if (!acc[book.category]) acc[book.category] = [];
        acc[book.category].push(book);
        return acc;
      }, {});
      setCategories(grouped);
    };
    fetchBooks();
  }, []);

  return (
    <div className="bg-[#f8f5e7] min-h-screen flex flex-col py-10">
      <LibraryResourcesSection />
      <div className="flex-1 px-8 py-8">
        {Object.keys(categories).map((cat) => (
          <section key={cat} className="mb-12">
            {/* Tiêu đề danh mục */}
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-l-4 border-blue-600 pl-3">
              {cat}
            </h2>

            {/* Nếu có nhiều hơn 5 quyển -> dùng slide */}
            {categories[cat].length > 5 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={2}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                className="pb-6"
              >
                {categories[cat].map((book) => (
                  <SwiperSlide key={book._id}>
                    <BookCard book={book} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              // Nếu ít hơn hoặc bằng 5 thì chỉ hiện bình thường
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories[cat].slice(0, 5).map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* 🟩 Footer */}
      <Footer />
    </div>
  );
}
