"use client"
import React, { useEffect, useState } from 'react'
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";

const BundleSave = ({ product, currencyCode, t, onSelectionChange ,getSetting }) => {
    const { language } = useLanguage();
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (product?.discount_prices?.length > 0) {
            setSelectedOption(product.discount_prices[0]);
            if (onSelectionChange) {
                onSelectionChange(product.discount_prices[0]);
            }
        }
    }, [product]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        if (onSelectionChange) {
            onSelectionChange(option);
        }
    };

    // console.log(selectedOption, "selected option in bundle component");
    return (

        <div className="">
            <div className="bundlessave flex items-center justify-center my-4">
                <div className="w-full h-[2px] bg-black"></div>
                <p className="font-[600] w-full text-[14px] uppercase text-center px-2">
                    {t('bundle_save')}
                </p>
                <div className="w-full h-[2px] bg-black"></div>
            </div>

            {product?.discount_prices?.map((discPrice , index) => (
                <div
                    key={discPrice.price}
                    onClick={() => handleOptionSelect(discPrice)}
                    className={`singlePrice relative mb-3 cursor-pointer flex items-center gap-2 py-1 md:py-3 px-2 rounded-xl border-[2px] transition-all duration-300 ease-in-out ${selectedOption?.quantity === discPrice.quantity ? 'border-black bg-gray-200' : 'border-gray-300 bg-gray-100'}`}
                >
                    <div className="checkbox w-fit">
                        <input
                            className="hidden"
                            type="radio"
                            checked={selectedOption?.quantity === discPrice.quantity}
                            readOnly
                            name="priceOption"
                        />
                        <div className={`w-[15px] h-[15px] rounded-full ${selectedOption?.quantity === discPrice.quantity ? 'bg-black' : 'bg-gray-300'}`}></div>
                    </div>
                    {product.discount_prices.length > 1 && index === 1 && (
                        <div className={`absolute z-[99999] rotate-2 md:rotate-4 bottom-0 md:bottom-2 bg-black text-white text-[10px] md:text-sm font-bold px-2 py-1 rounded ${language === "ar" ? "-left-2" : "-right-2"} `}>
                            {t('Most_Popular')}
                        </div>
                    )}
                    <div className={`flex flex-col w-full md:border-l-0 pl-2 md:pl-0 ${language === "ar" ? "border-r-[1px] pr-2" : "border-l-[1px]"} `}>
                        <div className="flex justify-between">
                            <p className="font-[600]">{t('Buy')} {discPrice.quantity}</p>
                            <p className="font-[600]">
                                {discPrice.price} {currencyCode}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            {Number(discPrice.price) >= 15 ? (
                                <p className="font-[300] text-[12px] md:text-[16px]">
                                    + {t('Free_Shipping_Included')}
                                </p>
                            ) : (
                                <p className="font-[300] text-[12px] md:text-[16px]">
                                    + {t('Shipping_fee_is')} {getSetting?.shipping_amount} {currencyCode}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

    )
}

export default BundleSave;
