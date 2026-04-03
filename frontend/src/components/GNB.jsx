import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUserCircle,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import Alarm from './Alarm';

const GNB = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  const menus = [
    { name: "홈", path: "/" },
    { name: "영화보다", path: "/movie" },
    { name: "TV보다", path: "/tv" },
    { name: "사람을 보다", path: "/person" },
    { name: "물어보다", path: "/ask" },
  ];

  const linkStyle = ({ isActive }) =>
    twMerge(
      "font-serif text-xl font-semibold tracking-tight transition-colors pb-2 border-b-4",
      isActive
        ? "text-primary-400 border-primary-400"
        : "text-neutral-400 border-transparent hover:text-primary-400",
    );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-12 py-6 bg-[rgba(14,14,19,0.4)] backdrop-blur-md border-b border-white/10 shadow-glow-purple">
      {/* 로고 + 메뉴 */}
      <div className="flex items-center gap-18">
        <Link
          to="/"
          className="font-sans text-3xl font-bold tracking-tighter text-neutral-50"
        >
          VODA
        </Link>

        <nav className="flex items-center gap-12">
          {menus.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              end={m.path === "/"}
              className={linkStyle}
            >
              {m.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 검색바 + 알림 + 프로필 */}
      <div className="flex items-center gap-8">
        {/* 검색바 */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <Link to="/find">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-neutral-400 text-lg hover:text-primary-400 transition-colors cursor-pointer"
            />
          </Link>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="찾아보다"
            className="bg-transparent font-serif text-xl text-neutral-400 placeholder:text-neutral-400 w-72 outline-none"
          />
        </form>
        {/* 알림 */}
        <div className="relative">
          <button
            onClick={() => setIsAlarmOpen(!isAlarmOpen)}
            className={`transition-colors text-2xl ${isAlarmOpen ? "text-primary-400" : "text-neutral-400 hover:text-primary-400"}`}
          >
            <FontAwesomeIcon icon={faBell} />
          </button>

          {/* Alarm 컴포넌트 연결 */}
          <Alarm isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />
        </div>{" "}
        {/* 프로필 */}
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-primary-400 transition-colors text-3xl ring-2 ring-primary-400 rounded-full"
        >
          <FontAwesomeIcon icon={faUserCircle} />
        </Link>{" "}
      </div>
    </header>
  );
};

export default GNB;
