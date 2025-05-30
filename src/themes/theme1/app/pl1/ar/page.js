"use client";
import React, { useRef, useState, useEffect } from "react";
import HeroBanner from "../components/heroBanner";
import GetInNow from "../components/getItNow";
import LargeBanner from "../components/largeBanner";
import BuyFullGurenty from "../components/BuyFullGuranty";
import HowWeWork from "../components/howWeWork";
import { getProducts } from "../lib/api";
import Laoder from "../components/loader/loader";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="container mx-auto px-0 lg:px-20 xl:px-62">
        <HeroBanner products={products} />
        <GetInNow product_sku={products[0]?.product_sku} />
        <LargeBanner product_sku={products[0]?.product_sku} />
      </div>
      <BuyFullGurenty />
      <HowWeWork />
    </>
  );
}
