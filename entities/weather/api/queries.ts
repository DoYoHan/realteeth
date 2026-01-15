import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getWeatherByCoords } from "./weatherApi";

export type Weather = Awaited<ReturnType<typeof getWeatherByCoords>>;

type WeatherQueryOptions = Omit<
  UseQueryOptions<Weather, Error, Weather, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

export function useWeatherQuery(
  lat: number,
  lon: number,
  options?: WeatherQueryOptions
) {
  return useQuery<Weather>({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeatherByCoords(lat, lon),
    ...options,
  });
}