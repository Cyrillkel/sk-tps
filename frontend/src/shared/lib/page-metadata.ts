import type { Metadata } from "next";

import { siteUrl } from "@/shared/config";

export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const url = new URL(path, siteUrl).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: "ru_RU", type: "website", ...(image ? { images: [{ url: new URL(image, siteUrl).toString() }] } : {}) },
  };
}
