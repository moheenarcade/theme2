'use client'
import React, { useEffect, useState } from 'react';
import HeaderTopStrip from '../headerTopStrip';
import Image from 'next/image';
import HeaderLogo from "../../../public/images/header-logo.png";
import { LuSearch } from "react-icons/lu";
import clsx from 'clsx';
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter } from 'next/navigation';
import { IoClose } from "react-icons/io5";
import Link from 'next/link';


const Header = () => {
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsSticky(window.scrollY > 120);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

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
                  <Image className='w-[90px]' src={HeaderLogo} alt='logo' />
                </Link>
              </div>
              <ul className='flex items-center gap-8 SMN_effect-33'>
                <Link href="/">
                  <li className='cursor-pointer relative hover:text-[#592404]'>
                    Home
                  </li>
                </Link>
                <Link href="/products">
                  <li className='cursor-pointer relative hover:text-[#592404]'>
                    All Products
                  </li>
                </Link>
                <li className='cursor-pointer relative hover:text-[#592404]'>
                  Contact us
                </li>
              </ul>
              <div className="search cursor-pointer absolute lg:right-4 xl:right-0">
                <LuSearch className='text-[20px]' />

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-navbar block lg:hidden">
        <div className={clsx(
          "top-0 w-full z-50 transition-all duration-300 shadow-md",
          isSticky ? "fixed backdrop-blur-sm bg-white/90" : "relative"
        )}>
          <div className="flex justify-between items-center px-4 py-1">
            <div className="searchbar">
              <LuSearch className='text-[22px]' />
            </div>
            <Link href="/">
              <div className="logo">
                <Image className='w-[55px]' src={HeaderLogo} alt='logo' />
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
                <Link href="/" onClick={() => setMobileMenu(false)}>
                  <div className="logo mx-auto">
                    <Image className='w-[65px]' src={HeaderLogo} alt='logo' />
                  </div>
                </Link>
                <div className="w-full mt-4 flex items-center rounded-[3px] border-[#e5e5e5] border-[1px] px-4">
                  <LuSearch className='text-[22px]' />
                  <input className='w-full py-3 pl-4 outline-none' type="search" placeholder='Search' />
                </div>
              </div>
              <ul className="mt-6 px-4">
                <Link href="/" onClick={() => setMobileMenu(false)}>
                  <li className='border-b-[#e5e5e5] border-b-[1px] py-3'>Home</li>
                </Link>
                <Link href="/products" onClick={() => setMobileMenu(false)}>
                  <li className='border-b-[#e5e5e5] border-b-[1px] py-3'>All Products</li>
                </Link>

                <li className='border-b-[#e5e5e5] border-b-[1px] py-3'>Contact</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header >
  )
}

export default Header;
