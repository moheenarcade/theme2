"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeroBanner from "../../pl1/components/heroBanner";
import GetInNow from "../../pl1/components/getItNow";
import LargeBanner from "../../pl1/components/largeBanner";
import BuyFullGurenty from "../../pl1/components/BuyFullGuranty";
import HowWeWork from "../../pl1/components/howWeWork";
import Laoder from "../../pl1/components/loader/loader";
import { getProductBySlug } from "../../pl1/lib/api";

export default function ProductPage() {
  const params = useParams();
  const sku = params?.sku; // Access the dynamic parameter as 'sku'
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('Current SKU:', sku); // This should log your product SKU

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
      <div className="container mx-auto px-0 lg:px-20 xl:px-62">
        <HeroBanner products={[product]} />
        <GetInNow product_sku={product.product_sku} />
        <LargeBanner product_sku={product.product_sku} />
      </div>
      <BuyFullGurenty />
      <HowWeWork />
    </>
  );
}