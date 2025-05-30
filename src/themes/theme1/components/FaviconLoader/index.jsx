"use client";
import { useEffect } from "react";

const FaviconLoader = () => {
  useEffect(() => {
    const stored = localStorage.getItem('storeSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.store_favicon) {
          const fullUrl = parsed.store_favicon.startsWith("http")
            ? parsed.store_favicon
            : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL_FOT_LOGO || ""}/${parsed.store_favicon}`;
          console.log(fullUrl , "faveiocn")
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = `${fullUrl}?v=${Date.now()}`;
        }
      } catch (err) {
        console.error("Failed to parse storeSettings for favicon:", err);
      }
    }
  }, []);

  return null;
};

export default FaviconLoader;