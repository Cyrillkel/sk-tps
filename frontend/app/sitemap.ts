import type { MetadataRoute } from "next";

import { projects } from "@/entities/project";
import { services } from "@/entities/service";
import { siteUrl } from "@/shared/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/seti/", "/proekty/", "/contacts/", "/soglasie/", ...services.map(({ slug }) => `/${slug}/`), ...projects.map(({ slug }) => `/${slug}/`)];
  return paths.map((path) => ({ url: new URL(path, siteUrl).toString() }));
}
