export function normalizeLocationCandidates(location: string): string[] {
  const parts = location.split("-");

  const candidates: string[] = [];

  // 전체 문자열
  candidates.push(location);

  // 뒤에서부터 하나씩 제거
  for (let i = parts.length - 1; i > 0; i--) {
    candidates.push(parts.slice(0, i).join("-"));
  }

  // 가장 상위 지역 (ex: 제주특별자치도 → 제주)
  const top = parts[0]
    .replace("특별자치도", "")
    .replace("특별시", "")
    .replace("광역시", "");

  if (top !== parts[0]) {
    candidates.push(top);
  }

  return [...new Set(candidates)];
}

export function getTopRegion(location: string): string {
  const first = location.split("-")[0];

  return first
    .replace("특별자치도", "")
    .replace("특별시", "")
    .replace("광역시", "");
}
