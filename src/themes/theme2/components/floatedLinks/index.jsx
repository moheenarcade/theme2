'use client';
import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa6";
import Link from 'next/link';
import { useLanguage } from '../../../../context/LanguageContext';


const FloatedLinks = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const whatsappNumber = '971565651133';
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    return (

        <div className={`floatedLinks-main bg-white fixed top-[50%]  z-[99999999999999999] ${language === 'ar' ? 'left-0 rounded-r-lg ' : 'right-0'}`}>
            <div className="block">
                <button
                    onClick={toggleLanguage}
                    className='lang-btn py-2 px-1 flex justify-center cursor-pointer border-b-[1px] border-b-[#592404]'
                >
                    <span className="ms-1 text-sm font-[800] text-[#592404]">
                        {language === 'en' ? 'AR' : 'EN'}
                    </span>
                </button>
                <div className='whatsapp-btn py-2 flex justify-center px-1 text-[#05d960] '>
                    <Link href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"><FaWhatsapp className='text-2xl' /></Link>
                </div>
                {showScrollTop && (
                    <button onClick={scrollToTop} className='scroll-top-btn flex justify-center py-2 px-1 w-full cursor-pointer border-t-[1px] border-t-[#592404]'>
                        <FaAngleUp className='text-xl text-[#592404]' />
                    </button>
                )}
            </div>
        </div>
    )
}

export default FloatedLinks;
