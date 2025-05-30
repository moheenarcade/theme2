"use client";
import { useEffect, useState } from "react";
import HeroSection from "./components/heroSection";
import CartForm from "./components/cartForm";
import Image from 'next/image';
import CardImage from "../../../../../public/landingpage3Images/bottomcard-image.webp"
import { getProducts } from "../../../../lib/api";
import PlSlider from "./components/plSlider"

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currencyCode, setCurrencyCode] = useState("OMR");
  console.log(products, "product in pl3")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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


  return (
    <>
      <PlSlider products={products} />
      <div className='homepage-main'>
        <CartForm product_sku={products[0]?.product_sku} currencyCode={currencyCode} />
        <HeroSection product_sku={products[0]?.product_sku} />

        <div className="container mx-auto px-0 lg:px-100 py-12 felx justify-center items-center">
          <Image className='mx-auto' src={CardImage} alt='card images' />
        </div>
      </div>
    </>
  )
}

export default HomePage
