"use client"
import React, { useState } from 'react';
import { TiMessages } from "react-icons/ti";
import { GrDeliver } from "react-icons/gr";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GiCash } from "react-icons/gi";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = t("faqs");


  return (
    <div className=" mx-auto pt-12 lg:pb-8 ">
      <div className="space-y-2 lg:space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 ease-in-out"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-left cursor-pointer px-3 md:px-5 py-3 md:py-4 flex justify-between items-center focus:outline-none"
            >
              <span className="text-md md:text-sm lg:text-lg font-[500]">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </button>
            <div
              className={`px-5 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-40 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
                }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 lg:mt-18 flex lg:gap-4 flex-wrap justify-between">
        <div className="flex flex-col items-center lg:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-3 lg:p-6  w-[50%] lg:w-[23%]  2xl:w-[23%]">
          <TiMessages className='text-4xl lg:text-5xl text-[#191e2a] ' />
          <p className='text-sm lg:text-lg font-[500] text-[#191e2a] text-center cairo-family'>{t('Customer_Service')}</p>
        </div>
        <div className="flex flex-col items-center lg:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-3 lg:p-6  w-[50%] lg:w-[23%]  2xl:w-[23%]">
          <GrDeliver className='text-4xl lg:text-5xl' />
          <p className='text-sm lg:text-lg font-[500] text-center cairo-family'>{t('Free_delivery')}</p>
        </div> <div className="flex flex-col items-center lg:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-3 lg:p-6  w-[50%] lg:w-[23%]  2xl:w-[23%]">
          <RiSecurePaymentLine className='text-4xl lg:text-5xl' />
          <p className='text-sm lg:text-lg font-[500] text-center cairo-family'>100% {t('guarantee')}</p>
        </div> <div className="flex flex-col items-center lg:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-3 lg:p-6  w-[50%] lg:w-[23%]  2xl:w-[23%]">
          <GiCash className='text-4xl lg:text-5xl' />
          <p className='text-sm lg:text-lg font-[500] text-center cairo-family'>{t('Cash_on_delivery')}</p>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
