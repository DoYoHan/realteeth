import { fetcher } from "./fetcher";

export const getWeatherByCoords = (
  lat: number,
  lon: number
) => {
  const url = `https://api.open-meteo.com/v1/forecast
    ?latitude=${lat}
    &longitude=${lon}
    &hourly=temperature_2m
    &daily=temperature_2m_max,temperature_2m_min
    &timezone=Asia/Seoul`
    .replace(/\s/g, "");

  return fetcher<any>(url);
};
