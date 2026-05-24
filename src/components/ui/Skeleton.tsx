/** Shimmer skeleton primitives — keep layout stable while data loads */

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

/** 3-column podium skeleton (matches RankingPage top-3 layout) */
export function SkeletonPodium() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <div className="mt-8 rounded-2xl card-neon p-6 text-center space-y-3">
        <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
        <Skeleton className="h-5 w-28 mx-auto" />
        <Skeleton className="h-8 w-20 mx-auto" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
      <div className="-mt-4 rounded-2xl card-neon p-6 text-center space-y-3">
        <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
        <Skeleton className="h-5 w-28 mx-auto" />
        <Skeleton className="h-8 w-20 mx-auto" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
      <div className="mt-12 rounded-2xl card-neon p-6 text-center space-y-3">
        <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
        <Skeleton className="h-5 w-28 mx-auto" />
        <Skeleton className="h-8 w-20 mx-auto" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
    </div>
  );
}

/** Single ranking row skeleton */
export function SkeletonRankRow() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl card-neon">
      <Skeleton className="h-5 w-6 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-4 w-16 shrink-0" />
    </div>
  );
}

/** Machine card skeleton (matches Home + MapPage sidebar) */
export function SkeletonMachineCard() {
  return (
    <div className="rounded-2xl p-5 card-neon space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="flex justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="h-3 w-16 ml-auto" />
          <Skeleton className="h-7 w-12 ml-auto" />
        </div>
      </div>
    </div>
  );
}

/** Prize card skeleton */
export function SkeletonPrizeCard() {
  return (
    <div className="rounded-2xl border border-purple-900/20 p-6 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-44" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

/** Demo mode / live badge */
export function StatusBadge({
  isDemo,
  isRefreshing,
}: {
  isDemo: boolean;
  isRefreshing: boolean;
}) {
  if (isDemo) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 text-xs font-semibold">
        <span className="text-sm">⚠</span>
        Modo Demo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
      {isRefreshing ? (
        <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      Ao vivo
    </span>
  );
}
