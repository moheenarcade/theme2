// 'use client';
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState(null); // Start with null to prevent flicker

//   useEffect(() => {
//     // Check localStorage for the saved language when the component mounts
//     const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : 'en';
//     if (savedLanguage) {
//       setLanguage(savedLanguage); // Set language from localStorage
//     } else {
//       setLanguage('en'); // Default to 'en' if no language is found in localStorage
//     }
//   }, []); // Run only once when the component mounts

//   const toggleLanguage = () => {
//     const newLanguage = language === 'en' ? 'ar' : 'en';
//     setLanguage(newLanguage);
//     localStorage.setItem('language', newLanguage); // Save the selected language to localStorage
//   };

//   useEffect(() => {
//     // Avoid setting document properties if the language is not set yet
//     if (language) {
//       document.documentElement.lang = language;
//       document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
//     }
//   }, [language]);

//   if (language === null) {
//     return null; // Return nothing while the language is being loaded
//   }

//   return (
//     <LanguageContext.Provider value={{ language, toggleLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => useContext(LanguageContext);





"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(null);
  const pathname = usePathname();

  // List of supported languages
  const validLanguages = ["en", "ar"];

  // Function to determine language based on priority
  const determineLanguage = () => {
    // 1. Check URL first
    const urlLang = getLanguageFromUrl();
    if (urlLang) return urlLang;

    // 2. Check localStorage for previously set language
    const storedLang = getStoredLanguage();
    if (storedLang) return storedLang;

    // 3. Check browser language
    const browserLang = getBrowserLanguage();
    if (browserLang) return browserLang;

    // 4. Default to English
    return "en";
  };

  // Helper function to get language from URL
  const getLanguageFromUrl = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1]?.toLowerCase();
    return validLanguages.includes(lastSegment) ? lastSegment : null;
  };

  // Helper function to get language from localStorage
  const getStoredLanguage = () => {
    if (typeof window === "undefined") return null;
    const storedLang = localStorage.getItem("language");
    return validLanguages.includes(storedLang) ? storedLang : null;
  };

  // Helper function to get language from browser
  const getBrowserLanguage = () => {
    if (typeof window === "undefined") return null;
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("ar")) return "ar";
    if (browserLang.startsWith("en")) return "en";
    return null;
  };

  // Update language when pathname changes
  useEffect(() => {
    const newLang = determineLanguage();
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  }, [pathname]);

  // Update HTML attributes when language changes
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  // Function to toggle/change language
  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  // Don't render until language is determined
  if (language === null) return null;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);