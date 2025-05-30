import React from 'react';
import DOMPurify from 'dompurify';
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../.././../../context/LanguageContext";

const ProductDescription = ({ description , description_ar}) => {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const rawDescription = language === 'ar' ? description_ar : description;
    const sanitizedDescription = DOMPurify.sanitize(rawDescription);
  return (
    <>

      <div 
        className="description-content mt-2"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
    </>
  );
};

export default ProductDescription;