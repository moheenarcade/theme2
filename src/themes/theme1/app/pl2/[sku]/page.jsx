"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug, getProducts } from "../../pl1/lib/api";
import HeroSlider from '../components/heroSlider/index';
import ProductHeadings from "../components/productHeadings/index";
import PolicyService from "../components/policyService";
import ProductTabInfo from "../components/productTabInfo";
import AboutCompany from "../components/aboutCompany";
import BuyNowModal from "../components/buyNowFormpl2";
import Laoder from "../../pl1/components/loader/loader";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";

export default function ProductPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const params = useParams();
  const sku = params?.sku;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('Current SKU inproduct sku page:', product);
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
        console.log('API Response:', res); // Check API response
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
      <div className='max-w-[640px] mx-auto pt-12 overflow-hidden'>
        <HeroSlider products={product} />
        <ProductHeadings product_sku={product.product_sku} />
        <PolicyService product_sku={product.product_sku} />
        <ProductTabInfo product_sku={product.product_sku} />
        <BuyNowModal product_sku={product.product_sku} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <div className='bg-[#362e2b] max-w-[640px] mx-auto px-[10px] py-[6px] mx-h-[60px] w-full z-[999] fixed bottom-0 '>
          <div className="flex justify-between">
            <button onClick={() => setIsModalOpen(true)} className='bg-[#f39800] font-[500] hover:scale-[1.05] text-[#fff] text-[18px] md:text-[20px] h-[48px] w-[45%] rounded-lg cursor-pointer transition-all duration-[0.5s] ease-in-out'>
              {t('Buy_it_now')}
            </button>
            <div className="price flex items-center gap-1 md:gap-4">
              {product?.prices?.[0]?.sale_price > 1 &&
                product?.prices?.[0]?.sale_price < product?.prices?.[0]?.price ? (
                <>
                  <p className='text-[#f39800] font-[600] text-[20px] md:text-[1.75rem]'>
                    {product.prices[0].sale_price} {currencyCode}
                  </p>
                  <p className='line-through text-[#c2c2c2]'>
                    {product.prices[0].price} {currencyCode}
                  </p>
                </>
              ) : (
                <p className='text-[#f39800] font-[600] text-[20px] md:text-[1.75rem]'>
                  {product?.prices?.[0]?.price || 'N/A'} {currencyCode}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}