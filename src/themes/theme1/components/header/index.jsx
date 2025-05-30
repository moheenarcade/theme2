"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "../../../../../public/images/gray-circle-icon-png-crisp-quality.png";
import Link from "next/link";
import HeaderSlide from "../headerSlide";
import "../../assets/style/togglemenu.css";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";
import HeaderCategory from "../headerCategory";
import { getCategories,  searchProducts } from "../../../../lib/api";
import MobileMenuLinks from "../../components/mobileMenuLinks";
import { FaWhatsapp } from "react-icons/fa6";
import "./switchbtn.css"

import { getBaseUrls } from "../../../../../utils/getBaseurls";

const { LOGO_BASE_URL } = getBaseUrls() || {
  LOGO_BASE_URL: "https://reselluae.com/api/rest",
};


const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL_FOT_LOGO;
const SearchImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [isSticky, setIsSticky] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeSettings, setStoreSettings] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBox, setShowBox] = useState(false);
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

console.log(Logo , "logo here ")
  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      const term = searchTerm.trim();
      if (term.length < 1) {
        setResults([]);
        return;
      }
      try {
        setSearchLoading(true);
        const data = await searchProducts(term);
        setResults(data?.data || []);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(run, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('storeSettings');
      if (settings) {
        setStoreSettings(JSON.parse(settings));
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuToggleRef = useRef(null);

  // Function to close the mobile menu
  const closeMobileMenu = () => {
    if (menuToggleRef.current) {
      menuToggleRef.current.checked = false;
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return Logo;
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const encodedPath = encodeURI(imagePath);
    return `${LOGO_BASE_URL}${encodedPath}`;
  };

  const getSearchImageUrl = (imagePath) => {
    if (!imagePath) return Logo;
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const encodedPath = encodeURI(imagePath);
    return `${SearchImageUrl}${encodedPath}`;
  };

  return (
    <header>
      <HeaderSlide />
      <div
        className={`header-main border-b-[1px] border-b-gray-300 z-[99999] ${isSticky
          ? "fixed top-0 left-0 right-0 z-[9999999] bg-white"
          : "relative"
          }`}
      >
        <div className="hidden lg:block">
          <div
            className={`header-navbar container px-4 md:px-6 2xl:px-28 mx-auto `}
          >
            <nav className="flex items-center py-4 border-b-[1px] border-b-gray-300">
              <div className="flex items-center gap-12 w-full">
                <Link href="/">
                  <div className="flex gap-2 items-center">
                    <Image
                      className="w-[50px]"
                      src={getImageUrl(storeSettings?.store_logo)}
                      alt="logo"
                      width={100}
                      height={100}
                     
                    />
                    <p className="font-bold text-[#00000080] uppercase">
                      {storeSettings?.store_name}
                    </p>
                  </div>
                </Link>
                <div className="w-[70%] relative">
                  <input
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setShowBox(!!e.target.value.trim());
                    }}
                    onFocus={() => setShowBox(!!searchTerm.trim())}
                    onBlur={() => setTimeout(() => setShowBox(false), 120)}
                    value={searchTerm}
                    type="search"
                    placeholder={t("search_products")}
                    className="head-search-bar border-[1px] border-gray-300 bg-[#f4f4f4] rounded-sm w-full py-2 px-4"
                  />

                  {showBox && (
                    <div
                      className="absolute left-0 right-0 mt-1 bg-white border border-gray-200
               rounded shadow-lg z-[999999] overflow-y-auto"
                      dir={language === "ar" ? "rtl" : "ltr"}
                      style={{ maxHeight: "400px" }}
                    >
                      {searchLoading ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="lds-ellipsis" bis_skin_checked="1"><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div></div>
                        </div>
                      ) : results.length ? (
                        <ul>
                          {results.map((p) => (
                            <Link href={`/p/${p.sku}`} key={p.sku}>
                              <li
                                className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  setSearchTerm("");
                                  setShowBox(false);
                                }}
                              >
                                <Image
                                  src={getSearchImageUrl(p.thumbnail || p.image)}
                                  alt={p.name}
                                  width={60}
                                  height={60}
                                 
                                  className="rounded h-[50px] w-[50px] object-cover"
                                />
                                <div>
                                  <p className="text-md font-[400]">{language == "ar" ? p.name_ar : p.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {p.price} {storeSettings.currency_code || ""}
                                  </p>
                                </div>
                              </li>
                            </Link>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-4 text-center text-sm">{t("No data found")}</p>
                      )}
                    </div>
                  )}


                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className='whatsapp-btn py-2 flex justify-center px-1 text-[#05d960] '>
                  <Link
                    href={`https://wa.me/${storeSettings?.mobile_code}${storeSettings?.store_whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  ><FaWhatsapp className='text-3xl' /></Link>
                </div>
                <div className="switch">
                  <input
                    id="language-toggle"
                    className="check-toggle check-toggle-round-flat"
                    type="checkbox"
                    onChange={toggleLanguage}
                    checked={language === "en"}
                  />
                  <label htmlFor="language-toggle"></label>
                  <span className="on">AR</span>
                  <span className="off">EN</span>
                </div>
              </div>
            </nav>
            <HeaderCategory />
          </div>
        </div>
        <div className="block lg:hidden mobile-header relative">
          <div
            className={`flex items-center justify-between gap-12 w-full px-2 py-2 ${isSticky
              ? "fixed top-0 left-0 right-0 z-[9999999] bg-white shadow-md"
              : ""
              }`}
          >
            <Link href="/">
              <div className="flex items-center">
                <Image
                  className="w-[35px]"
                  src={getImageUrl(storeSettings?.store_logo)}
                  alt="logo"
                  width={100}
                  height={100}
                 
                />
              </div>
            </Link>
            <div className="w-[70%] ">
              <input
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setShowBox(!!e.target.value.trim());
                }}
                onFocus={() => setShowBox(!!searchTerm.trim())}
                onBlur={() => setTimeout(() => setShowBox(false), 120)}
                value={searchTerm}
                type="search"
                placeholder={t("search_products")}
                className="text-[14px] head-search-bar border-[1px] border-gray-300 bg-[#f4f4f4] rounded-sm w-full py-1 px-2"
              />

              {showBox && (
                <div
                  className="absolute left-0 py-2 right-0 mt-1 bg-white border border-gray-200
               rounded shadow-lg z-[999999] overflow-y-auto"
                  dir={language === "ar" ? "rtl" : "ltr"}
                  style={{
                    maxHeight: "300px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {searchLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="lds-ellipsis" bis_skin_checked="1"><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div><div bis_skin_checked="1"></div></div>
                    </div>
                  ) : results.length ? (
                    <ul>
                      {results.map((p) => (
                        <Link href={`/p/${p.sku}`} key={p.sku}>
                          <li
                            className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setSearchTerm("");
                              setShowBox(false);
                            }}
                          >
                            <Image
                              src={getSearchImageUrl(p.thumbnail || p.image)}
                              alt={p.name}
                              width={60}
                              height={60}
                           
                              className="rounded h-[50px] w-[50px] object-cover"
                            />
                            <div>
                              <p className="text-sm font-[400]">{language == "ar" ? p.name_ar : p.name}</p>
                              <p className="text-xs text-gray-500">
                                {p.price} {storeSettings.currency_code || ""}
                              </p>
                            </div>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-4 text-center text-sm">{t("No data found")}</p>
                  )}
                </div>
              )}
            </div>
            <div className="hamburger-menu w-[10%] md:w-[4%] flex justify-end">
              <input id="menu__toggle" type="checkbox" ref={menuToggleRef} />
              <label
                className={`menu__btn z-[999999] ${isSticky ? "top-[10px]" : "top-[36px]"
                  } ${language === "ar" ? "right-[89%]" : "right-[15px]"}`}
                htmlFor="menu__toggle"
              >
                <span></span>
              </label>

              <ul className="menu__box ">
                <p
                  className={`1text-[18px] pl-5 font-[600] text-[#333] ${language === "ar" ? "pr-[24px]" : "pr-[5px]"
                    }`}
                >
                  {t("Menu")}
                </p>
                <MobileMenuLinks categories={categories} closeMobileMenu={closeMobileMenu} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
