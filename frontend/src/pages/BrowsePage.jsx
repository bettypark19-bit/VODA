import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { EP } from "../api/tmdb";
import MovieCard from "../components/MovieCard";

const BrowsePage = () => {
  const { mediaType, category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const title = searchParams.get("title") || "전체보기";
  const genre = searchParams.get("genre");

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const extra = genre ? { with_genres: genre } : {};
    EP.browsePage(mediaType, category, page, extra)
      .then((res) => {
        setItems(res.data.results || []);
        // TMDB 최대 500페이지 제한
        setTotalPages(Math.min(res.data.total_pages || 1, 500));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mediaType, category, page, genre]);

  const goToPage = (p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(p));
      return next;
    });
  };

  // 현재 페이지 주변 2개 + 첫/끝 페이지
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageNums = getPageNumbers();

  return (
    <div className="bg-neutral-950 min-h-screen pb-32">
      <div className="px-12 pt-20">
        {/* 뒤로가기 + 제목 */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-sm" />
          </button>
          <h1 className="font-serif font-bold text-4xl text-neutral-50">
            {title}
          </h1>
        </div>

        {loading ? (
          <div className="text-center text-neutral-500 py-40">로딩 중...</div>
        ) : (
          <>
            {/* 카드 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  type={mediaType}
                  title={item.title || item.name}
                  genre={item.genre_ids?.[0]}
                  year={(item.release_date || item.first_air_date)?.slice(0, 4)}
                  posterUrl={EP.img(item.poster_path)}
                />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {/* 이전 */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-chevron-left text-sm" />
                </button>

                {/* 첫 페이지 */}
                {pageNums[0] > 1 && (
                  <>
                    <button
                      onClick={() => goToPage(1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400 transition-colors font-serif text-sm"
                    >
                      1
                    </button>
                    {pageNums[0] > 2 && (
                      <span className="text-neutral-600 px-1 font-serif">
                        ...
                      </span>
                    )}
                  </>
                )}

                {/* 중간 페이지 번호들 */}
                {pageNums.map((p) => (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border font-serif text-sm transition-colors ${
                      p === page
                        ? "bg-primary-500 border-primary-500 text-white"
                        : "border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {/* 마지막 페이지 */}
                {pageNums[pageNums.length - 1] < totalPages && (
                  <>
                    {pageNums[pageNums.length - 1] < totalPages - 1 && (
                      <span className="text-neutral-600 px-1 font-serif">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400 transition-colors font-serif text-sm"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                {/* 다음 */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-400 hover:border-primary-400 hover:text-primary-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-chevron-right text-sm" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
