"use client";

import { useEffect, useRef, useState } from "react";
import { useLocationSearch } from "../model/useLocationSearch";

interface Props {
  onSelect: (location: string) => void;
}

export function LocationSearch({ onSelect }: Props) {
  const { keyword, setKeyword, results } = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* 외부 클릭 시 닫기 */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlight = (text: string) => {
    if (!keyword) return text;

    const parts = text.split(keyword);
    return parts.map((part, idx) => (
      <span key={idx}>
        {part}
        {idx < parts.length - 1 && (
          <span className="font-semibold text-sky-600">{keyword}</span>
        )}
      </span>
    ));
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      {/* 검색창 */}
      <input
        value={keyword}
        placeholder="지역을 검색하세요 (예: 종로구)"
        onChange={(e) => {
          setKeyword(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => keyword && setIsOpen(true)}
        className="
          w-full rounded-xl border border-gray-300
          px-4 py-3 text-sm
          shadow-sm
          text-gray-700
          focus:outline-none focus:ring-2 focus:ring-sky-400
          focus:border-sky-400
        "
      />

      {/* 검색 결과 */}
      {isOpen && results.length > 0 && (
        <ul
          className="
            absolute z-50 mt-2 w-full
            rounded-xl bg-white
            shadow-lg border border-gray-200
            max-h-60 overflow-auto
          "
        >
          {results.map((loc) => (
            <li
              key={loc}
              onClick={() => {
                setKeyword(loc);     // 검색창에 반영
                setIsOpen(false);    // 결과 닫기
                onSelect(loc);       // 검색 실행
              }}
              className="
                px-4 py-2 text-sm
                cursor-pointer
                hover:bg-sky-50
                transition
                text-gray-700
              "
            >
              {highlight(loc)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
