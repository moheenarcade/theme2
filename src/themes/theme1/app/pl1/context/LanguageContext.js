// "use client";
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { usePathname } from "next/navigation";

// const LanguageContext = createContext();

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState(null);
//   const pathname = usePathname();

//   useEffect(() => {
//     const validLanguages = ["en", "ar"];
//     const segments = pathname.split("/").filter(Boolean);
//     const lastSegment = segments[segments.length - 1]?.toLowerCase();
//     const urlLang = validLanguages.includes(lastSegment) ? lastSegment : null;

//     const browserLang =
//       typeof window !== "undefined" ? navigator.language.toLowerCase() : null;
//     const browserBasedLang = browserLang?.startsWith("ar")
//       ? "ar"
//       : browserLang?.startsWith("en")
//       ? "en"
//       : null;

//     const storedLang =
//       typeof window !== "undefined" ? localStorage.getItem("language") : null;

//     const resolvedLang =
//       storedLang && validLanguages.includes(storedLang)
//         ? storedLang
//         : urlLang && validLanguages.includes(urlLang)
//         ? urlLang
//         : browserBasedLang
//         ? browserBasedLang
//         : "en";

//     setLanguage(resolvedLang);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("language", resolvedLang);
//     }
//   }, [pathname]);

//   useEffect(() => {
//     if (language) {
//       document.documentElement.lang = language;
//       document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
//     }
//   }, [language]);

//   const toggleLanguage = () => {
//     const newLang = language === "en" ? "ar" : "en";
//     setLanguage(newLang);
//     localStorage.setItem("language", newLang);
//   };
//   if (language === null) return null;
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