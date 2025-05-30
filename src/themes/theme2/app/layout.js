"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import "../assets/style/index.css";
import FloatedLinks from "../../theme2/components/floatedLinks";
import PixelTracker from "../../theme1/components/PixelTracker/index";
import { getCategories, getSettings } from "../../../lib/api";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { trackTikTokEvent } from "../../../lib/pixelEvents";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const previousPath = useRef("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsResponse = await getSettings();
        if (!settingsResponse.data || settingsResponse.status === 404) {
          setShouldRedirect(true);
          return;
        }
        setSettings(settingsResponse.data);
        // Store pixel data in localStorage
        localStorage.setItem(
          "pixelData",
          JSON.stringify({
            facebook_pixel: settingsResponse.data.facebook_pixel,
            tiktok_pixel: settingsResponse.data.tiktok_pixel,
          })
        );
      } catch (error) {
        console.error("Failed to fetch settings", error);
        if (error.response?.status === 404 || !error.response?.data) {
          setShouldRedirect(true);
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryResponse = await getCategories();
        setCategories(categoryResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchSettings(), fetchCategories()]);
      setLoading(false);
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      trackTikTokEvent("PageView");
    }
  }, [pathname]);
  return (
    <>
      <Header />
      <PixelTracker />
      <FloatedLinks />
      {children}
      <Footer />
    </>
  );
}
