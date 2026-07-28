import type { MetadataRoute } from "next";
import { FINCRAFT_BRAND } from "@/components/brand/fincraft-brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: FINCRAFT_BRAND.name,
    short_name: FINCRAFT_BRAND.shortName,
    description: FINCRAFT_BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: FINCRAFT_BRAND.colors.lightBackground,
    theme_color: FINCRAFT_BRAND.colors.lightTheme,
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
