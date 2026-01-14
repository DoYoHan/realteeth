"use client";

import { useEffect, useState } from "react";
import { useDetectUserLocation } from "@/features/detect-user-location/model/useDetectUserLocation";
import { getWeatherByCoords } from "@/entities/weather/api/weatherApi";
import { mapWeatherCode } from "@/entities/weather/lib/mapWeatherCode";
import Loader from "@/shared/ui/Loader";

// Page 조립 (비즈니스 로직 x) 
export default function WeatherPage() {
  const location = useDetectUserLocation();
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!location) return;

    getWeatherByCoords(location.latitude, location.longitude)
      .then(setWeather)
      .catch(console.error);
  }, [location]);

  if (!location || !weather) return <Loader />;

  return (
    <div>
      <h1>📍 현재 날씨</h1>
      <p>🌡 {weather.temperature} ℃</p>
      <p>🌤 {mapWeatherCode(weather.weatherCode)}</p>
    </div>
  );
}
