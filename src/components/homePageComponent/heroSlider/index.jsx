"use client"
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination , Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Slider1 from "../../../../public/images/heroslider1.webp";
import Slider2 from "../../../../public/images/herosldier2.webp";

const HeroSlider = () => {

    return (
        <div className='hero-swiper'>
            <Swiper
                navigation={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                modules={[Navigation, Pagination , Autoplay]}
                className="mySwiper h-[200px] md:h-[250px] lg:h-[350px] xl:h-[500px]">
                <SwiperSlide>
                    <Image className='w-full h-full object-center' src={Slider1} alt='slider banner' />
                </SwiperSlide>
                <SwiperSlide>
                    <Image className='w-full h-full object-center' src={Slider2} alt='slider banner' />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default HeroSlider;
