"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import PaymentCard from "../../../../../../../public/landingpageImages/footer-cards.svg"
import { usePathname } from 'next/navigation';
import { FaTwitter, FaInstagram, FaFacebook, FaSnapchat, FaTiktok } from "react-icons/fa";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { getCategories, getPages } from "../../lib/api";
import { useTranslation } from "../../hooks/useTranslation";
import Link from 'next/link';

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/pl1' || pathname === '/pl1/en' || pathname === '/pl1/ar' || /^\/pl1\/[^/]+$/.test(pathname);;
  const [storeSettings, setStoreSettings] = useState(null);
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [getAllPages, setGetAllPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('storeSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStoreSettings(parsed);
      } catch (err) {
        console.error("Error parsing storeSettings from localStorage:", err);
      }
    }
  }, []);
  const socialLinks = storeSettings?.social_links || {};

  const socialIcons = [
    { icon: <FaFacebook />, url: socialLinks.facebook },
    { icon: <FaInstagram />, url: socialLinks.instagram },
    { icon: <FaSnapchat />, url: socialLinks.snapchat },
    { icon: <FaTiktok />, url: socialLinks.tiktok },
    { icon: <FaTwitter />, url: socialLinks.twitter },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPages();
        setGetAllPages(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (

    <div className={`footer-main pt-8 ${isHomePage ? 'pb-28' : 'pb-8'} bg-[#191e2a] px-4 2xl:px-20`}>
      <div className="fixed z-[999999] right-0 bottom-[50%]">
        <button
          onClick={toggleLanguage}
          className="text-sm px-2 py-4 font-[600] border rounded-l-lg z-[999999] 
             backdrop-blur-sm bg-black/10 border-white/20 text-black cursor-pointer"
        >
          {language === "en" ? "AR" : "EN"}
        </button>

      </div>
      <ul className='flex flex-wrap items-center gap-4 justify-center text-white'>

        {getAllPages.map((page) => (
          <li key={page.slug} className='cursor-pointer hover:border-b-white border-b-transparent border-b-2 transition-all duration-[0.3s] ease-in-out'>
            <Link href={`/pl1/page/${page.slug}`}>
              {language === 'ar' ? page.title_ar : page.title}
            </Link>
          </li>
        ))}
      </ul>
      <ul className='flex flex-wrap justify-center items-center gap-4 mt-6 text-white text-2xl'>
        {socialIcons.map((item, index) => (
          item.url ? (
            <li key={index} className='cursor-pointer hover:scale-[1.05] transition-all duration-[0.3s] ease-in-out'>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.icon}
              </a>
            </li>
          ) : null
        ))}
      </ul>
      <div className="flex flex-wrap gap-4 lg:gap-12 mt-12 justify-center lg:justify-between items-center text-white px-6 lg:px-62">
        <Image src={PaymentCard} alt='payment card' unoptimized />
        <p className='text-sm'>Copyright © 2025. By {storeSettings?.store_name}</p>
      </div>
    </div>
  )
}

export default Footer;
