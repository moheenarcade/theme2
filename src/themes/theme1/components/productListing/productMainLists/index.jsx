"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";
import RandomReviews from "../../randomReviews";

const ProductMainLists = ({ currencyCode, products }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.image) return "/placeholder.webp";
    return imageObj.image.startsWith("http")
      ? imageObj.image
      : `${imageBaseUrl}${imageObj.image}`;
  };

  const getMainImage = (images = []) => {
    if (!Array.isArray(images)) return null;

    if (language === 'ar') {
      const arabicMain = images.find(img => img?.isArabicMain === 1);
      if (arabicMain) return arabicMain;
    }

    const main = images.find(img => img?.isMain === 1);
    return main || images[0] || null;
  };

  const getHoverImage = (images = []) => {
    if (!Array.isArray(images)) return null;
    const hoverImg = images.find(img => img?.isMain === 0 && img?.isArabicMain !== 1);
    return hoverImg || null;
  };


  return (
    <>
      <div className="filter-poducts w-full lg:w-[75%] relative">
        <div className="hidden lg:block">
          <div className="flex justify-between">
            <div className="flex items-center">
              <p
                className={`text-xl font-[600]  ${language === "ar"
                  ? " pl-4 border-l-[0px] border-l-gray-300"
                  : "pr-4 border-r-[0px] border-r-gray-300"
                  } `}
              >
                {t("Products")}
              </p>
              {/* <p className={` font-[300] ${language === "ar" ? "pr-3" : "pl-3"} `}>{products.length}</p> */}
            </div>
          </div>
        </div>

        <div className="product-lists pt-6">


          {products && products.length > 0 ? (
            products.map((productList) => {
              const hasPrices = productList.prices && productList.prices.length > 0;
              const price = hasPrices ? productList.prices[0].price : null;
              const salePrice = hasPrices ? productList.prices[0].sale_price : null;
              const discount =
                price && salePrice && price > salePrice
                  ? Math.round(((price - salePrice) / price) * 100)
                  : null;

              return (
                <Link
                  href={`/p/${productList.product_sku}`}
                  key={productList.product_sku}
                >
                  <div className="product-card-main group border-[1px] border-[#0000001f] rounded-md cursor-pointer p-2 md:p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                    <div>
                      <div className="product-banner-sec relative overflow-hidden">
                        <Image
                          className="w-full block"
                          src={getImageUrl(getMainImage(productList.images))}
                          alt={productList.name || "product banner image"}
                          width={300}
                          height={300}
                          priority
                        />
                        {getHoverImage(productList.images) && (
                          <Image
                            className="w-full h-full absolute top-0 left-0 right-0 bottom-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
                            src={getImageUrl(getHoverImage(productList.images))}
                            alt={productList.name || "product hover banner"}
                            width={300}
                            height={300}
                            priority
                          />
                        )}
                        {/* {discount !== null && (
                          <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                            {discount}% OFF
                          </div>
                        )} */}


                        {hasPrices &&
                          price &&
                          salePrice &&
                          parseFloat(price) > 0 &&
                          parseFloat(salePrice) > 0 &&
                          parseFloat(salePrice) < parseFloat(price) && (
                            <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                              {Math.round(((parseFloat(price) - parseFloat(salePrice)) / parseFloat(price)) * 100)}% OFF
                            </div>
                          )}
                      </div>
                      <p className="text-[15px] font-[300] pt-1 line-clamp-2 h-[50px]">
                        {language === "ar" ? productList.name_ar : productList.name}
                      </p>
                    </div>

                    <div>
                      <RandomReviews />
                      <div className="h-[50px]">
                        <div className="product-price flex items-center gap-2 pt-2 ">
                          {hasPrices ? (() => {
                            const showSalePrice = salePrice && salePrice !== "0.00";
                            const showPrice = price && price !== "0.00";

                            if (showSalePrice && showPrice) {
                              return (
                                <div className="flex items-center gap-1">
                                  <b className='text-[17px]'>{salePrice}</b>
                                  <p className='uppercase font-[300]'>{currencyCode}</p>
                                </div>
                              );
                            } else if (showPrice) {
                              return (
                                <div className="flex items-center gap-1">
                                  <b className='text-[17px]'>{price}</b>
                                  <p className='uppercase font-[300]'>{currencyCode}</p>
                                </div>
                              );
                            } else if (showSalePrice) {
                              return (
                                <div className="flex items-center gap-1">
                                  <b className='text-[17px]'>{salePrice}</b>
                                  <p className='uppercase font-[300]'>{currencyCode}</p>
                                </div>
                              );
                            } else {
                              return <div className="text-[13px] text-red-500">No Price Added</div>;
                            }
                          })() : (
                            <div className="text-[13px] text-red-500">No Price Added</div>
                          )}

                        </div>
                        {hasPrices && price && salePrice && salePrice !== "0.00" && price !== salePrice ? (
                          <b className='text-[17px] line-through font-[300]'>{price} {currencyCode}</b>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-start text-gray-500 py-10">No Data Found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductMainLists;
