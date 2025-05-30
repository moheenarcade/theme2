"use client";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../../../../../../../public/landingpage2Images/landing2logo.webp"
import Image from 'next/image';
import { IoLogoWhatsapp } from "react-icons/io";
import Link from "next/link";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { getBaseUrls } from "../../../../../../../utils/getBaseurls";

const { LOGO_BASE_URL } = getBaseUrls() || {
    LOGO_BASE_URL: "https://reselluae.com/api/rest",
};

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL_FOT_LOGO;


const Header = () => {
    const { t } = useTranslation();
    const { language, toggleLanguage } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [sticky, setIsSticky] = useState(true);
    const [storeSettings, setStoreSettings] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const settings = localStorage.getItem('storeSettings');
            if (settings) {
                setStoreSettings(JSON.parse(settings));
            }
        }
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


    const logoSrc =
        storeSettings?.store_logo
            ? `${imageBaseUrl}/${storeSettings.store_logo}`
            : null;

    return (
        <div className='container mx-auto px-0 lg:px-100 fixed top-0 right-0 left-0 z-[999]'>
            <div className="flex items-center justify-between py-1 px-2 bg-white border-b-[#dee2e6] border-b-[1px]">
                <Link href="/pl3">
                    <div className="logo-sec">
                        {logoSrc && (
                            <Image
                                src={logoSrc}
                                alt="store logo"
                                width={120}
                                height={40}
                                className="w-[70px] h-auto"
                                priority
                            />
                        )}
                    </div>
                </Link>
                <div className="flex gap-2 items-center">
                    <div className='whatsapp-btn flex flex-col items-center justify-center px-1 text-[#05d960] '>
                        <Link
                            href={`https://wa.me/${storeSettings?.mobile_code}${storeSettings?.store_whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        ><IoLogoWhatsapp className='text-xl' /></Link>
                        <p className="text-sm text-[#212529]">{t('Contact_Us')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;
