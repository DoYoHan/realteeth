import { useQuery } from "@tanstack/react-query";
import { getWeatherByCoords } from "@/shared/api/weatherApi";

export const useWeatherQuery = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherByCoords(lat, lon),
    staleTime: 1000 * 60 * 10, // 10분 캐싱
  });
};
