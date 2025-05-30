"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import PaymentCard from "../../../../../../../public/landingpageImages/footer-cards.svg"
import { usePathname } from 'next/navigation';
import { FaTwitter, FaInstagram, FaFacebook, FaSnapchat, FaTiktok } from "react-icons/fa";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { getCategories, getPages } from "../../../pl1/lib/api";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import Link from 'next/link';
import { FaAnglesUp } from "react-icons/fa6";


const Footer = () => {
    const pathname = usePathname();
    const isHomePage = pathname === '/pl1' || pathname === '/pl1/en' || pathname === '/pl1/ar' || /^\/pl1\/[^/]+$/.test(pathname);;
    const [storeSettings, setStoreSettings] = useState(null);
    const { language, toggleLanguage } = useLanguage();
    const { t } = useTranslation();
    const [getAllPages, setGetAllPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
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
        <footer className='footer max-w-[640px] mx-auto relative'>
            <div className={`footer-main pt-8 ${isHomePage ? 'pb-28' : 'pb-20'} bg-[#191e2a] px-4 2xl:px-20`}>
                <div className="language-toogle-tbn fixed z-[999999] flex flex-col gap-2 right-2 bottom-[18%]">
                    <button
                        onClick={toggleLanguage}
                        className=' w-8 h-8 text-center text-white text-[14px] flex items-center justify-center rounded-full backdrop-blur-sm bg-amber-500 shadow-md transition hover:scale-110'
                    >
                        {language === 'ar' ? 'EN' : 'AR'}
                    </button>

                    {showBackToTop && (
                    <div className="">
                        <button
                            onClick={scrollToTop}
                            className='backTop-btn w-8 h-8 text-center flex items-center justify-center rounded-full backdrop-blur-sm bg-amber-500 shadow-md transition hover:scale-110'
                        >
                            <FaAnglesUp className='text-white' />
                        </button>
                    </div>
                )}
                </div>
           
                <ul className='flex flex-wrap items-center gap-4 justify-center text-white'>

                    {getAllPages.map((page) => (
                        <li key={page.slug} className='cursor-pointer hover:text-[#f39800] hover:border-b-[#f39800] border-b-transparent border-b-2 transition-all duration-[0.3s] ease-in-out'>
                            <Link href={`/pl2/page/${page.slug}`}>
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
                <div className="flex flex-wrap gap-4 mt-12 justify-center lg:justify-between items-center text-white px-2">
                    <Image className='w-[50%] h-auto' src={PaymentCard} alt='payment card' />
                    <p className='text-sm'>Copyright © 2025. By {storeSettings?.store_name}</p>
                </div>
            </div>


        </footer>
    )
}

export default Footer;
