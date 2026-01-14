import { fetcher } from "@/shared/api/fetcher";
import { Weather } from "../model/types";
import { OpenMeteoResponse } from "../model/apiTypes";

// Open-Meteo API 호출
export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=temperature_2m,weather_code` +
    `&daily=temperature_2m_min,temperature_2m_max` +
    `&hourly=temperature_2m` +
    `&timezone=Asia/Seoul`;

  const data = await fetcher<OpenMeteoResponse>(url);

  return {
    currentTemperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,

    minTemperature: data.daily.temperature_2m_min[0],
    maxTemperature: data.daily.temperature_2m_max[0],

    hourly: data.hourly.time.map((time, idx) => ({
      time,
      temperature: data.hourly.temperature_2m[idx],
    })),
  };
}
