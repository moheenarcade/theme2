"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug, getProducts } from "../../../../../lib/api";
import Laoder from "../../pl1/components/loader/loader";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";
import Header from "../components/header";
import HeroSection from "../components/heroSection";
import CartForm from "../components/cartForm";
import CardImage from "../../../../../../public/landingpage3Images/bottomcard-image.webp"
import Image from "next/image";
import PlSlider from "../components/plSlider";

const ProductPage = () => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const params = useParams();
    const sku = params?.sku;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log('Current SKU inproduct sku page pl3:', product);
    const [currencyCode, setCurrencyCode] = useState("OMR");
    useEffect(() => {
        const storeSettingRaw = localStorage.getItem("storeSettings");
        if (storeSettingRaw) {
            try {
                const storeSetting = JSON.parse(storeSettingRaw);
                if (storeSetting?.currency_code) {
                    setCurrencyCode(storeSetting.currency_code);
                }
            } catch (err) {
                console.error("Failed to parse storeSetting from localStorage", err);
            }
        }
    }, []);
    useEffect(() => {
        if (!sku) return;

        const fetchProduct = async () => {
            try {
                const res = await getProductBySlug(sku);
                console.log('API Response:', res);
                setProduct(res.data);
            } catch (error) {
                console.error("Failed to fetch product by SKU", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [sku]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Laoder />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center text-red-500 py-10">
                Product not found for SKU: {sku}
            </div>
        );
    }


    return (
        <>
            <PlSlider products={product} />
            <div className='homepage-main'>
            <CartForm product_sku={product.product_sku} currencyCode={currencyCode} />
                <HeroSection product_sku={product.product_sku} />
                <div className="container mx-auto px-0 lg:px-100 py-12 felx justify-center items-center">
                    <Image className='mx-auto' src={CardImage} alt='card images' />
                </div>
            </div>
        </>
    )
}

export default ProductPage
