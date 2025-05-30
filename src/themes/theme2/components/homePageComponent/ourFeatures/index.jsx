import React from 'react'
import { RiSecurePaymentFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import { GrDeliver } from "react-icons/gr";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";

const OurFeatures = () => {
    const { t } = useTranslation();
    const { language, toggleLanguage } = useLanguage();
    return (
        <div className='max-w-[1125px] mx-auto px-4 xl:px-0 py-[30px]'>
            <h2 className={`text-[#000000] text-[22px] md:text-[24px] text-center mb-8 ${language === "ar" ? "font-[600]" : "font-[500]"}`}>{t('Our_features')}</h2>
            <div className="features-main">
                <div className="single-feature flex justify-center items-center flex-col">
                    <div className="bg-[#41251e] mb-2 flex justify-center items-center rounded-full text-[#ffffff] h-[68px] w-[68px] ">
                        <RiSecurePaymentFill className='text-[38px]' />
                    </div>
                    <p className={`text-[#000000] text-lg lg:text-[18px] text-center ${language === "ar" ? "font-[600]" : "font-[500]"}`}>{t('Secure_payment')}</p>
                    <p className='text-[#000000] text-sm md:text-[14px] mt-2 text-center'>{t('Payment_upon_receipt')}</p>
                </div>
                <div className="single-feature flex justify-center items-center flex-col">
                    <div className="bg-[#41251e] mb-2 flex justify-center items-center rounded-full text-[#ffffff] h-[68px] w-[68px] ">
                        <BsCart4 className='text-[38px]' />
                    </div>
                    <p className={`text-[#000000] text-lg lg:text-[18px] text-center ${language === "ar" ? "font-[600]" : "font-[500]"}`}>{t('Shop_with_confidence')}</p>
                    <p className='text-[#000000] text-sm md:text-[14px] mt-2 text-center'>
                        {t('Subscriber_protection_policies_cover_your_entire_purchasing_journey')}
                    </p>
                </div>
                <div className="single-feature flex justify-center items-center flex-col">
                    <div className="bg-[#41251e] mb-2 flex justify-center items-center rounded-full text-[#ffffff] h-[68px] w-[68px] ">
                        <GrDeliver className='text-[38px]' />
                    </div>
                    <p className={`text-[#000000] text-lg lg:text-[18px] text-center ${language === "ar" ? "font-[600]" : "font-[500]"}`}>{t('Delivery')}</p>
                    <p className='text-[#000000] text-sm md:text-[14px] mt-2 text-center'>{t('Free_delivery_throughout_the_Kingdom_of_Saudi_Arabia')}</p>
                </div>

            </div>
        </div>
    )
}

export default OurFeatures;
