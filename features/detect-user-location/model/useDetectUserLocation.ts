"use client";

import { useEffect, useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

// 사용자 위치 감지
export function useDetectUserLocation() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // fallback: 서울
      setLocation({ latitude: 37.5665, longitude: 126.9780 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setLocation({ latitude: 37.5665, longitude: 126.9780 });
      }
    );
  }, []);

  return location;
}
