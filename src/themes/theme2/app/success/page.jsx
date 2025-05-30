'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Thanksimg from "../../../../../public/images/thanks-msg-2-(1).svg";
import Breadcrembs from '../../components/breadCrembs';
import Laoder from '../../../theme1/components/loader/index';
import { useTranslation } from "../../../../hooks/useTranslation";


const Success = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [storeSettings, setStoreSettings] = useState(null);
    const { t } = useTranslation();
  
    useEffect(() => {
      const fetchOrder = async () => {
        if (!orderId) return;
        try {
          const res = await fetch(`${baseUrl}/store/order/${orderId}`);
          const data = await res.json();
          setOrderData(data.data);
        } catch (err) {
          console.error('Failed to fetch order data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }, [orderId]);
  
    useEffect(() => {
      const stored = localStorage.getItem('storeSettings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStoreSettings(parsed);
        } catch (err) {
          console.error("Error parsing storeSettings from localStorage:", err);
        }
      }
    }, []);
  
    if (loading) return <Laoder />;
    return (
        <div className='checkout-main'>
            <Breadcrembs label="Success"/>
            <div className="max-w-[1125px] mx-auto px-4 xl:px-0 mt-12 mb-20">
                <div className="flex flex-col justify-center items-center">
                    <Image className='w-18' src={Thanksimg} alt="thank banner" />
                    <h1 className='text-[26px] py-3 font-[500]'>Thanks for your order</h1>
                    <Link href="/" className='bg-[#592404] text-center hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[300] w-fit mx-auto min-w-[190px] rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
                        Keep shopping
                    </Link>
                </div>

                <div className="order-sec mt-12 max-w-[700px] mx-auto">
                    <div className="bg-[#fafafa] p-[15px] rounded-[3px] border-[#f0f0f0] border-[1px]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-[50%] bg-[#fff] border-[#f0f0f0] border-[1px] p-[12px] text-center rounded-[3px]">
                                <p className='text-[#a7a7a7] text-[14px] font-[500]'>Payment information</p>
                                <p className='text-[13px] font-[600]'>Cash on delivery</p>
                            </div>
                            <div className="w-full md:w-[50%] bg-[#fff] border-[#f0f0f0] border-[1px] p-[12px] text-center rounded-[3px]">
                                <p className='text-[#a7a7a7] text-[14px] font-[500]'>Poses</p>
                                <p className='text-[13px] font-[600] text-[#00c853]'>Unpaid amount</p>
                            </div>
                        </div>
                        <div className="mt-4 w-full overflow-x-auto">
                            <table className='border-[#f0f0f0] border-[1px] w-full'>
                                <thead className='text-[#a7a7a7] text-[15px] border-b-[#f0f0f0] border-b-[1px]'>
                                    <th className='text-start font-[500] py-[12px] px-4 whitespace-nowrap'>Project</th>
                                    <th className='text-center font-[500] py-[12px] px-4 whitespace-nowrap'> Price</th>
                                    <th className='text-center font-[500] py-[12px] px-4 whitespace-nowrap'>Quantity</th>
                                    <th className='text-end font-[500] py-[12px] px-4 whitespace-nowrap'>Total</th>
                                </thead>
                                <tbody className='text-[15px]'>
                                    <tr className='border-b-[#f0f0f0] border-b-[1px]'>
                                        <td className='text-start py-[12px] px-4 whitespace-nowrap'>{orderData?.order_products[0]?.product_name}</td>
                                        <td className='text-center py-[12px] px-4 whitespace-nowrap'>{orderData?.order_total_amount}</td>
                                        <td className='text-center py-[12px] px-4 whitespace-nowrap'>{orderData?.order_products[0]?.order_product_quantity}</td>
                                        <td className='text-end py-[12px] px-4 whitespace-nowrap'>{orderData?.order_total_amount}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-start py-[4px] px-4 text-[#a7a7a7] whitespace-nowrap'>Total</td>
                                        <td className='text-center py-[4px] px-4 whitespace-nowrap'>{orderData?.order_total_amount}</td>
                                        <td className='text-center py-[4px] px-4 whitespace-nowrap'></td>
                                        <td className='text-end py-[4px] px-4 whitespace-nowrap'></td>
                                    </tr>
                                    <tr>
                                        <td className='text-start py-[4px] px-4 text-[#a7a7a7] whitespace-nowrap'> Shipping (Free Shipping):</td>
                                        <td className='text-center py-[4px] px-4 whitespace-nowrap'>0 AED</td>
                                        <td className='text-center py-[4px] px-4 whitespace-nowrap'></td>
                                        <td className='text-end py-[4px] px-4 whitespace-nowrap'></td>
                                    </tr>
                                    <tr>
                                        <td className='text-start py-[4px] px-4 whitespace-nowrap text-[#592404]'>Total amount:</td>
                                        <td className='text-center py-[4px] px-4 text-[#592404] whitespace-nowrap'>{orderData?.order_total_amount}</td>
                                        <td className='text-center py-[4px] px-4'></td>
                                        <td className='text-end py-[4px] px-4'></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Success;
