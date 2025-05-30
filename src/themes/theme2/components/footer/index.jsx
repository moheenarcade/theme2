"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from "../../../../../public/images/header-logo.png";
import Image from 'next/image';
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";
import { getCategories, getPages } from "../../../../lib/api";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [storeSettings, setStoreSettings] = useState(null);
    const pathname = usePathname();
    const isProductPage = pathname?.startsWith('/p/');
  const [categories, setCategories] = useState([]);
  const [getAllPages, setGetAllPages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('storeSettings');
      if (settings) {
        setStoreSettings(JSON.parse(settings));
      }
    }
  }, []);


  const formatTime = (timeString) => {
    if (!timeString) return '';

    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  { new Date().getFullYear() }

  return (

    <div className='footer-main pt-8 border-t-[#a68a64] border-t-[1px] mt-6'>
      <div className="max-w-[1125px] mx-auto px-4 xl:px-0">
        <div className="footer-logo w-fit mx-auto pb-8">
          <Link href="/">
            <Image className='w-[100px] mx-auto' src={Logo} alt="logo" />
          </Link>
        </div>

        <div className={`footer-links border-y-[#f0f0f0] border-y-[1px] py-6 flex flex-col items-center lg:items-start lg:flex-row justify-between flex-wrap gap-8 lg:gap-4`}>
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
            <div className="">
              <p className='text-[18px] font-[500]'>{t('Terms_and_policies')}</p>
              <div className="bg-[#592404] w-[25px] h-[1px] mx-auto lg:mx-0"></div>
            </div>

            <ul className='pt-3'>
              {getAllPages.map((page) => (
                <li key={page.slug} className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>
                  <Link href={`/${page.slug}`}>
                    {language === 'ar' ? page.title_ar : page.title}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
            <div className="">
              <p className='text-[18px] font-[500]'>{t('Contact_Us')}</p>
              <div className="bg-[#592404] w-[25px] h-[1px] mx-auto lg:mx-0"></div>
            </div>
            <ul className='pt-3'>
              <Link href='/contact-us'>
                <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>Contact us</li>
              </Link>

            </ul>
          </div>
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
            <div className="">
              <p className='text-[18px] font-[500]'>{t('About_the_store')}</p>
              <div className="bg-[#592404] w-[25px] h-[1px] mx-auto lg:mx-0"></div>
            </div>

            <ul className='pt-3'>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>{storeSettings?.store_open_from} to {storeSettings?.store_open_to}</li>
              {storeSettings?.store_opening_time && storeSettings?.store_closing_time && (
                <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>
                  <span>{formatTime(storeSettings.store_opening_time)} - {formatTime(storeSettings.store_closing_time)}</span>
                </li>
              )}
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>{storeSettings?.special_notice}</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Footer;
