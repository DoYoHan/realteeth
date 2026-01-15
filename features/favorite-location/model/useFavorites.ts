"use client";

import { useEffect, useState } from "react";
import { FavoriteLocation } from "./types";

const MAX = 6;

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (fav: FavoriteLocation) => {
    if (favorites.length >= MAX) {
      alert("즐겨찾기는 최대 6개까지 가능합니다.");
      return;
    }
    setFavorites((prev) => [...prev, fav]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const updateAlias = (id: string, alias: string) => {
    setFavorites((prev) =>
      prev.map((f) => (f.id === id ? { ...f, alias } : f))
    );
  };

  return { favorites, addFavorite, removeFavorite, updateAlias };
}
