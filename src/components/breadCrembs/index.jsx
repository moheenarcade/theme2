import Link from 'next/link';
import React from 'react'
import { FiHome } from "react-icons/fi";
import { FaChevronRight } from "react-icons/fa6";


const Breadcrembs = ({ label }) => {

    return (
        <div className='breadcrembs-main border-b-[#f0f0f0] border-b-[1px]'>
            <div className="max-w-[1125px] mx-auto px-4 xl:px-0">
                <div className="flex items-center gap-2 py-4">
                    <Link href="/">
                        <FiHome className='text-lg' />
                    </Link>
                    <span>
                        <FaChevronRight className='text-sm' />

                    </span>
                    <p className='text-sm text-[#737373]'>{label}</p>
                </div>
            </div>
        </div>
    )
}

export default Breadcrembs;
