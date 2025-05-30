"use client"
import React, { useEffect, useState } from 'react';
import { getProductBySlug } from "../../../../../../lib/api";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

const ProductHeadings = ({ product_sku }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(product, " product detail in product headign compoenntn ")
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

        <div className='product-heading px-[10px] pb-4 pt-3 bg-white'>
            <h1 className='text-[26px] font-[700] py-[4px] leading-[30px]'>
                {language === 'ar' ? product?.name_ar : product?.name || "Product name not available"}
            </h1>
        </div>
    )
}

export default ProductHeadings;
