import { useState, useMemo } from "react";
import locations from "@/shared/data/korea_districts.json";

export function useLocationSearch() {
  const [keyword, setKeyword] = useState("");

  const results = useMemo(() => {
    if (!keyword.trim()) return [];

    return locations
      .filter((loc) => loc.includes(keyword))
      .slice(0, 20); // 결과 제한
  }, [keyword]);

  return {
    keyword,
    setKeyword,
    results,
  };
}
