"use client";
import Footer from "../pl1/components/footer";
import Header from "../pl1/components/header";
import React from "react";
import "../pl1/style/index.css";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import FaviconLoader from "../pl1/components/FaviconLoader";

export default function PL1Layout({ children }) {
  const pathname = usePathname();
  const hideHeaderPaths = ["/pl1/success"];
  const shouldShowHeader = !hideHeaderPaths.includes(pathname);

  return (
    <>
      <LanguageProvider>
        <FaviconLoader />
        {shouldShowHeader && <Header />}
        {children}
        <Footer />
      </LanguageProvider>
    </>
  );
}
