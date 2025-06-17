import React from 'react';

const SkeletonLoader = ({ className = "" }) => {
  return (
    <div className={`w-full rounded-lg bg-gray-100 shadow-md overflow-hidden flex flex-col items-start justify-start ${className}`}>
      {/* Image skeleton */}
      <div className="self-stretch relative h-[280px] mq750:h-[200px] mq450:h-[140px] overflow-hidden shrink-0">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        <div className="absolute top-[16px] right-[16px] rounded-full bg-gray-300 flex flex-row items-center justify-center py-1 px-3.5 animate-pulse">
          <div className="h-3 w-3 bg-gray-300 rounded"></div>
          <div className="w-8 h-3 bg-gray-300 rounded ml-1"></div>
        </div>
      </div>
      
      {/* White space */}
      <div className="w-full h-4 bg-white"></div>
      
      {/* Content skeleton */}
      <div className="self-stretch flex h-[130px] mq750:h-[110px] mq450:h-[100px] flex-col items-start justify-start p-4 mq450:p-2 gap-1">
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-full h-6 bg-gray-200 rounded animate-pulse mt-1"></div>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mt-1"></div>
        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mt-auto"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader; 