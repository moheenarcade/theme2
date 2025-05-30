"use client"
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../../../../context/LanguageContext';
import { useTranslation } from '../../../../../hooks/useTranslation';
import { getProducts } from "../../../../../lib/api";
import RandomReviews from "../../../components/randomReviews"


const HotSaleListing = () => {
    const { t } = useTranslation();
    const swiperRef = useRef(null);
    const { language } = useLanguage();
    const [products, setProducts] = useState([]);
    console.log(products, "products list");
    const [loading, setLoading] = useState(true);
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const [currencyCode, setCurrencyCode] = useState('');
    const getImageUrl = (imageObj) => {
        if (!imageObj || !imageObj.image) return "/placeholder.webp";
        return imageObj.image.startsWith("http")
            ? imageObj.image
            : `${imageBaseUrl}${imageObj.image}`;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProducts(data.data || []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const getHoverImage = (images = []) => {
        if (!Array.isArray(images)) return null;
        const hoverImg = images.find(img => img?.isMain === 0 && img?.isArabicMain !== 1);
        return hoverImg || null;
    };


    return (
        <div className='container hero-slider-main px-4 md:px-6 2xl:px-28 mx-auto pt-6 md:pt-12' dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex justify-between items-center">
                <h1 className='text-xl md:text-2xl font-[600] text-[#000000de]'>{t('hot_sale')}</h1>
                <Link href="/products" className='text-[#f69853] border-[1px] border-[#f69853] py-1 md:py-2 px-4 rounded-md text-md font-[300] hover:scale-[1.05] tarnsition-all duration-[0.6s] ease-in-out' >
                    {t('see_more')}
                </Link>
            </div>

            <div className="hotSale-slider pt-4 flex gap-4">
                <div className="w-full"
                    onMouseEnter={() => swiperRef.current?.swiper.autoplay.stop()}
                    onMouseLeave={() => swiperRef.current?.swiper.autoplay.start()}
                >
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop
                        breakpoints={{
                            0: {
                                slidesPerView: 1.2,
                                spaceBetween: 10,
                            },
                            425: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4.3,
                                spaceBetween: 24,
                            },
                        }}
                        className="w-full"
                    >

                        {products.map((productList, index) => {
                            const hasPrices = productList.prices && productList.prices.length > 0;
                            const price = hasPrices ? productList.prices[0].price : null;
                            const salePrice = hasPrices ? productList.prices[0].sale_price : null;

                            return (
                                <SwiperSlide key={index}>
                                    <Link href={`/p/${productList.product_sku}`}>
                                        <div className="product-card-main group border-[1px] border-[#0000001f] rounded-md cursor-pointer p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                                            <div className="">
                                                <div className="product-banner-sec relative overflow-hidden">
                                                    <Image
                                                        className='w-full block'
                                                        src={getImageUrl(getMainImage(productList.images))}
                                                        alt={productList.name || "product banner"}
                                                        width={300}
                                                        height={300}
                                                        priority
                                                    />

                                                    {getHoverImage(productList.images) && (
                                                        <Image
                                                            className="w-full h-full absolute top-0 left-0 right-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
                                                            src={getImageUrl(getHoverImage(productList.images))}
                                                            alt={productList.name || "product hover banner"}
                                                            width={300}
                                                            height={300}
                                                            priority
                                                        />
                                                    )}

                                                    {/* {hasPrices && salePrice && price && salePrice < price && (
                                                        <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                                                            {Math.round(((price - salePrice) / price) * 100)}% OFF
                                                        </div>
                                                    )} */}

                                                    {hasPrices &&
                                                        price &&
                                                        salePrice &&
                                                        parseFloat(price) > 0 &&
                                                        parseFloat(salePrice) > 0 &&
                                                        parseFloat(salePrice) < parseFloat(price) && (
                                                            <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                                                                {Math.round(((parseFloat(price) - parseFloat(salePrice)) / parseFloat(price)) * 100)}% OFF
                                                            </div>
                                                        )}
                                                </div>
                                                <p className='text-[15px] font-[300] pt-1 line-clamp-2 h-[50px]'>
                                                    {language === 'ar' ? productList.name_ar : productList.name}
                                                </p>
                                            </div>
                                            <div className="">
                                                <RandomReviews />
                                                <div className="h-[50px]">
                                                    <div className="product-price flex items-center gap-2 pt-2 ">
                                                        {hasPrices ? (() => {
                                                            const showSalePrice = salePrice && salePrice !== "0.00";
                                                            const showPrice = price && price !== "0.00";

                                                            if (showSalePrice && showPrice) {
                                                                return (
                                                                    <div className="flex items-center gap-1">
                                                                        <b className='text-[17px]'>{salePrice}</b>
                                                                        <p className='uppercase font-[300]'>{currencyCode}</p>
                                                                    </div>
                                                                );
                                                            } else if (showPrice) {
                                                                return (
                                                                    <div className="flex items-center gap-1">
                                                                        <b className='text-[17px]'>{price}</b>
                                                                        <p className='uppercase font-[300]'>{currencyCode}</p>
                                                                    </div>
                                                                );
                                                            } else if (showSalePrice) {
                                                                return (
                                                                    <div className="flex items-center gap-1">
                                                                        <b className='text-[17px]'>{salePrice}</b>
                                                                        <p className='uppercase font-[300]'>{currencyCode}</p>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return <div className="text-[13px] text-red-500">No Price Added</div>;
                                                            }
                                                        })() : (
                                                            <div className="text-[13px] text-red-500">No Price Added</div>
                                                        )}

                                                    </div>
                                                    {hasPrices && price && salePrice && salePrice !== "0.00" && price !== salePrice ? (
                                                        <b className='text-[17px] line-through font-[300]'>{price} {currencyCode}</b>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default HotSaleListing;
