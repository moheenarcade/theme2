import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import ProductDetails from '../productDetails';
import Link from 'next/link';


const OrderForm = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  return (
    <div className='orderForm-main border-t-[#f0f0f0] border-t-[1px] pt-[25px] ' id='cart-form'>
      <p className='font-[500] text-center text-[18px]'>To order, please enter your information in the boxes below.</p>
      <form className='mt-6' >
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="flex flex-col w-full md:w-[50%] mb-[15px]">
            <label htmlFor="name" className='text-[#000000] text-[15px]'>Full Name</label>
            <input name='name' className='p-[10px] w-full text-[15px] rounded-[5px] border-[1px] border-[#e5e5e5]' type="text" placeholder='Full Name' />
          </div>
          <div className="flex flex-col w-full md:w-[50%] mb-[15px]">
            <label htmlFor="phone" className='text-[#000000] text-[15px]'>Phone Number
            </label>
            <input name='phone' className='p-[10px] w-full text-[15px] rounded-[5px] border-[1px] border-[#e5e5e5]' type="text" placeholder='Phone Number' />
          </div>
        </div>
        <div className="flex flex-col w-full mb-[15px]">
          <label htmlFor="City" className='text-[#000000] text-[15px]'>City
          </label>
          <input name='City' className='p-[10px] w-full text-[15px] rounded-[5px] border-[1px] border-[#e5e5e5]' type="text" placeholder='City' />
        </div>

        <div className="flex items-center gap-4 mt-8 pb-4 border-b-[#f0f0f0] border-b-[1px]">
          <button className='bg-[#592404] w-full hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-2 md:px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] mx-auto rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
            Click here to order
          </button>
          <div className="flex">
            <button
              type="button"
              onClick={handleIncrement}
              className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
            >
              <FaPlus />
            </button>
            <input
              readOnly
              className='w-[40px] md:w-[80px] text-lg font-[500] outline-none text-center'
              type="text"
              value={quantity}
            />
            <button
              type="button"
              onClick={handleDecrement}
              className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
            >
              <FaMinus />
            </button>
          </div>
        </div>

        <div className=" mt-6">
          <hr className='mb-6' />
          <p className='text-[#592404] font-[500] text-center text-xl'>Joint treatment gel or ointment – ​​the perfect solution for relieving pain and improving joint health</p>
          <p className='text-[#000] text-md text-center pt-3'>
            Get instant relief from joint pain with Joint Relief Gel or Ointment, specially formulated to relieve pain and improve joint health thanks to a blend of effective natural ingredients.
          </p>
          {showDetails && (
            <div className="product-detail pt-2">
              <ProductDetails />
            </div>
          )}

          <p
            onClick={() => setShowDetails(!showDetails)}
            className='text-end mt-2 text-[#592404FF] text-[13px] cursor-pointer transition hover:underline'
          >
            {showDetails ? '- Read less' : '+ Read more'}
          </p>
        </div>
      </form>


      <div className="bottom-cart-btns fixed bottom-0 z-[99999999999] right-0 border-y-[#f0f0f0] border-y-[1px] left-0 px-4 bg-white w-full mx-auto block lg:hidden">
        <div className="flex items-center gap-2 py-4 ">
          <Link href="#cart-form" className='bg-[#592404] text-center w-full hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-2 md:px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] mx-auto rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
            Click here to order
          </Link>
          <div className="flex">
            <button
              type="button"
              onClick={handleIncrement}
              className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
            >
              <FaPlus />
            </button>
            <input
              readOnly
              className='w-[40px] md:w-[80px] text-lg font-[500] outline-none text-center'
              type="text"
              value={quantity}
            />
            <button
              type="button"
              onClick={handleDecrement}
              className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
            >
              <FaMinus />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderForm;
