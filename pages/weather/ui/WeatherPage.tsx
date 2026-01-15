"use client";

import { useEffect, useState } from "react";
import { useDetectUserLocation } from "@/features/detect-user-location/model/useDetectUserLocation";
import { useWeatherQuery } from "@/entities/weather/api/queries";
import { mapWeatherCode } from "@/entities/weather/lib/mapWeatherCode";
import { geocodeLocation } from "@/entities/location/api/geocode";
import Loader from "@/shared/ui/Loader";
import { LocationSearch } from "@/features/location-search/ui/LocationSearch";
import { getTopRegion } from "@/entities/location/lib/normalizeLocation";
import { useFavorites } from "@/features/favorite-location/model/useFavorites";
import { v4 as uuid } from "uuid";
import { FavoriteCard } from "@/features/favorite-location/ui/FavoriteCard";
import { HourlyTemperatureChart } from "@/features/show-hourly-temperature/ui/HourlyTemperatureChart";

// Page 조립
export default function WeatherPage() {
  const { favorites, addFavorite, removeFavorite, updateAlias } = useFavorites();

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
      ? { lat: detectedLocation.latitude, lon: detectedLocation.longitude }
      : null);

  // Hook은 항상 호출
  const { data: weather, isLoading } = useWeatherQuery(
    coords?.lat ?? 0,
    coords?.lon ?? 0,
    { enabled: !!coords, }
  );

  // 즐겨찾기 중복 확인
  const isAlreadyFavorite =
    !!coords &&
    favorites.some(
      (f) => f.lat === coords.lat && f.lon === coords.lon
    );

  useEffect(() => {
    if (detectedLocation && !manualCoords) {
      setCurrentRegion("내 위치");
    }
  }, [detectedLocation, manualCoords]);

  return (
    <main className="relative min-h-screen bg-sky-50 px-4 py-6 flex justify-center">
      {/* 로딩 오버레이 */}
      {(isLoading || isSearching || !coords || !weather) && <Loader />}

      {/* 기존 화면 유지 */}
      <div className="w-full max-w-3xl space-y-6">
        {/* 현재 지역 */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold text-sky-600">
            📍 {currentRegion ? getTopRegion(currentRegion) : "내 위치"}
          </h2>
          <p className="text-sm text-gray-500">현재 조회 중인 지역</p>
          <button
            disabled={isAlreadyFavorite}
            onClick={() =>
              addFavorite({
                id: uuid(),
                name: currentRegion!,
                alias: getTopRegion(currentRegion!),
                lat: coords!.lat,
                lon: coords!.lon,
              })
            }
            className={`
              mt-2
              inline-flex items-center gap-1
              rounded-lg
              px-3 py-1.5
              text-sm font-medium
              shadow
              transition
              ${isAlreadyFavorite
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-sky-500 text-white cursor-pointer hover:bg-sky-600 active:scale-95"
              }
            `}
          >
            {isAlreadyFavorite ? "⭐ 이미 즐겨찾기됨" : "⭐ 즐겨찾기 추가"}
          </button>
        </div>

        {/* 즐겨찾기 지역 목록 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <FavoriteCard
              key={fav.id}
              favorite={fav}
              onClick={() => {
                setManualCoords({ lat: fav.lat, lon: fav.lon });
                setCurrentRegion(fav.name);
              }}
              onRemove={() => removeFavorite(fav.id)}
              onRename={(name) => updateAlias(fav.id, name)}
            />
          ))}
        </div>

        {/* 지역 검색 */}
        <div className="bg-white rounded-xl shadow p-4">
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
              } catch {
                alert("지역 검색 중 오류가 발생했습니다.");
              } finally {
                setIsSearching(false);
              }
            }}
          />
        </div>

        {/* 날씨 정보는 데이터 있을 때만 */}
        {weather && (
          <>
            <div className="bg-white rounded-xl shadow p-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">현재 기온</p>
                <p className="text-2xl font-bold text-sky-600">
                  {weather.currentTemperature} ℃
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">날씨 상태</p>
                <p className="text-lg font-medium text-sky-600">
                  {mapWeatherCode(weather.weatherCode)}
                </p>
              </div>
              <div className="col-span-2 flex justify-center gap-6 text-sm text-gray-700">
                <span>🔻 {weather.minTemperature} ℃</span>
                <span>🔺 {weather.maxTemperature} ℃</span>
              </div>
            </div>

            {/* 시간대별 기온 */}
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-semibold mb-3 text-sky-600">
                ⏰ 시간대별 기온
              </h3>

              {/* 그래프 */}
              <HourlyTemperatureChart hourly={weather.hourly} />

              {/* 리스트 */}
              <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {weather.hourly.slice(0, 24).map((hour) => (
                  <li
                    key={hour.time}
                    className="bg-sky-100 rounded-lg p-2 text-center"
                  >
                    <p className="text-sm text-gray-600">
                      {formatHour(hour.time)}
                    </p>
                    <p className="font-semibold text-sky-600">
                      {hour.temperature} ℃
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function formatHour(time: string) {
  return new Date(time).getHours() + "시";
}
