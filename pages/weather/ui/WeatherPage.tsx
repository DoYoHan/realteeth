"use client";

import { useEffect, useState } from "react";
import { useDetectUserLocation } from "@/features/detect-user-location/model/useDetectUserLocation";
import { useWeatherQuery } from "@/entities/weather/api/queries";
import { mapWeatherCode } from "@/entities/weather/lib/mapWeatherCode";
import { geocodeLocation } from "@/entities/location/api/geocode";
import Loader from "@/shared/ui/Loader";
import { LocationSearch } from "@/features/location-search/ui/LocationSearch";
import { getTopRegion } from "@/entities/location/lib/normalizeLocation";

// Page 조립
export default function WeatherPage() {
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const detectedLocation = useDetectUserLocation();
  const [manualCoords, setManualCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  // 좌표 결정
  const coords =
    manualCoords ??
    (detectedLocation
      ? {
        lat: detectedLocation.latitude,
        lon: detectedLocation.longitude,
      }
      : null);

  // Hook은 항상 호출
  const { data: weather, isLoading } = useWeatherQuery(
    coords?.lat ?? 0,
    coords?.lon ?? 0,
    {
      enabled: !!coords,
    }
  );

  useEffect(() => {
    if (detectedLocation && !manualCoords) {
      setCurrentRegion("내 위치");
    }
  }, [detectedLocation, manualCoords]);

  if (!coords || isLoading || isSearching || !weather) {
    return <Loader />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>
        📍 {currentRegion ? getTopRegion(currentRegion) : "내 위치"}
      </h2>
      <p style={{ color: "#888" }}>현재 조회 중인 지역</p>

      {/* 지역 검색 */}
      <LocationSearch
        onSelect={async (location) => {
          setIsSearching(true);

          try {
            const coord = await geocodeLocation(location);
            if (!coord) {
              alert("해당 장소의 정보가 제공되지 않습니다.");
              return;
            }

            setManualCoords(coord); // 이 순간 React Query가 자동으로 재요청
            setCurrentRegion(location); // 지역명 수정
          } catch (e) {
            alert("지역 검색 중 오류가 발생했습니다.");
          } finally {
            setIsSearching(false);
          }
        }}
      />

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
        {weather.hourly.slice(0, 24).map(
          (hour: { time: string; temperature: number }) => (
            <li key={hour.time}>
              {formatHour(hour.time)} : {hour.temperature} ℃
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function formatHour(time: string) {
  return new Date(time).getHours() + "시";
}
