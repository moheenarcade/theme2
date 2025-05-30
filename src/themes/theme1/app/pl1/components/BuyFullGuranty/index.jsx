import React from 'react'
import { TiMessages } from "react-icons/ti";
import { GrDeliver } from "react-icons/gr";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GiCash } from "react-icons/gi";
import { useTranslation } from "../../hooks/useTranslation";

const BuyFullGurenty = () => {
  const { t } = useTranslation();

    return (
        <div className='relative py-12 mx-6'>
            <div className="bg-[#764202] rounded-xl h-[350px] md:h-[430px] xl:h-[350px] absolute z-[-1] w-full"></div>
            <div className="container pt-8 lg:pt-18 mx-auto px-0 lg:px-20 xl:px-62">
                <div className="pb-8 lg:pb-12">
                    <h2 className='text-[25px] lg:text-lg text-white text-center font-[700] lg:font-normal cairo-family uppercase'>{t('Why_With_Us')} ?</h2>
                    <h3 className='px-12 lg:px-0 text-[25px] lg:text-4xl text-white text-center font-[700] lg:font-[500] lg:mt-4 cairo-family'>{t('Buy_with_full_guarantees')}</h3>
                </div>
                <div className="bg-white mx-6 lg:mx-0 px-4 lg:px-12 xl:px-6 2xl:px-12 py-6 xl:py-6 2xl:py-12 lg:py-20 rounded-lg lg:-mb-[300px] xl:mb-[-180px] 2xl:-mb-[200px] shadow-lg">
                    <div className="flex md:gap-6 xl:gap-0 flex-wrap justify-between cairo-family">
                        <div className="flex flex-col items-center md:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-2 lg:p-6 w-full  md:w-[48%] xl:w-[22%]">
                            <TiMessages className='text-5xl xl:text-3xl 2xl:text-5xl text-[#191e2a]' />
                            <p className='text-lg xl:text-md 2xl:text-lg text-center font-[600] py-2 text-[#191e2a]'>{t('Customer_Service')}</p>
                            <p className='text-center tex-sm xl:text-[13px] 2xl:text-sm text-[#57637a] line-clamp-3'>{t('We_offer_you_the_opportunity')}
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-2 lg:p-6 w-full  md:w-[48%] xl:w-[22%]">
                            <GrDeliver className='text-5xl xl:text-3xl 2xl:text-5xl text-[#191e2a]' />
                            <p className='text-lg xl:text-md 2xl:text-lg text-center font-[600] py-2 text-[#191e2a]'>{t('Free_delivery')}</p>

                            <p className='text-center tex-sm xl:text-[13px] 2xl:text-sm text-[#57637a] line-clamp-4'>
                                {t('Enjoy_free_express_delivery')}
                            </p>
                        </div> <div className="flex flex-col items-center md:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-2 lg:p-6 w-full  md:w-[48%] xl:w-[22%]">
                            <RiSecurePaymentLine className='text-5xl xl:text-3xl 2xl:text-5xl text-[#191e2a]' />
                            <p className='text-lg xl:text-md 2xl:text-lg text-center font-[600] py-2 text-[#191e2a]'>100% {t('guarantee')}</p>
                            <p className='text-center tex-sm xl:text-[13px] 2xl:text-sm text-[#57637a] line-clamp-4'>
                               {t('This_product_after_its_global')}
                            </p>
                        </div> <div className="flex flex-col items-center md:border border-gray-200 rounded-lg overflow-hidden lg:shadow-sm p-2 lg:p-6 w-full  md:w-[48%] xl:w-[22%]">
                            <GiCash className='text-5xl xl:text-3xl 2xl:text-5xl text-[#191e2a]' />
                            <p className='text-lg xl:text-md 2xl:text-lg text-center font-[600] py-2 text-[#191e2a]'>{t('Cash_on_delivery')}</p>
                            <p className='text-center tex-sm xl:text-[13px] 2xl:text-sm text-[#57637a] line-clamp-4'>
                               {t('Cash_on_delivery_is_supported')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyFullGurenty;
