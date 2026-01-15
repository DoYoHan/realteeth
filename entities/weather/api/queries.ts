import { useQuery } from "@tanstack/react-query";
import { getWeatherByCoords } from "./weatherApi";

export function useWeatherQuery(
  lat: number,
  lon: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherByCoords(lat, lon),
    enabled: options?.enabled,
  });
}
