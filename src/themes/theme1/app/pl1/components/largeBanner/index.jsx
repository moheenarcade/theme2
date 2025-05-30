"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { getProductBySlug } from "../../lib/api";
import { useRouter } from 'next/navigation';
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

const LargeBanner = ({ product_sku }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { language, toggleLanguage } = useLanguage();
    const router = useRouter();

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

    const description = language === "ar" ? product.description_ar : product.description;

    return (
        <>
            {product.description && (
                <div
                    className="product-description py-6"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}
        </>
    );
};

export default LargeBanner;
