"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer/index";
import Header from "../components/header/index";
import Head from "next/head";
import "../assets/style/index.css";
import FloatedLinks from "../components/floatedLinks";
import { LanguageProvider } from "../../../context/LanguageContext";
import MobileBottomMenu from "../components/mobileBottomMenu";
import Loader from "../components/loader";
import { getCategories, getSettings } from "../../../lib/api";
import { SelectedCategoryProvider } from "../../../context/SelectedCategoryContext";
import PixelTracker from "../components/PixelTracker";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { trackTikTokEvent } from "../../../lib/pixelEvents";
import FaviconLoader from "../components/FaviconLoader";
import { useRouter } from "next/navigation";
import { getBaseUrls } from "../../../../utils/getBaseurls";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const pathname = usePathname();
  const previousPath = useRef("");
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const isPlainLandingPage = /^\/pl[0-9]+/.test(pathname);

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

  // useEffect(() => {
  //   if (shouldRedirect) {
  //     // Replace this with your external URL
  //     window.location.href = "https://ecomdoors.com/";
  //   }
  // }, [shouldRedirect]);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      trackTikTokEvent("PageView");
    }
  }, [pathname]);

  useEffect(() => {
    const baseUrls = getBaseUrls();
    if (baseUrls) {
      console.log("Current Base URLs:", baseUrls);
    } else {
      console.warn("getBaseUrls(): window is not available (likely SSR)");
    }
  }, []);

  if (shouldRedirect) {
    return <Loader />;
  }

  return (
    <>
      <html lang="en">
        <body>
          <FaviconLoader />
          <LanguageProvider>
            <SelectedCategoryProvider>
              <Head>
                <link
                  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;800;900&display=swap"
                  rel="stylesheet"
                />
              </Head>
              {/* <Header />
            <FloatedLinks />
            <MobileBottomMenu />
            {loading ? <Loader /> : <>{children}</>}
            <Footer />
            <PixelTracker /> */}
              {isPlainLandingPage ? (
                <>{children}</>
              ) : (
                <>
                  <Header />
                  <FloatedLinks />
                  <MobileBottomMenu />
                  {loading ? <Loader /> : <>{children}</>}
                  <Footer />
                  <PixelTracker />
                </>
              )}
            </SelectedCategoryProvider>
          </LanguageProvider>
        </body>
      </html>
    </>
  );
}
