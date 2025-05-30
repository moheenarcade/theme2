"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../../../hooks/useTranslation';
import { getProducts, getCategories } from "../../../lib/api";
import { useLanguage } from '../../../context/LanguageContext';
import RandomReviews from "../../randomReviews";

const ProductMainListsByCat = ({ products, currencyCode }) => {
    const { t } = useTranslation();
    console.log(products, "prodfuvt in product cat page ")
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const getImageUrl = (imageObj) => {
        if (!imageObj || !imageObj.image) return "/placeholder.webp";
        return imageObj.image.startsWith("http")
            ? imageObj.image
            : `${imageBaseUrl}${imageObj.image}`;
    };

    return (
        <>
            <div className="filter-poducts w-full lg:w-[75%] relative">
                <div className="hidden lg:block">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <p className='text-xl font-[600] pr-4 border-r-[1px] border-r-gray-300'>Products</p>
                            <p className='pl-3 font-[300]'>{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className="products-lits">
                    <div className="product-lists pt-6">
                        {products.map((productList, index) => (
                            <Link href={`/product-detail/${productList.product_sku}`} key={productList.product_sku}>
                                <div className="product-card-main group border-[1px] border-[#0000001f] rounded-md cursor-pointer p-2 md:p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                                    <div className="">
                                        <div className="product-banner-sec relative overflow-hidden">
                                            <Image
                                                className='w-full block'
                                                src={getImageUrl(productList.images?.[0])}
                                                alt={productList.name || "product banner image"}

                                                width={300}
                                                height={300}

                                            />
                                            <Image
                                                className="w-full h-full absolute top-0 left-0 right-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
                                                src={getImageUrl(productList.images?.[1] || productList.images?.[0])}
                                                alt={productList.name || "product banner image"}

                                                width={300}
                                                height={300}
                                         

                                            />

                                            <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                                                30% OFF
                                            </div>
                                        </div>
                                        <p className='text-[15px] font-[300] pt-1 line-clamp-2 h-[50px]'>
                                            {productList && (language === 'ar' ? productList.name_ar : productList.name)}
                                        </p>
                                    </div>
                                    <div className="">
                                        <RandomReviews />
                                        <div className="product-price flex items-center gap-2 pt-2">
                                            <div className="flex items-center gap-1">
                                                {productList.prices?.[0]?.sale_price ? (
                                                    <b className='text-[17px]'>{productList.prices[0].sale_price}</b>
                                                ) : (
                                                    <b className='text-[12px] text-red-400'>No Price</b>
                                                )}
                                                <p className='uppercase font-[300]'>{currencyCode}</p>
                                            </div>
                                            <div className="product-offer-badge">
                                                <span className="offer-effect px-2 py-1 text-[#f44336] ms-2 border-[1px] border-[#ff00004d]">+2&nbsp;Free</span>
                                            </div>
                                        </div>
                                        <div className="">
                                            {productList.prices?.[0]?.price ? (
                                                <b className='text-[17px] line-through font-[300]'>{productList.prices[0].price} {currencyCode}</b>
                                            ) : (
                                                <b className='text-[17px] line-through'></b>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductMainListsByCat;
