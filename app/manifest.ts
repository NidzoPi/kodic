import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kodić",
    short_name: "Kodić",
    description: "Popusti, nagrade i pogodnosti na jednom mjestu.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/ikona2.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/ikona1.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}