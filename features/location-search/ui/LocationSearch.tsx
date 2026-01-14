"use client";

import { useLocationSearch } from "../model/useLocationSearch";

interface Props {
  onSelect: (location: string) => void;
}

export function LocationSearch({ onSelect }: Props) {
  const { keyword, setKeyword, results } = useLocationSearch();

  const highlight = (text: string) => {
    if (!keyword) return text;

    return text.split(keyword).map((part, idx) => (
      <span key={idx}>
        {part}
        {idx < text.split(keyword).length - 1 && (
          <strong style={{ color: "blue" }}>{keyword}</strong>
        )}
      </span>
    ));
  };

  return (
    <div>
      <input
        value={keyword}
        placeholder="지역을 검색하세요 (예: 종로구)"
        onChange={(e) => setKeyword(e.target.value)}
      />

      <ul>
        {results.map((loc) => (
          <li
            key={loc}
            onClick={() => onSelect(loc)}
            style={{ cursor: "pointer" }}
          >
            {highlight(loc.replaceAll("-", " > "))}
          </li>
        ))}
      </ul>
    </div>
  );
}
