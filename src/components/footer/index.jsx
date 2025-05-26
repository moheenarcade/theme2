import Link from 'next/link';
import React from 'react';
import Logo from "../../../public/images/header-logo.png";
import Image from 'next/image';

const Footer = () => {

  return (

    <div className='footer-main pt-8 border-t-[#a68a64] border-t-[1px] mt-6'>
      <div className="max-w-[1125px] mx-auto px-4 xl:px-0">
        <div className="footer-logo w-fit mx-auto pb-8">
          <Link href="/">
            <Image className='w-[100px] mx-auto' src={Logo} alt="logo" />
          </Link>
        </div>

        <div className="footer-links border-y-[#f0f0f0] border-y-[1px] py-6 flex flex-col lg:flex-row justify-between flex-wrap gap-8 lg:gap-4">
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
            <div className="">
              <p className='text-[18px] font-[500]'>Terms and policies</p>
              <div className="bg-[#592404] w-[25px] h-[1px] mx-auto lg:mx-0"></div>
            </div>

            <ul className='pt-3'>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>terms of use</li>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>Exchange and Return Policy</li>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>privacy policy</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
            <div className="">
              <p className='text-[18px] font-[500]'>Contact us</p>
              <div className="bg-[#592404] w-[25px] h-[1px] mx-auto lg:mx-0"></div>
            </div>
            <ul className='pt-3'>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>Contact us</li>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>Frequently asked questions</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
            <div className="">
              <p className='text-[18px] font-[500]'>About the store</p>
              <div className="bg-[#592404] w-[25px] h-[1px] mx-auto lg:mx-0"></div>
            </div>
            <ul className='pt-3'>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>About the store</li>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>Payment methods</li>
              <li className='text-[16px] text-[#000000] mb-1 cursor-pointer hover:text-[#592404] transition-all duration-[0.3s] ease-in-out'>Shipping and handling</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Footer;
