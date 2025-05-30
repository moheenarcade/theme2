"use client"
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from '../../../../../context/LanguageContext';

const OurNewProducts = ({ products }) => {
    const { t } = useTranslation();
    const { language, toggleLanguage } = useLanguage();
    // const [products, setProducts] = useState([]);
    console.log(products, "products list");
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const [currencyCode, setCurrencyCode] = useState('');
    const getImageUrl = (imageObj) => {
        if (!imageObj || !imageObj.image) return "/placeholder.webp";
        return imageObj.image.startsWith("http")
            ? imageObj.image
            : `${imageBaseUrl}${imageObj.image}`;
    };

    useEffect(() => {
        const settings = localStorage.getItem('storeSettings');
        if (settings) {
            try {
                const parsedSettings = JSON.parse(settings);
                setCurrencyCode(parsedSettings.currency_code || 'OMR');
            } catch (error) {
                console.error("Failed to parse storeSettings:", error);
            }
        }
    }, []);


    const getMainImage = (images = []) => {
        if (!Array.isArray(images)) return null;

        if (language === 'ar') {
            const arabicMain = images.find(img => img?.isArabicMain === 1);
            if (arabicMain) return arabicMain;
        }

        const main = images.find(img => img?.isMain === 1);
        return main || images[0] || null;
    };

    return (
        <div className='newProduct-main max-w-[1125px] mx-auto px-4 xl:px-0 py-[20px] md:py-[30px]'>
            <h2 className={`text-[#000000] text-[22px] md:text-[24px] text-center mb-4 md:mb-6 ${language === "ar" ? "font-[600]" : "font-[500]"}`}>
                {t('our_new_products')}
            </h2>
            <Swiper
                style={{
                    "--swiper-navigation-color": "white",
                    "--swiper-pagination-color": "white",
                }}
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                }}
                className="new-products"
            >

                {products.slice(0, 4).map((productList, index) => {
                    const hasPrices = productList.prices && productList.prices.length > 0;
                    const price = hasPrices ? productList.prices[0].price : null;
                    const salePrice = hasPrices ? productList.prices[0].sale_price : null;
                    return (
                        <SwiperSlide key={index}>
                            <div
                                className="single-product group cursor-pointer border-[#f0f0f0] border-[1px] rounded-[3px] hover:border-[#592404FF] transition-all duration-[0.3s] ease-in-out"
                            >
                                <div className="border-b-[#f0f0f0] overflow-hidden border-b-[1px] group-hover:border-[#592404FF] transition-all duration-[0.3s] ease-in-out">
                                    <Image
                                        priority
                                        className='w-full h-[270px] lg:h-[256px] rounded-t-[3px] object-cover group-hover:scale-[1.1] transition-all duration-[0.3s] ease-in-out'
                                        src={getImageUrl(getMainImage(productList.images))}
                                        alt={productList.name || "product banner"}
                                        width={300}
                                        height={300}
                                    />
                                </div>
                                <div className="py-[15px] md:py-[20px] px-[15px] flex flex-col justify-between h-[178px]">
                                    <div className="product-desc">
                                        <p className='text-[#592404FF] line-clamp-1 text-[14px] font-[600] text-center mb-[10px]'> {language === 'ar' ? productList.name_ar : productList.name}</p>
                                        {hasPrices &&
                                            price &&
                                            salePrice &&
                                            parseFloat(price) > 0 &&
                                            parseFloat(salePrice) > 0 &&
                                            parseFloat(salePrice) < parseFloat(price) ? (
                                            <div className="text-center mb-[10px] relative">
                                                {/* Original Price with line-through */}
                                                <p className='regular-price text-[#747474] line-through text-[14px] font-[400]'>
                                                    {parseFloat(price).toLocaleString()} {currencyCode}
                                                </p>

                                                {/* Sale Price */}
                                                <p className='text-[#592404FF] font-[600] text-[16px]'>
                                                    {parseFloat(salePrice).toLocaleString()} {currencyCode}
                                                </p>
                                            </div>
                                        ) : (
                                            // Show only one price when no sale
                                            price && (
                                                <p className='text-center text-[#592404FF] font-[600] text-[16px] mb-[10px]'>
                                                    {parseFloat(price).toLocaleString()} {currencyCode}
                                                </p>
                                            )
                                        )}

                                    </div>
                                    <Link href={`/p/${productList.product_sku}`} className={`bg-[#592404] text-center hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] w-fit mx-auto min-w-[190px] rounded-[3px] transition-all duration-[0.3s] ease-in-out ${language === "ar" ? "font-[300]" : "font-[500]"}`}>
                                        {t('buy_now_btn')}
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default OurNewProducts;
