'use client';
import Image from 'next/image';
import React from 'react';
import PolicyIcon from "../../../../../../../public/landingpage2Images/secure_transaction.png";
import LowReturn from "../../../../../../../public/landingpage2Images/low_return_product.png";
import CashonDel from "../../../../../../../public/landingpage2Images/cash_on_delivery.png";
import CarDeleviry from "../../../../../../../public/landingpage2Images/delivery_by_noon.png";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

const policies = [
    {
        icon: PolicyIcon,
        textKey: 'secure_transfer',
    },
    {
        icon: LowReturn,
        textKey: 'fast_delivery',
    },
    {
        icon: CashonDel,
        textKey: 'payment_on_receipt',
    },
    {
        icon: CarDeleviry,
        textKey: 'free_shipping',
    },
];

const PolicyService = () => {
    const { language } = useLanguage();
    const { t } = useTranslation();

    return (
        <div className='policy-service-main bg-white px-[10px]'>
            <div className="pb-2">
                <div className="service-policy flex justify-between gap-0">
                    {policies.map((policy, index) => (
                        <div
                            key={index}
                            className={`single-policy flex flex-col justify-center items-center px-1 md:px-2 py-1 relative`}
                        >
                            <div className="icon-box mb-1 p-1">
                                <Image className='w-full h-auto' src={policy.icon} alt='policy icon' />
                            </div>
                            <p className='text-center text-[10px] md:text-[14px] text-[#666]'>{t(policy.textKey)}</p>
                            {index < policies.length - 1 && (
                                <div
                                    className={`absolute top-1/2 -translate-y-1/2 ${language === "ar" ? "-left-1" : "-right-1"}`}
                                    style={{ height: '90%', width: '2px', backgroundColor: '#f3f4f8' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PolicyService;
