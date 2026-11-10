"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { Skeleton } from "./skeleton";

type ImageWithSkeletonProps = ImageProps & {
  /** Extra classes for the placeholder, e.g. `skeleton-on-dark` over dark cards. */
  skeletonClassName?: string;
};

/**
 * next/image with a skeleton on top until the photo has loaded (or failed).
 * The parent must be positioned: the skeleton covers it with `absolute inset-0`.
 */
export function ImageWithSkeleton({ skeletonClassName = "", onLoad, onError, alt, ...props }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Image
        alt={alt}
        {...props}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setIsLoaded(true);
          onError?.(event);
        }}
      />
      <Skeleton
        aria-hidden="true"
        data-loaded={isLoaded}
        className={`pointer-events-none absolute inset-0 rounded-none ${skeletonClassName}`}
      />
    </>
  );
}
