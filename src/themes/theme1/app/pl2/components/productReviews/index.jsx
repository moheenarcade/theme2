'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import BannerAfterreviews from "../../../../../../../public/landingpage2Images/afterreviewbanner.webp";
import BannerAfterreviewsArabic from "../../../../../../../public/landingpage2Images/By-me-not-AI.jpg";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { getProductBySlug } from "../../../../../../lib/api";

const ProductReviews = ({ product_sku }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(product, "product reviews");

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await getProductBySlug(product_sku);
                if (!data) {
                    router.push("/not-found");
                    return;
                }
                setProduct(data.data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                router.push("/not-found");
            } finally {
                setLoading(false);
            }
        }
        if (product_sku) {
            fetchProduct();
        }
    }, [product_sku]);

    return (
        <div className="" id='productRating'>
            {/* <div className="reviews-content flex items-center justify-between px-[10px] py-4 border-b-[#e7e7e7] border-b-[1px]">
                <div className="">
                    <p className='text-[#666] font-[500] text-xl'>{t('Customer_reviews')}</p>
                </div>
                <div className="flex flex-col justify-center items-start">
                    <p className='text-[#F39800]'><span className='font-bold text-xl'>4.9</span>/5</p>
                    <div className="flex gap-1 text-[#F39800]">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                </div>
            </div> */}

            {/* <div className="rivews-main">
                <div className="single-rivews px-[10px] py-3 border-b-[#e7e7e7] border-b-[1px]">
                    <div className="flex items-center gap-3">
                        <Image className='w-8 h-8 rounded-full' src={User} alt="user image" />
                        <p className='text-[#212529]'>Name</p>
                        <div className="flex gap-1 text-[#F39800]">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                    </div>
                    <p className='pt-2 text-[#212529]'>
                        The effect is perfect, it can be recycled, and the cost performance is very high.
                    </p>
                    <Image className='w-[100px] py-3' src={ProductReviewImage} alt="reviews" />
                    <div className="flex justify-between text-[12px] text-[#908f8f]">
                        <p>Elegance: USB</p>
                        <p>2025-03-24</p>
                    </div>
                </div>
                <div className="single-rivews px-[10px] py-3 border-b-[#e7e7e7] border-b-[1px]">
                    <div className="flex items-center gap-3">
                        <Image className='w-8 h-8 rounded-full' src={User} alt="user image" />
                        <p className='text-[#212529]'>Name</p>
                        <div className="flex gap-1 text-[#F39800]">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                    </div>
                    <p className='pt-2 text-[#212529]'>
                        The effect is perfect, it can be recycled, and the cost performance is very high.
                    </p>
                    <Image className='w-[100px] py-3' src={ProductReviewImage} alt="reviews" />
                    <div className="flex justify-between text-[12px] text-[#908f8f]">
                        <p>Elegance: USB</p>
                        <p>2025-03-24</p>
                    </div>
                </div>
                <div className="single-rivews px-[10px] py-3 border-b-[#e7e7e7] border-b-[1px]">
                    <div className="flex items-center gap-3">
                        <Image className='w-8 h-8 rounded-full' src={User} alt="user image" />
                        <p className='text-[#212529]'>Name</p>
                        <div className="flex gap-1 text-[#F39800]">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                    </div>
                    <p className='pt-2 text-[#212529]'>
                        The effect is perfect, it can be recycled, and the cost performance is very high.
                    </p>
                    <div className="flex justify-between text-[12px] text-[#908f8f]">
                        <p>Elegance: USB</p>
                        <p>2025-03-24</p>
                    </div>
                </div>

                <div className="reviews-pagiantion py-6">
                    <div className='flex justify-center items-center gap-2'>
                        <button className={`cursor-pointer ${language === "ar" ? "rotate-[180deg]" : "rotate-none"}`}>
                            <FaAngleLeft />
                        </button>
                        <button className=' active bg-[#f39800] cursor-pointer text-white flex justify-center items-center  border-[#f39800] rounded-sm border-[1px] h-6 w-6 text-center'>
                            <p className='pt-[1px]'> 1</p>
                        </button >
                        <button className='border-[#ccc] cursor-pointer rounded-sm border-[1px] h-6 w-6 text-center'>
                            <p className='pt-[0px]'>  2</p>
                        </button>
                        <button className='border-[#ccc] cursor-pointer rounded-sm  border-[1px] h-6 w-6 text-center'>
                            <p className='pt-[0px]'>  3</p>
                        </button>
                        <button className={`cursor-pointer ${language === "ar" ? "rotate-[180deg]" : "rotate-none"}`}>
                            <FaAngleRight />
                        </button>
                    </div>
                </div>
            </div> */}

            <div className="product-ratings pt-4 bg-[#f5f5f5]" >
                <Image className='w-full object-fill'
                    src={language === 'ar' ?  BannerAfterreviews : BannerAfterreviewsArabic}
                    alt="banner"
                />
            </div>

        </div>
    )
}

export default ProductReviews;
