import { fetcher } from "@/shared/api/fetcher";
import { Weather } from "../model/types";

// Open-Meteo API 호출
export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<Weather> {
  const data = await fetcher(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia/Seoul`
  );

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
  };
}
