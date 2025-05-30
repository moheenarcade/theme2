"use client";
import React, { useState, useEffect } from "react";
import {
    getProducts,
} from "../../../../lib/api";
import Image from 'next/image';
import ProductImage1 from "../../../../../public/images/productbanner1.webp";
import ProductImage2 from "../../../../../public/images/produyctbanner2.webp";
import ProductImage3 from "../../../../../public/images/producvtbanner3.webp";
import ProductImage4 from "../../../../../public/images/productbanner4.webp";
import Link from 'next/link';
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";
import Laoder from "../../../theme1/components/loader/index";
import Lottie from "lottie-react";
import noDataAnimation from "../../../../../public/images/Animation - 1744786688528.json";
import { trackBothEvents } from "../../../../lib/pixelEvents";

const AllProducts = () => {
    const { t } = useTranslation();
    const { language, toggleLanguage } = useLanguage();
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currencyCode, setCurrencyCode] = useState("");

    console.log(product, "all products in theme2 products page")
    
    useEffect(() => {
        trackBothEvents("ViewContent", {
            content_name: "Products",
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProduct(data.data || []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Laoder />
            </div>
        );
    }

    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const getImageUrl = (imageObj) => {
        if (!imageObj || !imageObj.image) return "/placeholder.webp";
        return imageObj.image.startsWith("http")
            ? imageObj.image
            : `${imageBaseUrl}${imageObj.image}`;
    };

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
        <div className='all-products-main pt-12 xl:pt-20 max-w-[1125px] mx-auto px-4 xl:px-0'>
            <h1 className={`text-[#000000] text-[22px] md:text-[24px] text-center ${language === "ar" ? "font-[600]" : "font-[500]"}`}>
                {t('all_product')}
            </h1>
            <p className='text-center text-[14px] text-[#696969]'>{t('You_will_find_everything_you_are_looking_for')}</p>

            {product && product.length > 0 ? (
                <div className="all-products my-10">
                    {product.map((productList) => {
                        const hasPrices = productList.prices && productList.prices.length > 0;
                        const price = hasPrices ? productList.prices[0].price : null;
                        const salePrice = hasPrices ? productList.prices[0].sale_price : null;

                        return (
                            <div
                                key={productList.product_sku}
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
                                        <p className='text-[#592404FF] line-clamp-1 text-[14px] font-[600] text-center mb-[10px]'>
                                            {language === 'ar' ? productList.name_ar : productList.name}
                                        </p>

                                        {hasPrices &&
                                            price &&
                                            salePrice &&
                                            parseFloat(price) > 0 &&
                                            parseFloat(salePrice) > 0 &&
                                            parseFloat(salePrice) < parseFloat(price) ? (
                                            <div className="text-center mb-[10px] relative">
                                                <p className='regular-price text-[#747474] line-through text-[14px] font-[400]'>
                                                    {parseFloat(price).toLocaleString()} {currencyCode}
                                                </p>
                                                <p className='text-[#592404FF] font-[600] text-[16px]'>
                                                    {parseFloat(salePrice).toLocaleString()} {currencyCode}
                                                </p>
                                            </div>
                                        ) : (
                                            price && (
                                                <p className='text-center text-[#592404FF] font-[600] text-[16px] mb-[10px]'>
                                                    {parseFloat(price).toLocaleString()} {currencyCode}
                                                </p>
                                            )
                                        )}
                                    </div>
                                    <Link
                                        href={`/p/${productList.product_sku}`}
                                        className={`bg-[#592404] text-center hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] w-fit mx-auto min-w-[190px] rounded-[3px] transition-all duration-[0.3s] ease-in-out ${language === "ar" ? "font-[300]" : "font-[500]"}`}>
                                        {t('buy_now_btn')}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center pt-2">
                    <Lottie
                        animationData={noDataAnimation}
                        loop={true}
                        className="w-[300px]"
                    />
                    <p className="text-center py-4 text-gray-500 text-sm -mt-18">
                        {t("No_related_product_available")}
                    </p>
                </div>
            )}
        </div>
    )
}

export default AllProducts;
