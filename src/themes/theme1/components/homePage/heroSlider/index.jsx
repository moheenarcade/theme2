'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useLanguage } from '../../../../../context/LanguageContext';
import { getSBanners } from "../../../../../lib/api";
import Link from 'next/link';
import Loader from '../../loader';

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

const getImageUrl = (imageObj, language) => {
    const imagePath = language === 'ar' ? imageObj.image_ar : imageObj.image;
    if (!imagePath) return "/placeholder.webp";
    return imagePath.startsWith("http") ? imagePath : `${imageBaseUrl}${imagePath}`;
};

const HeroSlider = () => {
    const swiperRef = useRef(null);
    const { language } = useLanguage();
    const [topBanners, setTopBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSBanners();
                const banners = response?.data || [];
                const filtered = banners.filter(b => b.position === 'top');
                setTopBanners(filtered);
            } catch (error) {
                console.error("Failed to fetch banners", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || topBanners.length === 0) return null;

    const getBannerLink = (banner) => {
        return language === 'ar' ? banner.link_ar : banner.link;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <Loader />
                {error && (
                    <p className="mt-4 text-sm text-red-500">
                        {language === 'ar' ? 'خطأ في الشبكة. حاول مرة أخرى.' : 'Network error. Please try again.'}
                    </p>
                )}
            </div>
        );
    }

    if (error && topBanners.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <Loader />
                <p className="mt-4 text-sm text-red-500">
                    {language === 'ar' ? 'خطأ في الشبكة. حاول مرة أخرى.' : 'Network error. Please try again.'}
                </p>
            </div>
        );
    }

    if (topBanners.length === 0) return null;

    return (
        <div className="container hero-slider-main px-4 md:px-6 2xl:px-28 mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="relative"
                onMouseEnter={() => swiperRef.current?.swiper?.autoplay?.stop()}
                onMouseLeave={() => swiperRef.current?.swiper?.autoplay?.start()}
            >
                {topBanners.length === 1 ? (
                    <Link href={getBannerLink(topBanners[0])} target="_blank" rel="noopener noreferrer">
                        <div className="w-full h-[120px] md:h-[220px] lg:h-[280px] xl:h-[340px] rounded-xl overflow-hidden relative">
                            <Image
                                src={getImageUrl(topBanners[0], language)}
                                alt="top banner"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-xl"
                                priority
                            />
                        </div>
                    </Link>
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop
                        className="w-full h-[120px] md:h-[220px] lg:h-[280px] xl:h-[340px] rounded-xl"
                        ref={swiperRef}
                    >
                        {topBanners.map((banner, index) => (
                            <SwiperSlide key={index}>
                                <Link href={getBannerLink(banner)} target="_blank" rel="noopener noreferrer">
                                    <div className="heroslide h-full relative">
                                        <Image
                                            src={getImageUrl(banner, language)}
                                            alt={`banner-${index}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-xl"
                                           priority
                                        />
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default HeroSlider;
