import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white p-6 rounded-2xl border border-border flex flex-col gap-2">
        <div className="h-3 w-24 bg-muted rounded"></div>
        <div className="h-7 w-48 bg-muted rounded"></div>
        <div className="h-4 w-72 bg-muted rounded"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white border border-border p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded-lg"></div>
            </div>
            <div className="h-7 w-20 bg-muted rounded"></div>
          </div>
        ))}
      </div>

      {/* Table/Content Skeleton */}
      <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
        <div className="h-5 w-40 bg-muted rounded"></div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-surface-secondary"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
