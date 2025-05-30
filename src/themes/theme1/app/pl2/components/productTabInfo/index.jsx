'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Banner7 from "../../../../../../../public/landingpage2Images/baner7.webp"
import ProductDescription from "../productDescription"
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";
import ProductReviews from "../productReviews";


const ProductTabs = ({ product_sku }) => {

    return (
        <div>
            <div className='bg-white mt-4 mb-4'>
                <div className="product-description" id='productDescription'>
                    <ProductDescription product_sku={product_sku} />
                </div>
                {/* <div className="product-reviews" id='productInforamtion'>
                    <Image src={Banner7} alt="banner" />
                </div> */}
                <ProductReviews product_sku={ product_sku }/>
            </div>


        </div>
    );
};

export default ProductTabs;
