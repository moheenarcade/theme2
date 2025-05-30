"use client";
import Footer from "./components/footer";
import Header from "./components/header";
import React from "react";
import "./style/landing2.css";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "../pl1/context/LanguageContext";

export default function RootLayout({ children }) {

    return (
        <>
            <LanguageProvider>
                <Header />
                {children}
                <Footer />
            </LanguageProvider>
        </>
    );
}
