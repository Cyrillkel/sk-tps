type ImageVariant = {
  src: string;
  width: number;
};

type ResponsiveImageProps = {
  src: string;
  alt: string;
  variants: readonly ImageVariant[];
  sizes: string;
  fill?: boolean;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
};

/** Prebuilt WebP sources work with static hosting and need no client-side code. */
export function ResponsiveImage({ src, alt, variants, sizes, fill = false, width, height, loading = "lazy", fetchPriority, className = "" }: ResponsiveImageProps) {
  return (
    <picture className={fill ? "pointer-events-none absolute inset-0 block" : undefined}>
      <source type="image/webp" srcSet={variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ")} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={`${fill ? "block size-full " : ""}${className}`}
      />
    </picture>
  );
}
