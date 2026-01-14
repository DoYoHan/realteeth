"use client";

import { useWeatherQuery } from "../api/queries";

export default function WeatherInfo() {
  const { data, isLoading, error } = useWeatherQuery(37.6325, 127.0246);

  if (isLoading) return <p>날씨 불러오는 중...</p>;
  if (error) return <p>날씨 정보를 불러오지 못했습니다.</p>;

  const todayMin = data.daily.temperature_2m_min[0];
  const todayMax = data.daily.temperature_2m_max[0];
  const hourlyTemps = data.hourly.temperature_2m.slice(0, 24);

  return (
    <div>
      <h2>오늘의 기온</h2>
      <p>최저: {todayMin}°C</p>
      <p>최고: {todayMax}°C</p>

      <h3>시간대별 기온</h3>
      <ul>
        {hourlyTemps.map((temp: number, idx: number) => (
          <li key={idx}>
            {idx}시 : {temp}°C
          </li>
        ))}
      </ul>
    </div>
  );
}
