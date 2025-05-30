"use client";
import { useEffect, useState } from "react";
import Breadcrembs from '../../components/breadCrembs';
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";

const ContactUs = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [getSetting, setGetSetting] = useState([]);
  console.log(getSetting, "contact us daataa")
  useEffect(() => {
    const settings = localStorage.getItem('storeSettings');
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        setGetSetting(parsedSettings || 'OMR');
      } catch (error) {
        console.error("Failed to parse storeSettings:", error);
      }
    } else {
      console.warn("storeSettings not found in localStorage");
    }
  }, []);
  return (
    <>
      <Breadcrembs label="Contact us" />

      <div className='all-products-main pt-12 xl:pt-20 max-w-[1125px] mx-auto px-4 xl:px-0'>
        <h1 className='text-[#000000] text-[22px] md:text-[24px] font-[600] text-start'>
          {t('Contact_Us')}
        </h1>

        <div className="pt-6 h-[30vh]">
          <p className='text-[#1a1a1a] text-[14px]'>
            {t('To_contact_us_via_email_contactalamtawfir')}{' '}
            <a href={`mailto:${getSetting.store_email}`} className="hover:underline hover:text-[#592404]">
              {getSetting.store_email}
            </a>
          </p>


          <p className='text-center pt-4 text-[#1a1a1a] text-[14px'>{t('We_will_be_happy_to_contact_you_and_answer_your_questions')}</p>
        </div>
      </div>
    </>
  )
}

export default ContactUs
