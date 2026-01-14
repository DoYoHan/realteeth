"use client";

import { useEffect, useState } from "react";
import { useDetectUserLocation } from "@/features/detect-user-location/model/useDetectUserLocation";
import { getWeatherByCoords } from "@/entities/weather/api/weatherApi";
import { mapWeatherCode } from "@/entities/weather/lib/mapWeatherCode";
import { Weather } from "@/entities/weather/model/types";
import Loader from "@/shared/ui/Loader";

// Page 조립 (비즈니스 로직 x) 
export default function WeatherPage() {
  const location = useDetectUserLocation();
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    if (!location) return;

    getWeatherByCoords(location.latitude, location.longitude)
      .then(setWeather)
      .catch(console.error);
  }, [location]);

  if (!location || !weather) return <Loader />;

  return (
    <div>
      <h1>📍 오늘의 날씨</h1>

      {/* 현재 */}
      <p>🌡 현재: {weather.currentTemperature} ℃</p>
      <p>🌤 상태: {mapWeatherCode(weather.weatherCode)}</p>

      {/* 최저 / 최고 */}
      <p>
        🔻 최저: {weather.minTemperature} ℃ / 🔺 최고:{" "}
        {weather.maxTemperature} ℃
      </p>

      {/* 시간대별 */}
      <h2>⏰ 시간대별 기온</h2>
      <ul>
        {/* 
          - 오늘만 보여주기
          weather.hourly.slice(0, 24)

          - 현재 시간 기준 ±12시간
          const now = new Date().getHours();
          weather.hourly.slice(now, now + 12);
        */}
        {weather.hourly.slice(0, 24).map((hour) => (
          <li key={hour.time}>
            {formatHour(hour.time)} : {hour.temperature} ℃
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatHour(time: string) {
  return new Date(time).getHours() + "시";
}
