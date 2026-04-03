import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const SeasonButton = ({ seasons = [], activeSeason, onSeasonChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentSeason =
    seasons.find((s) => s.season_number === activeSeason) || seasons[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-800 text-zinc-50 font-serif font-bold hover:bg-zinc-700 transition-all cursor-pointer border border-white/5 active:scale-95"
      >
        <span>시즌 {currentSeason?.season_number || activeSeason}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-sm transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 z-50 w-72 p-2 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="flex flex-col gap-1 max-h-100 overflow-y-auto no-scrollbar">
            {seasons && seasons.length > 0 ? (
              seasons
                .filter((s) => s.season_number > 0)
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (onSeasonChange) onSeasonChange(s.season_number, false);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all cursor-pointer group ${
                      activeSeason === s.season_number
                        ? "bg-primary-400/10 text-primary-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {activeSeason === s.season_number && (
                        <div className="w-1 h-5 bg-primary-400 rounded-full" />
                      )}
                      <span className="font-bold text-lg font-serif">
                        시즌 {s.season_number}
                      </span>
                      <span className="text-sm text-zinc-500 font-medium">
                        ({s.episode_count}개)
                      </span>
                    </div>
                  </button>
                ))
            ) : (
              <div className="px-5 py-4 text-zinc-600 text-sm font-serif text-center">
                시즌 정보가 없습니다.
              </div>
            )}

            <div className="h-px bg-white/5 my-1 mx-3" />
            <button
              onClick={() => {
                if (onSeasonChange) onSeasonChange(activeSeason, true);
                setIsOpen(false);
              }}
              className="w-full px-5 py-4 text-left text-zinc-500 hover:text-primary-400 hover:bg-white/5 transition-all text-sm font-serif font-medium cursor-pointer rounded-2xl"
            >
              전체 회차 표시
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonButton;