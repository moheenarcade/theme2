"use client";
import React from 'react';
import Image from 'next/image';
import ProductImage1 from "../../../public/images/productbanner1.webp";
import ProductImage2 from "../../../public/images/produyctbanner2.webp";
import ProductImage3 from "../../../public/images/producvtbanner3.webp";
import ProductImage4 from "../../../public/images/productbanner4.webp";
import Link from 'next/link';

const AllProducts = () => {

    const productList = [
        {
            id: 1,
            title: "IPL Laser Hair Removal Device",
            oldPrice: "458 AED",
            newPrice: "229 AED",
            image: ProductImage1,
        },
        {
            id: 2,
            title: "IPL Hair Remover Pro",
            oldPrice: "499 AED",
            newPrice: "259 AED",
            image: ProductImage2,
        },
        {
            id: 3,
            title: "Facial Hair Removal Tool",
            oldPrice: "399 AED",
            newPrice: "199 AED",
            image: ProductImage3,
        },
        {
            id: 4,
            title: "Skin Rejuvenation IPL Device",
            oldPrice: "550 AED",
            newPrice: "275 AED",
            image: ProductImage4,
        },

        {
            id: 5,
            title: "IPL Laser Hair Removal Device",
            oldPrice: "458 AED",
            newPrice: "229 AED",
            image: ProductImage1,
        },
        {
            id: 6,
            title: "IPL Hair Remover Pro",
            oldPrice: "499 AED",
            newPrice: "259 AED",
            image: ProductImage2,
        },
        {
            id: 7,
            title: "Facial Hair Removal Tool",
            oldPrice: "399 AED",
            newPrice: "199 AED",
            image: ProductImage3,
        },
        {
            id: 8,
            title: "Skin Rejuvenation IPL Device",
            oldPrice: "550 AED",
            newPrice: "275 AED",
            image: ProductImage4,
        },
    ];

    return (
        <div className='all-products-main pt-12 xl:pt-20 max-w-[1125px] mx-auto px-4 xl:px-0'>
            <h1 className='text-[#000000] text-[22px] md:text-[26px] text-center'>
                All products
            </h1>
            <p className='text-center text-[#696969]'>You will find everything you are looking for</p>
            <div className="all-products my-10">
                {productList.map((product) => (
                    <div key={product.id}>
                        <div
                            className="single-product group cursor-pointer border-[#f0f0f0] border-[1px] rounded-[3px] hover:border-[#592404FF] transition-all duration-[0.3s] ease-in-out"
                        >
                            <div className="border-b-[#f0f0f0] overflow-hidden border-b-[1px] group-hover:border-[#592404FF] transition-all duration-[0.3s] ease-in-out">
                                <Image
                                    className='w-full h-[270px] lg:h-[256px] rounded-t-[3px] object-cover group-hover:scale-[1.1] transition-all duration-[0.3s] ease-in-out'
                                    src={product.image}
                                    alt={product.title}
                                />
                            </div>
                            <div className="py-[15px] md:py-[20px] px-[15px] flex flex-col justify-between h-[178px]">
                                <div className="product-desc">
                                    <p className='text-[#592404FF] line-clamp-1 text-[14px] font-[600] text-center mb-[10px]'>{product.title}</p>
                                    <p className='text-center regular-price text-[#747474] line-through text-[14px] font-[400] mb-[10px]'>{product.oldPrice}</p>
                                    <p className='text-center text-[#592404FF] font-[600] text-[16px] mb-[10px]'>{product.newPrice}</p>
                                </div>
                                <Link href="/product-details" className='bg-[#592404] text-center hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] w-fit mx-auto min-w-[190px] rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
                                    Buy now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllProducts;
