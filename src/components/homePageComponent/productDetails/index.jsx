import React from 'react'
import ProductDesc1 from "../../../../public/images/productdetail-1.webp";
import ProductDesc2 from "../../../../public/images/productdetail-2.png";
import ProductDesc3 from "../../../../public/images/productdetail-3.webp";
import Image from 'next/image';

const ProductDetails = () => {

    return (
        <div className="">
            <Image src={ProductDesc1} alt='product banner' />

            <p className='text-center text-[24px] text-[#8c441b] py-6'>Product features:</p>
            <ul>
                <li className='text-[#000] tex-lg mb-3'>🌿 <span className='text-xl'> Effective natural ingredients: </span>  It contains natural ingredients such as essential oils, refreshing mint, honey, and anti-inflammatory compounds that help improve blood flow and soothe affected areas.</li>
                <li className='text-[#000] tex-lg mb-3'> 🌀 <span className='text-xl'>Deep penetration:</span> It works effectively to reach deep into the affected areas, giving you instant relief and relief from inflammation and swelling. </li>
                <li className='text-[#000] tex-lg mb-3'>🔄 <span className='text-xl'>Versatile:</span> It can be used to relieve pain in various joints such as knees, back, shoulders, and legs.</li>
            </ul>
            <Image src={ProductDesc2} alt='product banner' />
            <Image src={ProductDesc3} alt='product banner' />

        </div>
    )
}

export default ProductDetails;
