'use client'
import React, { useEffect, useState } from 'react';
import HeaderTopStrip from '../headerTopStrip';
import Image from 'next/image';
import HeaderLogo from "../../../../../public/images/header-logo.png";
import { LuSearch } from "react-icons/lu";
import clsx from 'clsx';
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";
import { searchProducts } from "../../../../lib/api";
import { getBaseUrls } from "../../../../../utils/getBaseurls";
import Logo from "../../../../../public/images/gray-circle-icon-png-crisp-quality.png";

const { LOGO_BASE_URL } = getBaseUrls() || {
  LOGO_BASE_URL: "https://reselluae.com/api/rest",
};

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL_FOT_LOGO;
const SearchImageUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL

const Header = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [storeSettings, setStoreSettings] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // const fetchResults = async (query) => {
  //   setSearchLoading(true);
  //   setTimeout(() => {
  //     const mockResults = [
  //       { id: 1, name: "Product 1", price: "130 AED" },
  //       { id: 2, name: "Product 2", price: "120 AED" },
  //       { id: 3, name: "Product 3", price: "350 AED" },
  //       { id: 4, name: "Product 4", price: "450 AED" },
  //     ];
  //     setResults(mockResults);
  //     setSearchLoading(false);
  //   }, 500);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!(event.target).closest('.searchable-content')) {
        setShowBox(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isPageScrollable = document.body.scrollHeight > window.innerHeight;
      if (isPageScrollable) {
        setIsSticky(window.scrollY > 120);
      } else {
        setIsSticky(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : 'auto';
  }, [mobileMenu]);

  useEffect(() => {
    const closeMenu = () => setMobileMenu(false);

    router.events?.on?.('routeChangeComplete', closeMenu);

    return () => {
      router.events?.off?.('routeChangeComplete', closeMenu);
    };
  }, [router]);


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
    <header className='header-main'>
      <HeaderTopStrip />
      <div className="hidden lg:block header-body">
        <div
          className={clsx(
            "top-0 w-full z-50 transition-all  duration-300 backdrop-blur-sm bg-white/90",
            isSticky ? "fixed shadow-md " : "relative"
          )}
        >
          <div className="max-w-[1125px] mx-auto h-[100px] flex justify-center px-6 lg:px-50 py-2 relative">
            <div className="flex items-center justify-center">
              <div className="logo absolute lg:left-4 xl:left-0">
                <Link href="/">
                  {/* <Image className='w-[90px]' src={HeaderLogo} alt='logo' /> */}
                  <Image
                    className="w-[90px]"
                    src={getImageUrl(storeSettings?.store_logo)}
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </Link>

              </div>
              <ul className={`flex items-center gap-8 SMN_effect-33 arabic-font  ${language === "ar" ? "font-[600]" : "font-[500]"}`}>
                <Link href="/" passHref>
                  <li className={clsx(
                    'cursor-pointer relative hover:text-[#592404] ',
                    pathname === '/' && 'text-[#592404] active-link',
                    language === 'ar' ? 'text-[13px]' : 'text-[16px]'
                  )}>
                    {t('Home')}
                  </li>
                </Link>
                <Link href="/products" passHref>
                  <li className={clsx(
                    'cursor-pointer relative hover:text-[#592404]',
                    pathname === '/products' && 'text-[#592404] active-link',
                    language === 'ar' ? 'text-[13px]' : 'text-[16px]'
                  )}>
                    {t('All_Products')}
                  </li>
                </Link>
                <Link href="/contact-us" passHref>
                  <li className={clsx(
                    'cursor-pointer relative hover:text-[#592404]',
                    pathname === '/contact-us' && 'text-[#592404] active-link',
                    language === 'ar' ? 'text-[13px]' : 'text-[16px]'
                  )}>
                    {t('Contact_Us')}
                  </li>
                </Link>
              </ul>
              <div onClick={() => setShowSearch(!showSearch)} className="search cursor-pointer absolute lg:right-4 xl:right-0">
                <LuSearch className='text-[20px]' />
              </div>
            </div>
          </div>
          {showSearch && (
            <div className='searchable-content absolute right-0 left-0 w-full'>
              <div className="searchbox-field bg-[#592404] py-2 px-4">
                <div className="max-w-[1125px] mx-auto flex items-center rounded-[3px] bg-white">
                  <input
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setShowBox(!!e.target.value.trim());
                      if (value.length > 1) {
                        setShowBox(true);
                        fetchResults(value);
                      } else {
                        setShowBox(false);
                      }
                    }}
                    onFocus={() => setShowBox(!!searchTerm.trim())}
                    onBlur={() => setTimeout(() => setShowBox(false), 120)}
                    value={searchTerm}
                    type="search"
                    className='h-[40px] outline-none rounded-[3px] py-2 px-6 w-full bg-white' name="search" id="search" />
                  <div className="search cursor-pointer px-6">
                    <LuSearch className='text-[20px]' />
                  </div>
                </div>
              </div>
              {showBox && (
                <div className='max-w-[1125px] mx-auto relative'>
                  <div
                    className="absolute left-0 right-0 mt-0 bg-white border border-gray-200
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mobile-navbar block lg:hidden">
        <div className={clsx(
          "top-0 w-full z-50 transition-all duration-300 shadow-md",
          isSticky ? "fixed backdrop-blur-sm bg-white/90" : "relative"
        )}>
          <div className="flex justify-between items-center px-4 py-1">
            <div className="searchbar" onClick={() => setShowSearch(!showSearch)}>
              <LuSearch className='text-[22px]' />
            </div>
            <Link href="/">
              <div className="logo">
                {/* <Image className='w-[55px]' src={HeaderLogo} alt='logo' /> */}
                <Image
                    className="w-[65px]"
                    src={getImageUrl(storeSettings?.store_logo)}
                    alt="logo"
                    width={100}
                    height={100}
                  />
              </div>
            </Link>
            <div className="mobile-menu-toggle " onClick={toggleMobileMenu}>
              <RxHamburgerMenu className='text-2xl' />

            </div>
          </div>

          {/* Overlay */}
          <div
            className={clsx(
              "fixed h-screen inset-0 bg-black/50 z-[9999999998] transition-opacity duration-300",
              mobileMenu ? "opacity-100 visible" : "opacity-0 invisible"
            )}
            onClick={() => setMobileMenu(false)}
          />
          <div
            className={clsx(
              "fixed top-0 right-0 bottom-0 h-screen w-[80%] max-w-sm bg-white z-[9999999999] shadow-lg transition-transform duration-300",
              mobileMenu ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="py-4">
              <div className="flex flex-col items-center px-4 pb-4">
                <Link href="/" onClick={() => setMobileMenu(false)} >
                  <div className="logo mx-auto">
                    {/* <Image className='w-[65px]' src={HeaderLogo} alt='logo' /> */}
                    <Image
                    className="w-[65px]"
                    src={getImageUrl(storeSettings?.store_logo)}
                    alt="logo"
                    width={100}
                    height={100}

                  />
                  </div>
                </Link>
                <div className="w-full mt-4 flex items-center rounded-[3px] border-[#e5e5e5] border-[1px] px-4">
                  <LuSearch className='text-[22px]' />
                  <input className='w-full py-3 pl-4 outline-none' type="search" placeholder='Search' />
                </div>
              </div>
              <ul className="mt-6 px-4">
                <Link href="/" onClick={() => setMobileMenu(false)} passHref>
                  <li className={clsx(
                    'cursor-pointer relative border-b-[#e5e5e5] border-b-[1px] py-3 hover:text-[#592404]',
                    pathname === '/' && 'text-[#592404] active-link'
                  )}>Home</li>
                </Link>
                <Link href="/products" onClick={() => setMobileMenu(false)} passHref>
                  <li
                    className={clsx(
                      'cursor-pointer relative border-b-[#e5e5e5] border-b-[1px] py-3 hover:text-[#592404]',
                      pathname === '/products' && 'text-[#592404] active-link'
                    )}
                  >All Products</li>
                </Link>

                <li className='border-b-[#e5e5e5] border-b-[1px] py-3'>Contact</li>
              </ul>
            </div>
          </div>
          {showSearch && (
            <div className='searchable-content relative'>
              <div className="searchbox-field  absolute w-full right-0 left-0 z-[999999]">
                <div className="bg-[#592404] py-2 px-4">
                  <div className="max-w-[1125px] mx-auto flex items-center rounded-[3px] bg-white">
                    <input
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setShowBox(!!e.target.value.trim());
                        if (value.length > 1) {
                          setShowBox(true);
                          fetchResults(value);
                        } else {
                          setShowBox(false);
                        }
                      }}
                      onFocus={() => setShowBox(!!searchTerm.trim())}
                      onBlur={() => setTimeout(() => setShowBox(false), 120)}
                      value={searchTerm}
                      type="search"
                      className='h-[40px] outline-none rounded-[3px] py-2 px-4 w-full bg-white' name="search" id="search" />
                    <div className="search cursor-pointer pr-6">
                      <LuSearch className='text-[20px]' />
                    </div>
                  </div>
                </div>
                {showBox && (
                  <div className='max-w-[1125px] mx-4 relative'>
                    <div
                      className=" left-0 right-0 mt-0 bg-white border border-gray-200
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
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header >
  )
}

export default Header;
