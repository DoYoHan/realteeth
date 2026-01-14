export interface HourlyTemperature {
  time: string;
  temperature: number;
}

// 타입 정의
export interface Weather {
  currentTemperature: number;
  weatherCode: number;

  minTemperature: number;
  maxTemperature: number;

  hourly: HourlyTemperature[];
}
