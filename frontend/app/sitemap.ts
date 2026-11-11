import type { MetadataRoute } from "next";

import { cityPagePath, publishedCityLandings } from "@/entities/geography";
import { projects } from "@/entities/project";
import { services } from "@/entities/service";
import { siteUrl } from "@/shared/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/seti/", "/proekty/", "/contacts/", "/soglasie/", ...services.map(({ slug }) => `/${slug}/`), ...projects.map(({ slug }) => `/${slug}/`), ...publishedCityLandings.map(({ citySlug }) => cityPagePath(citySlug))];
  return paths.map((path) => ({ url: new URL(path, siteUrl).toString() }));
}
