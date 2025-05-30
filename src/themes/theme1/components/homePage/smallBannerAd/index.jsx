'use client';
import React, { useRef, useEffect, useState } from 'react';
import Image from "next/image";
import { useLanguage } from '../../../../../context/LanguageContext';
import { getSBanners } from "../../../../../lib/api";
import Link from 'next/link';

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

const getImageUrl = (imageObj, language) => {
    const imagePath = language === 'ar' ? imageObj.image_ar : imageObj.image;
    if (!imagePath) return "/placeholder.webp";
    return imagePath.startsWith("http") ? imagePath : `${imageBaseUrl}${imagePath}`;
};


const SmallBannerAd = () => {
    const { language } = useLanguage();
    const [centerBanners, setCenterBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSBanners();
                const banners = response?.data || [];
                const filtered = banners.filter(b => b.position === 'center');
                setCenterBanners(filtered);
            } catch (error) {
                console.error("Failed to fetch banners", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || centerBanners.length === 0) return null;
    const getBannerLink = (banner) => {
        return language === 'ar' ? banner.link_ar : banner.link;
    };

    return (

        <div className='smallBanner-ad-main container px-4 md:px-6 2xl:px-28 mx-auto pt-6 md:pt-12'>
            <Link href={getBannerLink(centerBanners[0])} target="_blank" rel="noopener noreferrer">
            <div className="rounded-xl">
                <Image priority className="rounded-xl w-full h-[110px] object-cover md:h-[110px] 2xl:h-[200px]" width={1200} height={300} src={getImageUrl(centerBanners[0], language)} alt='ad banner' />
            </div>
            </Link>
        </div>
    )
}

export default SmallBannerAd;
