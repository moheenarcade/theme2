import React from 'react'
import { RiSecurePaymentFill } from "react-icons/ri";
import { BsCart4 } from "react-icons/bs";
import { GrDeliver } from "react-icons/gr";


const OurFeatures = () => {

    return (
        <div className='max-w-[1125px] mx-auto px-4 xl:px-0 py-[30px]'>
            <h2 className='text-[#000000] text-[22px] md:text-[26px] text-center mb-8'>Our features</h2>
            <div className="features-main">
                <div className="single-feature flex justify-center items-center flex-col">
                    <div className="bg-[#41251e] flex justify-center items-center rounded-full text-[#ffffff] h-[68px] w-[68px] ">
                    <RiSecurePaymentFill className='text-[38px]'/>
                    </div>
                    <p className='text-[#000000] text-lg lg:text-xl text-center'>Secure payment</p>
                    <p className='text-[#000000] text-sm md:text-md mt-2 text-center'>Payment upon receipt</p>
                </div>
                <div className="single-feature flex justify-center items-center flex-col">
                    <div className="bg-[#41251e] flex justify-center items-center rounded-full text-[#ffffff] h-[68px] w-[68px] ">
                    <BsCart4 className='text-[38px]'/>
                    </div>
                    <p className='text-[#000000] text-lg lg:text-xl text-center'>Shop with confidence</p>
                    <p className='text-[#000000] text-sm md:text-md mt-2 text-center'>
                    Subscriber protection policies cover your entire purchasing journey.
                    </p>
                </div>
                <div className="single-feature flex justify-center items-center flex-col">
                    <div className="bg-[#41251e] flex justify-center items-center rounded-full text-[#ffffff] h-[68px] w-[68px] ">
                    <GrDeliver className='text-[38px]'/>
                    </div>
                    <p className='text-[#000000] text-lg lg:text-xl text-center'>Delivery</p>
                    <p className='text-[#000000] text-sm md:text-md mt-2 text-center'>Free delivery throughout the Kingdom of Saudi Arabia</p>
                </div>

            </div>
        </div>
    )
}

export default OurFeatures;
