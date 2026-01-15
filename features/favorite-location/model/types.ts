export interface FavoriteLocation {
  id: string;            // uuid
  name: string;          // 실제 지역명 (ex: 서울 노원구)
  alias: string;         // 사용자가 지정한 별칭
  lat: number;
  lon: number;
}
