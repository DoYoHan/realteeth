// 공통 로딩 UI
export default function Loader() {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40
      "
    >
      <div className="flex flex-col items-center gap-3">
        {/* 모래시계 스피너 */}
        <div
          className="
            h-12 w-12
            animate-spin
            rounded-full
            border-4 border-white
            border-t-transparent
          "
        />

        {/* 텍스트 */}
        <p className="text-sm text-white">로딩 중...</p>
      </div>
    </div>
  );
}
