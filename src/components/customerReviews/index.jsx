'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { TiStar } from "react-icons/ti";

const reviews = [
    {
        name: 'Sarah M.',
        review: 'Absolutely love this product! It changed my skincare routine forever.',
        rating: 5,
    },
    {
        name: 'John D.',
        review: 'Great value for money and fast shipping. Highly recommend!',
        rating: 4,
    },
    {
        name: 'Aisha R.',
        review: 'Impressed by the quality. Will definitely order again.',
        rating: 5,
    },
    {
        name: 'Aisha R.',
        review: 'Impressed by the quality. Will definitely order again.',
        rating: 4,
    },
    {
        name: 'Aisha R.',
        review: 'Impressed by the quality. Will definitely order again. Impressed by the quality. Will definitely order again. Impressed by the quality. Will definitely order again.',
        rating: 5,
    },
];

const Customerreviews = () => {

    return (

        <div className='reviews-main'>
            <div className="max-w-[1125px] mx-auto px-4 xl:px-0 py-[30px]">
                <div className="mb-4 md:mb-6">
                    <h2 className='text-[#000000] text-[22px] md:text-[26px] text-center'>
                        Customer review
                    </h2>
                    <p className='text-[#696969] text-center'>Add your rating</p>
                </div>

                <div className="adding-rating flex flex-col md:flex-row items-center justify-between" >
                    <h3 className='font-[500] text-xl'>Customer review</h3>
                    <button className='bg-[#592404] mt-2 md:mt-0 w-fit hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-4 md:px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
                        Add your rating
                    </button>
                </div>
                <div className="reviews-slider mt-8">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={3}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        loop={true}
                        breakpoints={{
                            0: {
                              slidesPerView: 1,
                            },
                            640: {
                              slidesPerView: 2,
                            },
                            1024: {
                              slidesPerView: 3,
                            },
                          }}
                    >
                        {reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <div className="single-review rounded-[3px] border-[#f0f0f0] border-[1px] p-6 text-center">
                                    <p className="text-gray-800 text-lg mb-4 italic line-clamp-2">"{review.review}"</p>
                                    <div className="flex justify-center gap-1 mb-2">
                                        {Array(review.rating)
                                            .fill(0)
                                            .map((_, i) => (
                                                <span key={i} className="text-yellow-400 text-xl">★</span>
                                            ))}
                                        {Array(5 - review.rating)
                                            .fill(0)
                                            .map((_, i) => (
                                                <span key={i} className="text-[#FFAB00] text-xl">★</span>
                                            ))}
                                    </div>
                                    <p className="text-gray-600 font-medium mb-4">– {review.name}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </div>
    )
}

export default Customerreviews;
