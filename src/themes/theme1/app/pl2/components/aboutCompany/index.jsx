import Link from 'next/link';
import React from 'react'

const AboutCompany = () => {

    return (

        <div className='my-4 px-[10px] py-4 bg-white'>
            <div className="company-info-box">
                <Link href="#" className='py-2 px-1 text-[#999] border-[1px] border-[#999] text-center'>About our company</Link>
                <Link href="#" className='py-2 px-1 text-[#999] border-[1px] border-[#999] text-center'>Terms & Conditions
                </Link>
                <Link href="#" className='py-2 px-1 text-[#999] border-[1px] border-[#999] text-center'>Return Policy
                </Link>
                <Link href="#" className='py-2 px-1 md:px-2 text-[#999] border-[1px] border-[#999] text-center'>Shipping \ Payment Method
                </Link>
                <Link href="#" className='py-2 px-1 text-[#999] border-[1px] border-[#999] text-center'>Privacy Policy
                </Link>
                <Link href="#" className='py-2 px-1 text-[#999] border-[1px] border-[#999] text-center'>Contact us
                </Link>
            </div>
        </div>
    )
}

export default AboutCompany;
