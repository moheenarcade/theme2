"use client";
import React, { useEffect, useState } from "react";
import CountdownTimer from "../countdownTimer";
import Faqs from "../faqs";
import { getProductBySlug } from "../../../../../../lib/api";
import BuyForm from "../buyForm";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";
import DigitalNumberClock from "../digitalNumberClock";
import MultiDigitClock from "../multiDigitClock"

const GetInNow = ({ product_sku }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("product_sku here", product);
  const [currencyCode, setCurrencyCode] = useState("OMR");
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();

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
    <div className="get-it-now-main rounded-xl p-3 lg:p-6 my-0 lg:my-12">
      <div className="clock-timer overflow-hidden relative z-[9999] py-4 md:py-6 px-4 lg:px-12 rounded-xl flex flex-col md:flex-row gap-2 lg:gap-6 justify-center items-center">

        <p className="text-[white] text-xl md:text-lg text-center md:text-start lg:text-[20px] 2xl:text-3xl font-[500]">
          {t("Get_it_now_before_it")}{" "}
        </p>
        <div className="clock-sec w-full md:w-[400px] xl:w-[320px] 2xl:w-[400px] relative ">
          {/* <CountdownTimer
            initialHours={0}
            initialMinutes={5}
            initialSeconds={0}
          /> */}
          {/* <DigitalNumberClock targetTime={new Date(Date.now() + 1000 * 60 * 60 * 24)} /> */}
          <MultiDigitClock />
        </div>
      </div>

      {product &&
        product.prices &&
        product.prices.length > 0 &&
        (() => {
          const originalPrice = parseFloat(product.prices[0].price);
          const salePrice = parseFloat(product.prices[0].sale_price);
          const discountPercent =
            originalPrice > 0
              ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
              : 0;
          return (
            <>
              <div className="discount-price relative border-y-[1px] border-y-[#d6dce9] mt-6 flex items-center justify-center md:justify-between">
                <div className="flex flex-row justify-start items-start ml-0 w-full py-4 lg:py-6 gap-2 md:gap-6">
                  {salePrice > 0 && originalPrice > 0 ? (
                    <>
                      <p className="text-xl lg:text-3xl font-[700] text-[#57637a]">
                        {salePrice.toFixed(2)} {currencyCode}
                      </p>
                      <p className="text-xl lg:text-3xl line-through font-[500] text-[#939cab]">
                        {originalPrice.toFixed(2)} {currencyCode}
                      </p>
                    </>
                  ) : originalPrice > 0 ? (
                    <p className="text-xl lg:text-3xl font-[700] text-[#57637a]">
                      {originalPrice.toFixed(2)} {currencyCode}
                    </p>
                  ) : null}
                </div>
                <div className="dicousnt-mobile-badge text-white bg-red-600 py-1 px-3 rounded-lg font-[600] block md:hidden">
                  -{discountPercent}%
                </div>
                <div className={`hidden md:block badges absolute top-[-140px] lg:-top-36  mx-auto ${language === 'ar' ? "right-auto left-6" : "right-6"}`}>
                  <p className="pt-12">
                    <span className="firstLine">{t('GET_UP_TO')}</span>
                    <br />
                    <span className="secondLine">{discountPercent}%</span>
                    <br />
                    <span className="thirdLine">{t('Discount')}</span>
                    <br />
                  </p>
                </div>
              </div>
              <div className="dicount-desc text-start font-[700] w-full md:w-[50%] pt-4">
                <p className="text-[15px] md:text-[16px]">
                  {t("Now_and_for_a_limited_time")} {discountPercent}%{" "}
                  {t("discount_and_free_delivery")}
                </p>
                <p className="text-[13px] md:text-[16px] text-[#ce0606]">
                  {t("Tax_included_this_offer_is_limited")}
                </p>
              </div>
            </>
          );
        })()}

      <div
        className={`text-start lg:text-center ${product?.discount_prices?.length > 0 ? 'pt-6 lg:pt-12' : ''
          }`}
      >
        {product?.discount_prices?.length > 0 && (
          <p className="text-[20px] lg:text-3xl font-[800] lg:font-[700] cairo-family">
            {t("To_order_please_fill_in_the_boxes_below")}
          </p>
        )}
        <div className="price-selection mt-2 lg:mt-4">
          {product?.discount_prices?.length > 0 && product.discount_prices.some(dp => dp.price > 0) && (
            <>
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
                    className={`group single-price mb-2 lg:mb-3 cursor-pointer relative flex flex-row justify-between items-center border-[2px] rounded-xl py-5 lg:py-4 px-5 lg:px-8 transition-all duration-[0.3s] ease-in-out
            ${selectedIndex === index
                        ? "border-[#a8620a] bg-gray-100 scale-[1.01]"
                        : "border-[#acb9d2] hover:bg-gray-100 hover:scale-[1.01] hover:border-black"
                      }
        `}
                  >
                    {index === 1 && product.discount_prices.length > 1 && (
                      <div className="rPyoc text-[12px]" bis_skin_checked="1">
                        <font>
                          <font>{t('Most_requested')}</font>
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
              ${selectedIndex === index
                            ? "border-[#a8620a] bg-[#a8620a]"
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
                          className={`text-md text-start md:text-xl font-[600] transition-all
                ${selectedIndex === index
                              ? "text-[#191e2a]"
                              : "text-[#191e2a] group-hover:text-[#191e2a]"
                            }
          `}
                        >
                          {t('Buy')} {quantity} - {t('Save')} {discountPercent}%
                        </p>
                      </div>
                    </div>
                    <div className="block">
                      <div
                        className={`text-sm md:text-xl gap-1 font-[600] lg:gap-0 flex flex-col justify-start md:justify-end italic transition-all
          ${selectedIndex === index
                            ? "text-[#57637a] "
                            : "text-[#57637a] group-hover:text-[#57637a]"
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
            </>
          )}
        </div>
      </div>

      {product && (
        <div className="pt-6 lg:pt-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="border-b-[1px] border-b-[#d6dce9] w-full"></div>
            <p className="text-center font-[600] text-[20px] md:text-2xl text-[#191e2a] cairo-family whitespace-nowrap">
              {t("Choose_the_appropriate_offer")}
            </p>
            <div className="border-b-[1px] border-b-[#d6dce9] w-full"></div>
          </div>
          <BuyForm
            product={product}
            selectedQuantity={
              product.discount_prices?.length > 0 &&
                product.discount_prices[selectedIndex]?.price > 0
                ? product.discount_prices[selectedIndex].quantity
                : 1
            }
            selectedTotalPrice={
              product.discount_prices?.length > 0 &&
                product.discount_prices[selectedIndex]?.price > 0
                ? parseFloat(product.discount_prices[selectedIndex].price)
                : parseFloat(
                  product.prices?.[0]?.sale_price > 0
                    ? product.prices[0].sale_price
                    : product.prices[0].price
                )
            }
          />
        </div>
      )}

      <Faqs />
    </div>
  );
};

export default GetInNow;
