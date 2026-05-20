import React from 'react';

export const SkeletonLoader = ({
  variant = 'card', // card, stats, details, list
  count = 1,
  className = ''
}) => {
  const CardSkeleton = () => (
    <div className="bg-surface border border-border-color rounded-xl p-5 shadow-sm flex flex-col gap-4 animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full aspect-[4/3] bg-bg-secondary rounded-lg flex items-center justify-center">
        <div className="h-8 w-8 bg-neutral-300 rounded" />
      </div>
      {/* Text Details Skeletons */}
      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-1/3 bg-bg-secondary rounded" />
        <div className="h-4 w-4/5 bg-bg-secondary rounded" />
        <div className="h-3 w-1/2 bg-bg-secondary rounded" />
      </div>
      {/* Footer / Meta Skeletons */}
      <div className="flex items-center justify-between pt-2 border-t border-border-color/40">
        <div className="h-3 w-1/4 bg-bg-secondary rounded" />
        <div className="h-4 w-4 bg-bg-secondary rounded-full" />
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="bg-surface border border-border-color rounded-xl p-5 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="h-3 w-1/2 bg-bg-secondary rounded" />
      <div className="h-7 w-1/3 bg-bg-secondary rounded" />
      <div className="h-2.5 w-2/3 bg-bg-secondary rounded" />
    </div>
  );

  const ListSkeleton = () => (
    <div className="w-full py-4 border-b border-border-color/60 flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-10 w-10 bg-bg-secondary rounded-lg" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-1/3 bg-bg-secondary rounded" />
          <div className="h-3 w-1/4 bg-bg-secondary rounded" />
        </div>
      </div>
      <div className="h-3 w-20 bg-bg-secondary rounded" />
      <div className="h-6 w-16 bg-bg-secondary rounded-full" />
    </div>
  );

  const DetailsSkeleton = () => (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="aspect-[16/9] w-full bg-bg-secondary rounded-xl flex items-center justify-center">
        <div className="h-12 w-12 bg-neutral-300 rounded" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-7 w-1/2 bg-bg-secondary rounded" />
        <div className="h-4 w-1/3 bg-bg-secondary rounded" />
      </div>
      <hr className="border-border-color" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-1/4 bg-bg-secondary rounded" />
          <div className="h-5 w-3/4 bg-bg-secondary rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-1/4 bg-bg-secondary rounded" />
          <div className="h-5 w-3/4 bg-bg-secondary rounded" />
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'stats':
        return <StatsSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'details':
        return <DetailsSkeleton />;
      case 'card':
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <div className={`grid gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};
