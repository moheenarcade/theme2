"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { useLanguage } from "../../../../context/LanguageContext";
import { useTranslation } from "../../../../hooks/useTranslation";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const ProductDetailImageSlider = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  const { language } = useLanguage();

  const getImageUrl = (imageObj) => {
    if (!imageObj || !imageObj.image) return "/placeholder.webp";
    return imageObj.image.startsWith("http")
      ? imageObj.image
      : `${imageBaseUrl}${imageObj.image}`;
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Swiper
        style={{
          "--swiper-navigation-color": "#000",
          "--swiper-pagination-color": "#000",
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {product.images?.map((imageObj, index) => (
          <SwiperSlide key={index}>
            <Image
              className="w-full aspect-[5/5] object-cover block rounded-xl"
              src={getImageUrl(imageObj)}
              alt="product image"
              width={600}
              height={600}
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-4"
        dir={language === "ar" ? "rtl" : "ltr"} 
      >
        {product.images?.map((imageObj, index) => (
          <SwiperSlide key={index}>
            <Image
              src={getImageUrl(imageObj)}
              alt={`Thumbnail ${index}`}
              width={100}
              height={100}
              priority
              className="w-full aspect-[4/4] object-cover border cursor-pointer rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductDetailImageSlider;
