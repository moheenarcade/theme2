"use client";
import React, { useState, useEffect } from "react";
import { CgHomeAlt } from "react-icons/cg";
import { LuHeart } from "react-icons/lu";
import { IoIosCart } from "react-icons/io";
import { AiFillProduct } from "react-icons/ai";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useSelectedCategory } from "../../../../context/SelectedCategoryContext";


const MobileBottomMenu = () => {
      const { setSelectedCategory } = useSelectedCategory();
      const router = useRouter();
      const [categories, setCategories] = useState([]);
      // console.log(categories, "category");
      const [loading, setLoading] = useState(true);
      const { setSelectedCategories } = useSelectedCategory();

    return (

        <div className='mobile-bottom-menu block lg:hidden px-2 md:px-20 fixed bottom-0 z-[99999999999] bg-white shadow-md w-full border-t-[1px] border-t-gray-300'>
            <ul className='flex justify-between font-[400]'>
                <Link href="/">
                <li className='py-2 px-2 flex flex-col items-center text-sm'>
                    <CgHomeAlt className='text-2xl' />
                    Home
                </li>
                </Link>
                <Link href="/products"
                     onClick={() => {
                        setSelectedCategory();
                        localStorage.removeItem("selectedCategories");
                      }}
                >
                <li className='py-2 px-2 flex flex-col items-center text-sm'><AiFillProduct className='text-2xl' />
                    Products</li>
                </Link>

                <li className='py-2 px-2 flex flex-col items-center text-sm'><IoIosCart className='text-2xl' />
                    Cart</li>
                <li className='py-2 px-2 flex flex-col items-center text-sm'><LuHeart className='text-2xl' />
                    Wishlist</li>
            </ul>
        </div>
    )
}

export default MobileBottomMenu;
