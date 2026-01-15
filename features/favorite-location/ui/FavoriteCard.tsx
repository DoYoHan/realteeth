import { useState, useRef, useEffect } from "react";
import { useWeatherQuery } from "@/entities/weather/api/queries";
import { mapWeatherCode } from "@/entities/weather/lib/mapWeatherCode";
import { FavoriteLocation } from "../model/types";

interface Props {
  favorite: FavoriteLocation;
  onClick: () => void;
  onRemove: () => void;
  onRename: (name: string) => void;
}

export function FavoriteCard({
  favorite,
  onClick,
  onRemove,
  onRename,
}: Props) {
  const { data } = useWeatherQuery(favorite.lat, favorite.lon, {
    staleTime: 1000 * 60 * 10,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [alias, setAlias] = useState(favorite.alias);
  const inputRef = useRef<HTMLInputElement>(null);

  // 수정 모드 진입 시 자동 포커스
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const finishEdit = () => {
    setIsEditing(false);
    if (alias.trim() && alias !== favorite.alias) {
      onRename(alias.trim());
    } else {
      setAlias(favorite.alias);
    }
  };

  return (
    <div
      onClick={!isEditing ? onClick : undefined}
      className="
        cursor-pointer
        rounded-xl
        bg-white
        shadow
        p-4
        space-y-2
        hover:ring-2
        hover:ring-sky-300
        transition
      "
    >
      <div className="flex justify-between items-center gap-2">
        {/* 별칭 영역 */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            onBlur={finishEdit}
            onKeyDown={(e) => e.key === "Enter" && finishEdit()}
            className="
              w-full
              rounded-md
              border
              border-sky-400
              bg-sky-50
              px-2
              py-1
              text-sm
              font-semibold
              text-sky-700
              outline-none
              ring-2
              ring-sky-200
              transition
            "
          />
        ) : (
          <span className="font-semibold text-sky-600 truncate">
            {favorite.alias}
          </span>
        )}

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 shrink-0">
          {!isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="
                text-gray-400
                hover:text-sky-500
                transition
              "
              title="별칭 수정"
            >
              ✏️
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="
              text-gray-400
              hover:text-red-400
              transition
            "
            title="즐겨찾기 삭제"
          >
            ❌
          </button>
        </div>
      </div>

      {data && (
        <>
          <p className="text-sm text-gray-600">
            {mapWeatherCode(data.weatherCode)}
          </p>
          <p className="text-sm text-gray-700">
            🔻 {data.minTemperature}℃ / 🔺 {data.maxTemperature}℃
          </p>
        </>
      )}
    </div>
  );
}
