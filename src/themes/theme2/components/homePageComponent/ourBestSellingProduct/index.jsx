"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import OrderForm from "../orderForm";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";
import Laoder from "../../../../theme1/components/loader/index";
import { getProductBySlug, getProducts } from "../../../../../lib/api";
import ProductDetails from "../productDetails";

const OurBestSellingProduct = ({ product_sku }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("product_sku here", product);
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const [currencyCode, setCurrencyCode] = useState("");
  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.image) return "/placeholder.webp";
    return imageObj.image.startsWith("http")
      ? imageObj.image
      : `${imageBaseUrl}${imageObj.image}`;
  };

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
    async function fetchProduct() {
      try {
        const data = await getProductBySlug(product_sku);
        if (!data) {
          // router.push("/not-found");
          return;
        }
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        // router.push("/not-found");
      } finally {
        setLoading(false);
      }
    }
    if (product_sku) {
      fetchProduct();
    }
  }, [product_sku]);

  let selectedQuantity = 1;
  let selectedPrice = null;

  if (
    product?.discount_prices?.length > 0 &&
    product.discount_prices.some((dp) => dp.price > 0)
  ) {
    const selectedDiscount = product.discount_prices[selectedIndex];
    if (selectedDiscount) {
      selectedQuantity = selectedDiscount.quantity;
      selectedPrice = selectedDiscount.price;
    }
  }

  return (
    <div className="max-w-[1125px] mx-auto px-4 xl:px-0 py-[30px]">
      <h2
        className={`text-[#000000] text-[22px] md:text-[24px] text-center mb-12 ${
          language === "ar" ? "font-[600]" : "font-[500]"
        }`}
      >
        {t("Our_best_selling_products")}
      </h2>
      <h3 className="text-[#000000] text-[25px] font-[500] block lg:hidden">
        {product?.name || "no name"}
      </h3>
      <div className="flex md:gap-6 flex-col lg:flex-row relative">
        <div
          className="product-slideImage w-full lg:w-[50%] lg:sticky lg:top-28 self-start h-fit"
          dir={isRTL === "ar" ? "rtl" : "ltr"}
        >
          <Swiper
            spaceBetween={10}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Thumbs]}
            className={`mySwiper2 ${isRTL === "ar" ? "swiper-rtl" : ""}`}
          >
            {product?.images?.map((imgObj, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-full mx-auto"
                  src={getImageUrl(imgObj)}
                  alt={`Thumbnail ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbs Swiper */}
          <Swiper
            style={{
              "--swiper-navigation-color": "white",
              "--swiper-pagination-color": "white",
            }}
            onSwiper={setThumbsSwiper}
            spaceBetween={14}
            navigation={true}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className={`mySwiper3 mt-4 ${isRTL === "ar" ? "swiper-rtl" : ""}`}
          >
            {product?.images?.map((imgObj, index) => (
              <SwiperSlide key={index}>
                <img
                  className="w-[120px] h-full mx-auto"
                  src={getImageUrl(imgObj)}
                  alt={`Thumb ${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="product-buy-form w-full lg:w-[50%]">
          <h3 className="text-[#000000] text-[25px] font-[500] hidden lg:block">
            {product?.name || "no name"}
          </h3>

          {/* Check if discount prices are valid */}
          {product?.discount_prices?.length > 0 &&
          product.discount_prices.some((dp) => dp.price > 0) ? (
            // Show discount price section
            <div className="price-selection mt-2 lg:mt-4">
              {product.discount_prices.map((option, index) => {
                const quantity = option.quantity;
                const totalPrice = parseFloat(option.price);
                const originalUnitPrice = parseFloat(product.prices[0].price);
                const originalTotal = originalUnitPrice * quantity;
                const discountPercent = Math.round(
                  ((originalTotal - totalPrice) / originalTotal) * 100
                );
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`group single-price mb-2 lg:mb-3 cursor-pointer relative flex flex-row justify-between items-center border-[2px] rounded-xl py-2 lg:py-2 px-4 lg:px-4 transition-all duration-[0.3s] ease-in-out
            ${
              selectedIndex === index
                ? "border-[#592404] bg-gray-100 scale-[1.01]"
                : "border-[#acb9d2] hover:bg-gray-100 hover:scale-[1.01] hover:border-black"
            }
        `}
                  >
                    {index === 1 && product.discount_prices.length > 1 && (
                      <div
                        className="rPyoc tag-theme2 text-[10px] bg-[#592404]"
                        bis_skin_checked="1"
                      >
                        <font>
                          <font>{t("Most_requested")}</font>
                        </font>
                        <p>
                          <span className="qC_pa"></span>
                          <span className="oy8sJ"></span>
                        </p>
                      </div>
                    )}
                    <div className="flex items-start w-full lg:items-center gap-4">
                      <div
                        className={`checkbox h-6 w-6 rounded-full border-[2px] flex items-center justify-center
                ${
                  selectedIndex === index
                    ? "border-[#592404] bg-[#592404]"
                    : "border-[#acb9d2] group-hover:border-[#191e2a]"
                }
            `}
                      >
                        {selectedIndex === index && (
                          <div className="h-3 w-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="">
                        <p
                          className={`text-md text-start md:text-xl font-[500] transition-all
                  ${
                    selectedIndex === index
                      ? "text-[#592404]"
                      : "text-[#191e2a] group-hover:text-[#191e2a]"
                  }
            `}
                        >
                          {t("Buy")} {quantity} - {t("Save")} {discountPercent}%
                        </p>
                      </div>
                    </div>
                    <div className="block">
                      <div
                        className={`text-sm md:text-xl gap-1 font-[500] lg:gap-0 flex flex-col justify-start md:justify-end italic transition-all
              ${
                selectedIndex === index
                  ? "text-[#592404]"
                  : "text-[#191e2a] group-hover:text-[#191e2a]"
              }
        `}
                      >
                        <p className="whitespace-nowrap">
                          {totalPrice.toFixed(2)} {currencyCode}
                        </p>
                        <p className="line-through whitespace-nowrap italic font-[400]">
                          {originalTotal.toFixed(2)} {currencyCode}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-between md:justify-start gap-4 items-center pt-2">
              {product?.prices?.length > 0 &&
                (() => {
                  const { price, sale_price } = product.prices[0] || {};
                  const numericPrice = parseFloat(price);
                  const numericSalePrice = parseFloat(sale_price);

                  if (
                    numericPrice > 0 &&
                    numericSalePrice > 0 &&
                    numericSalePrice < numericPrice
                  ) {
                    return (
                      <>
                        <p className="text-[#592404FF] font-[500] text-[24px]">
                          {numericSalePrice.toLocaleString()} {currencyCode}
                        </p>
                        <p className="text-[#747474] line-through text-[20px] font-[300]">
                          {numericPrice.toLocaleString()} {currencyCode}
                        </p>
                      </>
                    );
                  } else if (numericPrice > 0) {
                    return (
                      <p className="text-[#592404FF] font-[500] text-[24px]">
                        {numericPrice.toLocaleString()} {currencyCode}
                      </p>
                    );
                  }
                })()}
            </div>
          )}

          <p className="text-center text-[16px] font-[500] mt-3">
            {t("Hurry_Only_5_pieces_left_in_stock")}
          </p>
          <div className="product-form mt-6">
            <OrderForm
              product={product}
              selectedPrice={selectedPrice}
              selectedQuantity={selectedQuantity}
            />
            <div className=" mt-6">
              <hr className="mb-6" />
              <p className="text-[#592404] font-[500] text-center text-[18px]">
                {t("Joint_treatment_gel_or_ointment")}
              </p>
              <p className="text-[#000] text-[14px] text-center pt-3">
                {t("Get_instant_relief_from_joint_pain_with_Joint")}
              </p>
              {showDetails && (
                <div className="product-detail pt-2">
                  <ProductDetails product={product} />
                </div>
              )}

              <p
                onClick={() => setShowDetails(!showDetails)}
                className="text-end mt-2 text-[#592404FF] text-[13px] cursor-pointer transition hover:underline"
              >
                {showDetails ? t("read_less") : t("read_more")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBestSellingProduct;
