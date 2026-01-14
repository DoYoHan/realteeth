import { useQuery } from "@tanstack/react-query";
import { getWeatherByCoords } from "@/shared/api/weatherApi";
import { Weather } from "../model/types";

export function useWeatherQuery(
  lat: number,
  lon: number,
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery<Weather>({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherByCoords(lat, lon),
    enabled: options?.enabled ?? true,
  });
}
