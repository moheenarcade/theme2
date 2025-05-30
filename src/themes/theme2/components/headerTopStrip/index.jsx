import React from 'react'
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";

const HeaderTopStrip = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
    return (
        <div className='headerstrip-main py-2 md:py-[13px]'>
            <div className="container mx-auto px-4 lg:px-50">
                <p className={`text-center text-white font-[500] text-[14px]  ${language === "ar" ? "md:text-[14px]" : "md:text-[16px]"}`}>
                    {t('Order_now_and_get')} <span className='text-[#fac51c]'> 50% {t('discount')} </span> {t('free_delivery')}
                </p>
            </div>
        </div>
    )
}

export default HeaderTopStrip;
