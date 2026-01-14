export interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_min: number[];
    temperature_2m_max: number[];
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}
