
"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Breadcrembs from '../../components/breadCrembs';
import OrderForm from "../../components/homePageComponent/orderForm";
import Customerreviews from "../../components/customerReviews";
import RelatedProducts from "../../components/relatedProducts";

const ProductDetails = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return (
        <>
            <Breadcrembs />
            <div className='max-w-[1125px] mx-auto px-4 xl:px-0 my-8'>
                <div className="flex md:gap-6 flex-col lg:flex-row relative">
                    <div className="product-slideImage w-full lg:w-[50%] lg:sticky lg:top-28 self-start h-fit">
                        <Swiper
                            spaceBetween={10}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Thumbs]}
                            className="mySwiper2"
                        >
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
                            </SwiperSlide>
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
                            className="mySwiper3 mt-4"
                        >
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-1.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-2.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-3.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-4.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-1.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-2.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-3.jpg" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img className="w-[120px] mx-auto" src="https://swiperjs.com/demos/images/nature-4.jpg" />
                            </SwiperSlide>
                        </Swiper>
                    </div>

                    <div className="product-buy-form w-full lg:w-[50%]">
                        <h3 className="text-[#000000] text-[25px] font-[500] hidden lg:block">bee nectar gel</h3>
                        <div className="flex justify-between md:justify-start gap-4 items-center pt-2">
                            <p className="text-[#592404FF] font-[500] text-[24px]">159 AED</p>
                            <p className="text-[#747474] line-through text-[20px] font-[300]">318 AED</p>
                        </div>
                        <p className="text-center text-[16px] font-[500] mt-3">
                            Hurry! Only 5 pieces left in stock!
                        </p>
                        <div className="product-form mt-6">
                            <OrderForm />
                        </div>
                    </div>
                </div>
            </div>

            <Customerreviews />
            <RelatedProducts />


        
        </>
    )
}

export default ProductDetails;
