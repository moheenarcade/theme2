import React from 'react';
import Image from "next/image";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

const HeroBanner = ({ products }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    console.log('products in landing page', products)
    if (!products || products.length === 0 || !products[0].images || products[0].images.length === 0) {
        return null;
    }

    const getMainImage = (images, lang) => {
        if (lang === 'ar') {
            const arabicMain = images.find(img => img.isArabicMain === 1);
            if (arabicMain) return arabicMain.image;
        } else {
            const englishMain = images.find(img => img.isMain === 1);
            if (englishMain) return englishMain.image;
        }
        return images[0].image; // fallback to first image
    };

    const imagePath = getMainImage(products[0].images, language);
    const fullImageUrl = `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${imagePath}`;


    // const imagePath = products[0].images[0].image;
    // const fullImageUrl = `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${imagePath}`;

    return (
        <>
            <div className="main-banner pt-0 lg:pt-4">
                <Image priority
                    className="w-full h-auto"
                    src={fullImageUrl}
                    alt="main banner"
                    width={1200}
                    height={600}
                />
            </div>
        </>
    );
};

export default HeroBanner;
