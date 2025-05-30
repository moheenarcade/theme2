"use client"
import React, { useEffect, useState } from 'react';
import { getProductBySlug } from "../../../../../../lib/api";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

const ProductDescription = ({ product_sku }) => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(product, "product description in product description componenrt");

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

    if (loading || !product) return null;

    const description = language === 'ar' ? product.description_ar : product.description;

    return (
        <div className='product-desc'>
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </div>
    )
}

export default ProductDescription
