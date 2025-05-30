"use client";
import { useEffect, useState } from "react";
import RandomReviews from "../../../components/randomReviews";
import { getProductBySlug, getSettings } from "../../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';
import OurGranteeShippingFaq from "../../../components/ourGranteeShippingFaq";
import Loader from "../../../components/loader";
import dynamic from "next/dynamic";
import ProductDescription from '../../../components/productDescription';
import BuyForm from "../../../components/buyForm"
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";
import { TiArrowSortedDown } from "react-icons/ti";
import { PiHandsClappingFill } from "react-icons/pi";
import ProductReviews from "../../../components/productReviews";
import { trackBothEvents } from "../../../../../lib/pixelEvents";
import BundleSave from "../../../components/bundleSave"

const ProductDetailImageSlider = dynamic(
  () => import("../../../components/productDetailImageSlider"),
  { ssr: false }
);
const RelatedProducts = dynamic(
  () => import("../../../components/relatedProducts"),
  { ssr: false }
);

export default function ProductDetailPage({ slug }) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  // const { slug } = useParams();
  const fallbackSlug = useParams()?.slug;
  const finalSlug = slug || fallbackSlug;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [getSetting, setGetSetting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState(null);
  // console.log(selectedBundle, "selectedBundle in parent")
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [currencyCode, setCurrencyCode] = useState('');
  // console.log(selectedSize, "selectedSize page data");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.image) return "/placeholder.webp";
    return imageObj.image.startsWith("http")
      ? imageObj.image
      : `${imageBaseUrl}${imageObj.image}`;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBuyButtonClick = () => {
    if (!isOutOfStock && product) {
      const price = shouldShowDiscountPrices()
        ? selectedBundle?.price
        : product.prices?.[0]?.offer_price && isOfferActive(product.prices[0].offer_start_date, product.prices[0].offer_end_date)
          ? product.prices[0].offer_price
          : product.prices?.[0]?.sale_price || product.prices?.[0]?.price;

      const quantity = shouldShowDiscountPrices()
        ? selectedBundle?.quantity
        : 1;

      trackBothEvents("InitiateCheckout", {
        content_name: product.name,
        content_ids: [product.product_id],
        content_type: "product",
        currency: currencyCode,
        value: price,
        quantity: quantity,
      });
      openModal();
    }
  };

  useEffect(() => {
    if (product) {
      trackBothEvents("ViewContent", {
        content_name: product.name,
        content_ids: [product.product_id],
        content_type: "product",
        currency: currencyCode,
        value: product.prices?.[0]?.sale_price,
      });
    }
  }, [product, currencyCode]);

  useEffect(() => {
    if (product?.options?.length > 0) {
      const firstAvailableSize = product.options.find(
        (opt) => opt.option_name === "Size" && opt.available_quantity > 0
      );

      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.option_label_id);
      }
    }
  }, [product]);


  const selectedSizeObj = product?.options?.find(
    opt => opt.option_label_id === selectedSize
  );

  useEffect(() => {
    const settings = localStorage.getItem('storeSettings');
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        setCurrencyCode(parsedSettings.currency_code || 'OMR');
      } catch (error) {
        console.error("Failed to parse storeSettings:", error);
      }
    } else {
      console.warn("storeSettings not found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSettings();
        const firstSetting = data.data || {};
        setGetSetting(firstSetting);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductBySlug(slug);
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

    if (slug) {
      fetchProduct();
    }
  }, [slug, router]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <Loader />;
  }
  const totalAvailableQty = product.options.reduce((sum, opt) => sum + opt.available_quantity, 0);
  const isOutOfStock = totalAvailableQty === 0;


  const isOfferActive = (offerStart, offerEnd) => {
    if (!offerStart || !offerEnd) return false;

    const currentDate = new Date();
    const startDate = new Date(offerStart);
    const endDate = new Date(offerEnd);

    return currentDate >= startDate && currentDate <= endDate;
  };

  const shouldShowDiscountPrices = () => {
    return product?.discount_prices?.length > 0;
  };

  const now = new Date();
  const priceData = product.prices?.[0];

  const isOfferValid =
    priceData?.offer_price &&
    new Date(priceData.offer_start_date) <= now &&
    new Date(priceData.offer_end_date) >= now;

  const displayPrice = selectedBundle?.price || (isOfferValid ? priceData.offer_price : priceData?.sale_price);



  const getDisplayPrice = () => {
    // First check for bundle price
    if (selectedBundle?.price) {
      return selectedBundle.price;
    }

    const priceData = product.prices?.[0];

    // Then check for valid offer price
    const isOfferValid = priceData?.offer_price &&
      priceData.offer_price !== "0.00" &&
      isOfferActive(priceData.offer_start_date, priceData.offer_end_date);

    if (isOfferValid) {
      return priceData.offer_price;
    }

    // Then check for valid sale price (not 0.00)
    if (priceData?.sale_price && priceData.sale_price !== "0.00") {
      return priceData.sale_price;
    }

    // Finally fall back to regular price
    if (priceData?.price && priceData.price !== "0.00") {
      return priceData.price;
    }

    // If no valid price is found
    return "0.00";
  };

  return (
    <>
      <div className="container px-4 md:px-6 2xl:px-28 mx-auto pt-6 md:pt-12 pb-12">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-[50%]">
            <ProductDetailImageSlider product={product} />
          </div>
          <div className="produt-detail-sec w-full md:w-[45%]">
            <div className="product-top-tag flex justify-center md:justify-end pb-3">
              {product.options
                .filter(opt => opt.option_name === "Size")
                .reduce((total, opt) => total + opt.available_quantity, 0) < 5 && (
                  <p className="text-[13px] xl:text-lg uppercase font-[600] border-black border-2 py-1 px-3 w-fit">
                    {t('Hot_product_few_left_in_stock')}
                  </p>
                )}
            </div>
            <RandomReviews />
            <h1 className="text-2xl md:text-3xl font-[600] pt-3">
              {language === "ar" ? product.name_ar : product.name}
            </h1>
            {product.product_colors?.length > 1 && (
              <ul className="pt-2 md:pt-4">
                <li className="flex flex-col mb-3">
                  <p className="text-[16px]">
                    <b>{t('Color')}:</b>
                  </p>
                  <div className="color-sec flex gap-3 flex-wrap">
                    {product.product_colors?.map((colorOption) => {
                      const colorImageObj = { image: colorOption.image };
                      const isActive = product.product_sku === colorOption.sku;

                      return (
                        <Link
                          href={`/p/${colorOption.sku}`}
                          key={colorOption.sku}
                        >
                          <div
                            key={colorOption.sku}
                            className={`single-color flex flex-col overflow-hidden cursor-pointer border-[2px] rounded-lg w-fit justify-center ${isActive ? "border-black" : "border-gray-300"
                              }`}
                          >
                            <Image
                              className="rounded-b-lg h-[80px] w-[80px] object-cover"
                              src={getImageUrl(colorImageObj)}
                              alt={colorOption.sku}
                              width={100}
                              height={100}
                              priority
                            />
                            <p className={`text-center ${isActive ? "font-bold" : ""}`}>
                              {colorOption.color}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </li>
              </ul>
            )}
            {product.options.some(opt => opt.option_name === "Size" && opt.available_quantity > 0) && (
              <>
                {product.options.some(opt => opt.option_name === "Size") && (
                  <>
                    <div className="size-options mb-3">
                      <p className="text-[16px] pb-2">
                        <b>{t('Size')}:</b>
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {product.options
                          .filter(opt => opt.option_name === "Size" && opt.available_quantity > 0)
                          .map((size) => {
                            const isSelected = selectedSize === size.option_label_id;

                            const handleTouchOrClick = () => {
                              setSelectedSize(size.option_label_id);
                            };

                            return (
                              <div
                                key={size.option_label_id}
                                onClick={handleTouchOrClick}
                                onTouchStart={handleTouchOrClick}
                                className={`relative group single-size font-[600] py-1 flex justify-center px-4 rounded-full w-[60px] transition-all duration-[0.3s] ease-in-out
                  ${isSelected ? "bg-black text-white border-black border-[2px]" : "bg-white border-dotted border-[2px]"}
                  cursor-pointer
                `}
                              >
                                {size.option_label}

                                <div
                                  className="absolute w-[165px] z-[99999] text-center p-2 rounded-md -top-10 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                >
                                  {`${t('Available_Quantity')}: ${size.available_quantity}`}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}

              </>
            )}


            {shouldShowDiscountPrices() ? (
              <BundleSave
                product={product}
                getSetting={getSetting}
                currencyCode={currencyCode}
                t={t}
                onSelectionChange={(selected) => setSelectedBundle(selected)}
              />
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                {product.prices?.[0] ? (() => {
                  const {
                    price,
                    sale_price,
                    offer_price,
                    offer_start_date,
                    offer_end_date,
                  } = product.prices[0];

                  const isOfferValid =
                    offer_price &&
                    offer_price !== "0.00" &&
                    isOfferActive(offer_start_date, offer_end_date);

                  const showSale = sale_price && sale_price !== "0.00";
                  const showPrice = price && price !== "0.00";

                  if (isOfferValid) {
                    return (
                      <>
                        <p className="font-[600] text-2xl">
                          {offer_price} {currencyCode}
                        </p>
                        {showSale && (
                          <p className="font-[300] line-through text-xl">
                            {sale_price} {currencyCode}
                          </p>
                        )}
                        {showSale && (
                          <div className="percent-off-tag py-1 px-3 text-black font-[600] bg-yellow-500 rounded-md">
                            <p className="flex items-center gap-2">
                              <PiHandsClappingFill className="text-xl mt-[2px]" />
                              {t("Save")}
                              <span>
                                {Math.round(
                                  ((parseFloat(sale_price) - parseFloat(offer_price)) /
                                    parseFloat(sale_price)) * 100
                                )}
                                %
                              </span>
                            </p>
                          </div>
                        )}
                      </>
                    );
                  } else if (showSale) {
                    return (
                      <>
                        <p className="font-[600] text-2xl">
                          {sale_price} {currencyCode}
                        </p>
                        {showPrice && (
                          <p className="font-[300] line-through text-xl">
                            {price} {currencyCode}
                          </p>
                        )}
                        {showPrice && (
                          <div className="percent-off-tag py-1 px-3 text-black font-[600] bg-yellow-500 rounded-md">
                            <p className="flex items-center gap-2">
                              <PiHandsClappingFill className="text-xl mt-[2px]" />
                              {t("Save")}
                              <span>
                                {Math.round(
                                  ((parseFloat(price) - parseFloat(sale_price)) /
                                    parseFloat(price)) * 100
                                )}
                                %
                              </span>
                            </p>
                          </div>
                        )}
                      </>
                    );
                  } else if (showPrice) {
                    return (
                      <p className="font-[600] text-2xl">
                        {price} {currencyCode}
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-red-500 font-[500] text-xl">
                        {t("no_price_available")}
                      </p>
                    );
                  }
                })() : null}
              </div>
            )}


            <div
              className="relative group w-full mt-6"
              onTouchStart={() => {
                if (isOutOfStock) {
                  setShowTooltip(true);
                  setTimeout(() => setShowTooltip(false), 2000);
                }
              }}
            >
              <button
                onClick={handleBuyButtonClick}
                className={`w-full cursor-pointer hover:scale-[1.05] transition-all duration-[0.3s] ease-in-out py-3 text-md md:text-xl px-4 rounded-lg bg-black text-white font-[500] mt-3`}
                disabled={isOutOfStock}
              >
                {t('Buy_with_Cash_on_Delivery')}
              </button>

              {isOutOfStock && (
                <div
                  className={`absolute w-[200px] z-[999] text-center p-2 rounded-md -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-sm 
        ${showTooltip ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
        transition-opacity duration-300 pointer-events-none`}
                >
                  {t('Out_of_stock')}
                  <TiArrowSortedDown className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 text-2xl text-red-600" />
                </div>
              )}
            </div>

            <div>
              <OurGranteeShippingFaq />
            </div>

            <div className="product-reviews">
              <ProductReviews product={product.reviews} />
            </div>
          </div>
        </div>
        <div className="product-description pt-8 w-full lg:w-[75%] mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-[600]">
            {t('Description')}
          </h2>
          <ProductDescription description={product.description} description_ar={product.description_ar} />
        </div>
      </div>

      <div className="pb-12">
        <RelatedProducts product={product.related_products} currencyCode={currencyCode} />
      </div>

      {isModalOpen && (
        <div className="fixed overflow-y-auto pt-20 lg:pt-28 2xl:pt-18 inset-0 bg-opacity-50 flex items-center justify-center z-[9999999999] shadow-lg p-4 bg-gray-900/85 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{t('Cash_on_Delivery')}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 border-t-[1px] border-t-gray-300 pt-3 flex">
              <div className="relative">
                <Image
                  className="w-[70px] h-[70px] object-cover block rounded-lg"
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  width={100}
                  height={100}
                  priority
                />
                <p className="qty-tag absolute -top-2 right-[0px] bg-gray-500 text-white font-[500] rounded-full text-[14px] text-center flex items-center justify-center w-5 h-5">
                  {selectedBundle?.quantity || 1}
                </p>
              </div>
              <p className={`font-semibold w-[70%] lg:w-[80%] ${language === "ar" ? "mr-4" : "ml-4"}`}>
                {language === "ar" ? product.name_ar : product.name}
              </p>
            </div>
            {/* <div className="bg-gray-100 p-3 rounded-md mb-4">
            
                <div className="flex justify-between">
                  <p className="text-[15px]">{t('Price')}:</p>
                  <p className="font-[600] text-[15px]">
                    {(() => {
                      // First check for bundle price
                      if (selectedBundle?.price) {
                        return `${selectedBundle.price} ${currencyCode}`;
                      }

                      // Then check for valid offer price
                      const priceData = product.prices?.[0];
                      const isOfferValid = priceData?.offer_price &&
                        priceData.offer_price !== "0.00" &&
                        isOfferActive(priceData.offer_start_date, priceData.offer_end_date);

                      if (isOfferValid) {
                        return `${priceData.offer_price} ${currencyCode}`;
                      }

                      // Then check for valid sale price (not 0.00)
                      if (priceData?.sale_price && priceData.sale_price !== "0.00") {
                        return `${priceData.sale_price} ${currencyCode}`;
                      }

                      // Finally fall back to regular price
                      if (priceData?.price && priceData.price !== "0.00") {
                        return `${priceData.price} ${currencyCode}`;
                      }

                      // If no valid price is found
                      return `0.00 ${currencyCode}`;
                    })()}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-[15px]">{t('Subtotal')}:</p>
                  <p className="font-[600] text-[15px]">
                    {(() => {
                      // Same logic as above for consistency
                      if (selectedBundle?.price) {
                        return `${selectedBundle.price} ${currencyCode}`;
                      }

                      const priceData = product.prices?.[0];
                      const isOfferValid = priceData?.offer_price &&
                        priceData.offer_price !== "0.00" &&
                        isOfferActive(priceData.offer_start_date, priceData.offer_end_date);

                      if (isOfferValid) {
                        return `${priceData.offer_price} ${currencyCode}`;
                      }

                      if (priceData?.sale_price && priceData.sale_price !== "0.00") {
                        return `${priceData.sale_price} ${currencyCode}`;
                      }

                      if (priceData?.price && priceData.price !== "0.00") {
                        return `${priceData.price} ${currencyCode}`;
                      }

                      return `0.00 ${currencyCode}`;
                    })()}
                  </p>
                </div>


              {(() => {
                const basePrice = selectedBundle?.price
                  || (product.prices?.[0]?.offer_price &&
                    isOfferActive(product.prices[0].offer_start_date, product.prices[0].offer_end_date)
                    ? product.prices[0].offer_price
                    : product.prices?.[0]?.sale_price || product.prices?.[0]?.price);
                const isBelowThreshold = Number(basePrice) < 15;

                return isBelowThreshold ? (
                  <div className="">
                    <div className="flex justify-between">
                      <p className="text-[15px]">{t('Shipping_Amount')}:</p>
                      <p className="font-[600] text-[15px]">{getSetting?.shipping_amount} {currencyCode}</p>
                    </div>
                    <p className="text-[14px] bg-black py-1 px-2 text-white text-center mt-3 rounded-lg">
                      {t('Delivery_charges_priced_below')} 15 {currencyCode}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <p className="text-[15px]">{t('Free_Shipping')}:</p>
                    <p className="font-[600] text-[15px]">{t('Free')}</p>
                  </div>
                );
              })()}
              <div className="flex justify-between border-t-[1px] border-t-gray-300 pt-2 mt-2">
                {(() => {
                  let basePrice =
                    selectedBundle?.price ??
                    (product.prices?.[0]?.offer_price &&
                      isOfferActive(product.prices[0].offer_start_date, product.prices[0].offer_end_date)
                      ? product.prices[0].offer_price
                      : product.prices?.[0]?.sale_price ?? product.prices?.[0]?.price);

                  const numericBasePrice = parseFloat(basePrice) || 0;
                  const shippingAmount = parseFloat(getSetting?.shipping_amount) || 0;

                  const isBelowThreshold = numericBasePrice < 15;
                  const total = isBelowThreshold ? numericBasePrice + shippingAmount : numericBasePrice;

                  return (
                    <div className="flex justify-between w-full">
                      <p className="font-[600] text-[15px]">{t('Grand_Total')}:</p>
                      <p className="font-[600] text-[15px]">
                        {total.toFixed(2)} {currencyCode}
                      </p>
                    </div>
                  );
                })()}

              </div>
            </div> */}

            <div className="bg-gray-100 p-3 rounded-md mb-4">
              {/* Price and Subtotal sections */}
              <div className="flex justify-between">
                <p className="text-[15px]">{t('Price')}:</p>
                <p className="font-[600] text-[15px]">
                  {(() => {
                    const price = getDisplayPrice();
                    return `${price} ${currencyCode}`;
                  })()}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-[15px]">{t('Subtotal')}:</p>
                <p className="font-[600] text-[15px]">
                  {(() => {
                    const price = getDisplayPrice();
                    return `${price} ${currencyCode}`;
                  })()}
                </p>
              </div>

              {(() => {
                const basePrice = parseFloat(getDisplayPrice()) || 0;
                const isBelowThreshold = basePrice < 15;

                return isBelowThreshold ? (
                  <div className="">
                    <div className="flex justify-between">
                      <p className="text-[15px]">{t('Shipping_Amount')}:</p>
                      <p className="font-[600] text-[15px]">{getSetting?.shipping_amount} {currencyCode}</p>
                    </div>
                    <p className="text-[14px] bg-black py-1 px-2 text-white text-center mt-3 rounded-lg">
                      {t('Delivery_charges_priced_below')} 15 {currencyCode}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <p className="text-[15px]">{t('Free_Shipping')}:</p>
                    <p className="font-[600] text-[15px]">{t('Free')}</p>
                  </div>
                );
              })()}

              <div className="flex justify-between border-t-[1px] border-t-gray-300 pt-2 mt-2">
                {(() => {
                  const basePrice = parseFloat(getDisplayPrice()) || 0;
                  const shippingAmount = parseFloat(getSetting?.shipping_amount) || 0;
                  const isBelowThreshold = basePrice < 15;
                  const total = isBelowThreshold ? basePrice + shippingAmount : basePrice;

                  return (
                    <div className="flex justify-between w-full">
                      <p className="font-[600] text-[15px]">{t('Grand_Total')}:</p>
                      <p className="font-[600] text-[15px]">
                        {total.toFixed(2)} {currencyCode}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>

            <BuyForm product={product}
              closeModal={closeModal}
              selectedSize={selectedSizeObj}
              selectedBundle={shouldShowDiscountPrices() ? selectedBundle : null}
            />
          </div>
        </div>
      )}
    </>
  );
}
