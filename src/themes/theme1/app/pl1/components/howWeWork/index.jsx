import React from 'react'
import { TiMessages } from "react-icons/ti";
import { GrDeliver } from "react-icons/gr";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GiCash } from "react-icons/gi";
import { useTranslation } from "../../hooks/useTranslation";

const HowWeWork = () => {
  const { t } = useTranslation();

    return (
        <div className='container mx-auto cairo-family px-6 lg:px-20 xl:px-62 lg:mt-[300px] xl:mt-[80px] 2xl:mt-[240px] pb-12 lg:pb-20'>
            <h3 className='text-3xl lg:text-4xl text-[#191e2a] text-center font-[700] lg:font-[500] mt-4 cairo-family'>{t('How_we_work')}</h3>
            <p className='text-center text-md lg:text-xl text-[#57637a] pt-2 cairo-family'>{t('To_avoid_any_problems_in_processing')}</p>

            <div className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-12">
                <div className="work-card flex flex-col items-center rounded-lg overflow-hidden shadow-sm p-6 w-full  md:w-[45%]">
                    <GiCash className='text-5xl' />
                    <p className='text-xl font-[700] py-2 text-center text-[#191e2a]'>{t('We_ship_the_order_to_you')}
                    </p>
                    <p className='text-center text-md md:text-lg text-[#57637a] line-clamp-4'>
                        {t('After_confirming_the_order')}
                    </p>
                </div>
                <div className="work-card flex flex-col items-center rounded-lg overflow-hidden shadow-sm p-6 w-full  md:w-[45%]">
                    <GiCash className='text-5xl' />
                    <p className='text-xl font-[700] py-2 text-center text-[#191e2a]'>{t('You_order')}
                    </p>
                    <p className='text-center text-md md:text-lg text-[#57637a] line-clamp-4'>
                        {t('Order_the_quantity_you_want')}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default HowWeWork;
