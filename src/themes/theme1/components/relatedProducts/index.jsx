"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "../../../../hooks/useTranslation";
import { getProducts } from "../../../../lib/api";
import { useLanguage } from "../../../../context/LanguageContext";
import RandomReviews from "../../components/randomReviews";
import { FaClipboardList } from "react-icons/fa";
import Lottie from "lottie-react";
import noDataAnimation from "../../../../../public/images/Animation - 1744786688528.json";

const RelatedProducts = ({ currencyCode, product }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  // console.log(product, "products related list new products section");
  const [loading, setLoading] = useState(true);
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.image) return "/placeholder.webp";
    return imageObj.image.startsWith("http")
      ? imageObj.image
      : `${imageBaseUrl}${imageObj.image}`;
  };
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
    <div className="new-product-main container px-4 md:px-6 2xl:px-28 mx-auto pt-6 md:pt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-[600] text-[#000000de]">
          {t("related_products")}
        </h2>
      </div>
      {product && product.length > 0 ? (
        <div className="product-lists pt-6">
          {product.map((productList) => (
            <Link
              href={`/p/${productList.product_sku}`}
              key={productList.product_sku}
            >
              <div className="product-card-main group border-[1px] border-[#0000001f] rounded-md cursor-pointer p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <div className="">
                  <div className="product-banner-sec relative overflow-hidden">
                    <Image
                      className="w-full block"
                      src={getImageUrl(getMainImage(productList.images))}
                      alt="product banner"
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
                    {/* {(() => {
                      const hasPrices = productList.prices && productList.prices.length > 0;
                      const price = hasPrices ? productList.prices[0].price : null;
                      const salePrice = hasPrices ? productList.prices[0].sale_price : null;
                      const discount =
                        price && salePrice && price > salePrice
                          ? Math.round(((price - salePrice) / price) * 100)
                          : null;

                      return discount !== null ? (
                        <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                          {discount}% OFF
                        </div>
                      ) : null;
                    })()} */}

                    {(() => {
                      const hasPrices = productList.prices && productList.prices.length > 0;
                      const priceObj = hasPrices ? productList.prices[0] : {};
                      const price = parseFloat(priceObj.price);
                      const salePrice = parseFloat(priceObj.sale_price);

                      const hasPrice = !isNaN(price) && price > 0;
                      const hasSalePrice = !isNaN(salePrice) && salePrice > 0;

                      const showDiscount = hasPrice && hasSalePrice && price > salePrice;
                      const discount = showDiscount
                        ? Math.round(((price - salePrice) / price) * 100)
                        : null;

                      return showDiscount ? (
                        <div className="prpduct-off-price absolute uppercase font-[400] text-white bg-[#ff0000] px-2 py-1 text-sm bottom-0">
                          {discount}% OFF
                        </div>
                      ) : null;
                    })()}


                  </div>
                  <p className="text-[15px] font-[300] pt-1 line-clamp-2 h-[50px]">
                    {productList &&
                      (language === "ar"
                        ? productList.name_ar
                        : productList.name)}
                  </p>
                </div>
                <div className="">
                  <RandomReviews />
                  {/* <div className="product-price flex items-center gap-2 pt-2">
                    <div className="flex items-center gap-1">
                      {productList.prices?.[0]?.sale_price ? (
                        <b className="text-[17px]">
                          {productList.prices[0].sale_price}
                        </b>
                      ) : (
                        <b className="text-[12px] text-red-400">No Price</b>
                      )}
                      <p className="uppercase font-[300]">{currencyCode}</p>
                    </div>
                    <div className="product-offer-badge">
                      <span className="offer-effect px-2 py-1 text-[#f44336] ms-2 border-[1px] border-[#ff00004d]">
                        +2&nbsp;Free
                      </span>
                    </div>
                  </div>
                  <div className="">
                    {productList.prices?.[0]?.price ? (
                      <b className="text-[17px] line-through font-[300]">
                        {productList.prices[0].price} {currencyCode}
                      </b>
                    ) : (
                      <b className="text-[17px] line-through"></b>
                    )}
                  </div> */}

                  {(() => {
                    const hasPrices = productList.prices && productList.prices.length > 0;
                    const priceObj = hasPrices ? productList.prices[0] : {};
                    const price = parseFloat(priceObj.price);
                    const salePrice = parseFloat(priceObj.sale_price);

                    const hasSalePrice = !isNaN(salePrice) && salePrice > 0;
                    const hasPrice = !isNaN(price) && price > 0;

                    return (
                      <div className="h-[50px]">
                        <div className="product-price flex items-center gap-2 pt-2">
                          <div className="flex items-center gap-1">
                            {hasSalePrice ? (
                              <b className="text-[17px]">{salePrice}</b>
                            ) : hasPrice ? (
                              <b className="text-[17px]">{price}</b>
                            ) : (
                              <b className="text-[12px] text-red-400">No Price</b>
                            )}
                            <p className="uppercase font-[300]">{currencyCode}</p>
                          </div>

                        </div>

                        <div>
                          {hasSalePrice && hasPrice ? (
                            <b className="text-[17px] line-through font-[300]">
                              {price} {currencyCode}
                            </b>
                          ) : null}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center pt-10">
          <Lottie
            animationData={noDataAnimation}
            loop={true}
            className="w-[300px]"
          />
          <p className="text-center py-4 text-gray-500 text-sm -mt-18">
            {t("No_related_product_available")}
          </p>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
