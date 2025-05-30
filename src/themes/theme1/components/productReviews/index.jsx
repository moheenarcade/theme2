'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination , Autoplay } from 'swiper/modules';

const ProductReviews = ({ product }) => {
    if (!product || !Array.isArray(product) || product.length === 0) {
        return null;
      }
    
    // console.log(product, "product reviews data");

    return (
        <div className='product-reviews-main mt-6 border border-gray-300 rounded-lg px-3'>
            {product && Array.isArray(product) && product.length > 0 ? (
                <Swiper
                className="product-reviews-slider"
                    modules={[Navigation, Pagination , Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                      }}
                >
                    {product.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className='review-item py-4'>
                                <p className='text-base font-[4 00] mb-2 border-b-1 border-b-gray-200 pb-2 line-clamp-2'>{review.comment}</p>
                                <p className='text-sm text-gray-400 flex items-center gap-2 pb-3'>
                                    <span>{review.user_name}</span>
                                    <span className='flex'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </span>
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p className='p-3'>No reviews available.</p>
            )}
        </div>
    );
};

export default ProductReviews;
