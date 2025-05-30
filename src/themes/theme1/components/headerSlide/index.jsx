"use client"
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../../hooks/useTranslation';

const HeaderSlide = () => {
      const { t } = useTranslation();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const texts = [
        t('free_24_home_delivery'),  
        t('summer_discounts'),
        t('cash_on_delivery')
      ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex(prevIndex => (prevIndex + 1) % texts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="header-top-strip z-[999999999] px-2 text-center text-sm xl:text-md 2xl:text-[16px] py-1 xl:py-3 bg-[#1a2f61] font-[300] text-white">
            <p className="">{texts[currentTextIndex]}</p>
        </div>
    );
};

export default HeaderSlide;
