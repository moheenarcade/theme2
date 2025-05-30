"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OurNewProducts from "../components/homePageComponent/ourNewProduct";
import HeroSlider from "../components/homePageComponent/heroSlider";
import OurBestSellingProduct from "../components/homePageComponent/ourBestSellingProduct";
import ProductBytype from "../components/homePageComponent/productBytype";
import OurFeatures from "../components/homePageComponent/ourFeatures";
import { getProductBySlug, getProducts } from "../../../lib/api";
import Laoder from "../../theme1/components/loader/index";
import { trackBothEvents } from "../../../lib/pixelEvents";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(products, "all products in theme2");

  useEffect(() => {
    trackBothEvents("ViewContent", {
      content_name: "Home Page",
    });
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Laoder />
      </div>
    );
  }
  return (
    <>
      <HeroSlider />
      <OurNewProducts products={products} />
      <OurBestSellingProduct product_sku={products[0]?.product_sku} />
      <OurFeatures />
    </>
  );
};

export default Home;
