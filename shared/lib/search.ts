// 검색 로직
export function searchLocations(
  locations: string[],
  keyword: string
): string[] {
  if (!keyword.trim()) return [];

  return locations.filter((location) =>
    location.includes(keyword)
  );
}
