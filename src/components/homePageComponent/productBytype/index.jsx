import Image from 'next/image';
import React from 'react';
import ProdcutImage1 from "../../../../public/images/cat-producyt1banner.webp";
import ProdcutImage2 from "../../../../public/images/cat-rpoduct2.webp";
import ProdcutImage3 from "../../../../public/images/cat-rpoduct-3.webp";
import ProdcutImage4 from "../../../../public/images/cat-product-4.webp";

const ProductBytype = () => {

    return (
        <div className='max-w-[1125px] mx-auto px-4 xl:px-0 py-[30px]'>
            <h2 className='text-[#000000] text-[26px] text-center mb-8'>Products by type</h2>
            <div className="cat-sec">
                <div className="single-cat-box cursor-pointer group transition-all duration-[0.3s] ease-in-out">
                    <div className="overflow-hidden">
                        <Image className='group-hover:scale-[1.1] transition-all duration-[0.3s] ease-in-out' src={ProdcutImage1} alt='product banner' />
                    </div>
                    <div className="text-center flex justify-center items-center py-[20px] px-[15px] border-[1px] border-[#f0f0f0]" >
                        <p className='text-[#000000] text-lg '>
                            Jewelry and watches
                        </p>
                    </div>
                </div>
                <div className="single-cat-box cursor-pointer group transition-all duration-[0.3s] ease-in-out">
                    <div className="overflow-hidden">
                        <Image className='group-hover:scale-[1.1] transition-all duration-[0.3s] ease-in-out' src={ProdcutImage2} alt='product banner' />
                    </div>
                    <div className="text-center flex justify-center items-center py-[20px] px-[15px] border-[1px] border-[#f0f0f0]" >
                        <p className='text-[#000000] text-lg '>
                            Sports and Fitness
                        </p>
                    </div>
                </div>
                <div className="single-cat-box cursor-pointer group transition-all duration-[0.3s] ease-in-out">
                    <div className="overflow-hidden">
                        <Image className='group-hover:scale-[1.1] transition-all duration-[0.3s] ease-in-out' src={ProdcutImage3} alt='product banner' />
                    </div>
                    <div className="text-center flex justify-center items-center py-[20px] px-[15px] border-[1px] border-[#f0f0f0]" >
                        <p className='text-[#000000] text-lg '>
                            Beauty and perfumes
                        </p>
                    </div>
                </div>
                <div className="single-cat-box cursor-pointer group transition-all duration-[0.3s] ease-in-out">
                    <div className="overflow-hidden">
                        <Image className='group-hover:scale-[1.1] transition-all duration-[0.3s] ease-in-out' src={ProdcutImage4} alt='product banner' />
                    </div>
                    <div className="text-center flex justify-center items-center py-[20px] px-[15px] border-[1px] border-[#f0f0f0]" >
                        <p className='text-[#000000] text-lg '>
                        Kitchen supplies
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductBytype;
