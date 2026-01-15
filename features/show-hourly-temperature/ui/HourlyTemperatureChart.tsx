"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface HourlyData {
  time: string;
  temperature: number;
}

interface Props {
  hourly: HourlyData[];
}

export function HourlyTemperatureChart({ hourly }: Props) {
  const chartData = hourly.slice(0, 24).map((h) => ({
    hour: new Date(h.time).getHours() + "시",
    temperature: h.temperature,
  }));

  const temperatures = chartData.map((d) => d.temperature);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);
  const nowHour = new Date().getHours() + "시";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis unit="℃" domain={["auto", "auto"]} />

          {/* 최고 / 최저 */}
          <ReferenceLine
            y={maxTemp}
            stroke="#ef4444"
            strokeDasharray="4 4"
            label={{ value: "최고", position: "right", fill: "#ef4444" }}
          />
          <ReferenceLine
            y={minTemp}
            stroke="#3b82f6"
            strokeDasharray="4 4"
            label={{ value: "최저", position: "right", fill: "#3b82f6" }}
          />

          {/* 현재 시간 */}
          <ReferenceLine
            x={nowHour}
            stroke="#22c55e"
            strokeWidth={2}
            label={{ value: "지금", position: "top", fill: "#22c55e" }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              borderColor: "#bae6fd",
              backgroundColor: "white",
            }}
            labelStyle={{
              color: "#6b7280", // 시간 텍스트 (hour)
              fontWeight: 600,
            }}
            itemStyle={{
              color: "#3b82f6", // 기온 텍스트 색상
            }}
            formatter={(value) =>
              typeof value === "number"
                ? [`${value} ℃`, "기온"]
                : ["-", "기온"]
            }
          />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
