import { normalizeLocationCandidates } from "../lib/normalizeLocation";

export async function geocodeLocation(
  location: string
): Promise<{ lat: number; lon: number } | null> {
  const candidates = normalizeLocationCandidates(location);

  for (const name of candidates) {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        name
      )}&count=1&language=ko&country=KR`
    );

    const data = await res.json();

    if (data.results?.length) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
      };
    }
  }

  return null;
}
