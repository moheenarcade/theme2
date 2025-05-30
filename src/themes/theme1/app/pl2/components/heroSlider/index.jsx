'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const HeroSlider = ({ products }) => {
    console.log('products in landing page hero slider:', products);

    const [currentSlide, setCurrentSlide] = useState(1);
    let productImages = [];

    if (Array.isArray(products) && products.length > 0 && Array.isArray(products[0]?.images)) {
        productImages = products[0].images;
    } else if (products && Array.isArray(products.images)) {
        productImages = products.images;
    }

    if (productImages.length === 0) return null;

    const images = productImages.map(img => `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${img.image}`);

    return (
        <div className="landing-hero-slider w-full relative">
            <Swiper
                modules={[Navigation, Autoplay]}
                loop={true}
                autoplay={false}
                navigation={false}
                onSlideChange={(swiper) => {
                    const realIndex = (swiper.realIndex ?? 0) + 1;
                    setCurrentSlide(realIndex);
                }}
                className="h-full w-full"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full aspect-[2/2] md:h-[700px]">
                            <Image
                                src={img}
                                alt={`Slider banner ${index + 1}`}
                                fill
                                className="object-fill"
                                priority
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-6 right-6 bg-black/50 text-white px-4 py-1 rounded-full text-sm font-medium z-10">
                <p>{currentSlide} / {images.length}</p>
            </div>
        </div>
    );
};

export default HeroSlider;
