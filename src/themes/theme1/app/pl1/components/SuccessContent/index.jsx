'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LuBadgeCheck } from "react-icons/lu";
import Laoder from '../loader/loader';
import { BsCartCheckFill } from "react-icons/bs";
import Image from 'next/image';
import CartImage from "../../../../../../../public/landingpageImages/largebanner2_converted.png"
import { AiOutlineMail } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { useTranslation } from "../../hooks/useTranslation";

const SuccessContent = () => {
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
  if (!orderData) return <p className="text-center py-10">No order data found.</p>;
  const orderTotal = parseFloat(orderData.order_total_amount);
  const freeShippingLimit = parseFloat(storeSettings?.free_shipping_limit || "0");
  const shippingAmount = parseFloat(storeSettings?.shipping_amount || "0");

  return (
    <div className='success-order py-12 lg:py-20'>
      <div className="container mx-auto px-6 lg:px-20 xl:px-62">
        <div className="flex justify-between flex-wrap">
          <div className="w-full lg:w-[46%] flex flex-col justify-center items-center cairo-family">
            <Image unoptimized className='w-[80px] lg:w-[40px]' width={200} height={200} src="https://assets.lightfunnels.com/account-26241/images_library/7ed790b9-ca39-43f6-a1d2-651104f0490c.svg" alt="product image" />
            <h1 className='text-[#191e2a] text-[26px] lg:text-[40px] font-[600] text-center py-3'>
              {t('Your_order_has_been_successfully')}
            </h1>
            <p className='text-center text-[#57637a] font-[500] text-[18px] lg:text-[20px]'>
             {t('We_are_happy_that_you_chose_our')}
            </p>
            <p className='text-[22px] lg:text-[20px] text-red-500 text-center font-[700] lg:font-[500] py-4'>
             {t('Please_answer_the_phone_to_enjoy_a_quick_shopping_experience')}
            </p>
          </div>
          <div className="w-full lg:w-[46%] pt-12">
            <div className="w-full border-[1px] border-[#f0f2f6] rounded-lg px-6 lg:px-8 py-6 lg:py-12 shadow-lg bg-white cairo-family">
              <p className='bg-[#f4f5f7] py-2 rounded-lg px-2 text-[#191e2a] font-[600] lg:font-[700] text-[18px]'>{t('Application_Summary')}</p>
              <div className="py-6 flex justify-between items-center">
                <div className="flex items-center text-[#191e2a] gap-4">
                  <Image unoptimized className='w-[68px] h-[68px] border-[1px] border-[#d6dce9] rounded-[6px] overflow-hidden shadow-lg object-cover' src={CartImage} alt="cart image" />
                  <p className='text-[16px] font-[600] uppercase'>{orderData.order_products[0].product_name} </p>
                </div>
                <p className='text-[16px] font-[600] uppercase text-end'>{orderData.order_total_amount}  {storeSettings.currency_code}</p>
              </div>
              <p className='bg-[#f4f5f7] py-2 rounded-lg px-2 text-[#191e2a] font-[600] lg:font-[700] text-[18px]'>{t('Invoice_Summary')}</p>
              <div className="flex items-center justify-between pt-4">
                <p className='text-[15px] font-[500] text-[#57637a]'>{t('Customer_Name')}</p>
                <p className='text-[16px] font-[600] text-end'>{orderData.customer_name}</p>
              </div>
              <div className="flex items-center justify-between pt-3">
                <p className='text-[15px] font-[500] text-[#57637a]'>{t('Shipping_and_handling')}</p>
                <p className='text-[16px] font-[600] text-end'>
                  {orderTotal < freeShippingLimit
                    ? `${shippingAmount} ${storeSettings?.currency_code}`
                    : 'Free'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3">
                <p className='text-[15px] font-[500] text-[#57637a]'>{t('Discount_coupon')}</p>
                <p className='text-[16px] font-[600] text-end'>N/A</p>
              </div>
              <div className="border-b-[1px] border-b-[#d6dce9] my-3"></div>
              <div className="flex items-center justify-between pt-3">
                <p className='text-[18px] font-[400] text-[#57637a]'>{t('Total_amount')}</p>
                <p className='text-[23px] font-[600] text-end'>{orderData?.order_total_amount}  {storeSettings?.currency_code}</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 felx-wrap pt-4">
              <div className="flex items-center gap-1">
                <AiOutlineMail className='text-[#57637a] text-xl' />
                <p className='text-[#57637a] text-[17px]'>{storeSettings?.store_email}</p>
              </div>
              <div className="flex items-center gap-1">
                <IoCallOutline className='text-[#57637a] text-xl' />
                <p className='text-[#57637a] text-[17px]'>{storeSettings?.store_mobile}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessContent;
