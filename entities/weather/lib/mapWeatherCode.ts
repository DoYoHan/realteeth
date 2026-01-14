// weather_code 가공 로직
export function mapWeatherCode(code: number): string {
  const map: Record<number, string> = {
    0: "맑음",
    1: "대체로 맑음",
    2: "부분적으로 흐림",
    3: "흐림",
    61: "비",
    71: "눈",
  };

  return map[code] ?? "알 수 없음";
}
