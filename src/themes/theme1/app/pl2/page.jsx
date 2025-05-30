"use client";
import { useEffect, useState } from "react";
import HeroSlider from './components/heroSlider/index';
import ProductHeadings from "./components/productHeadings/index";
import PolicyService from "./components/policyService";
import ProductTabInfo from "./components/productTabInfo";
import BuyNowModal from "./components/buyNowFormpl2"
import { getProducts } from "../../../../lib/api";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";

const Home = () => {
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currencyCode, setCurrencyCode] = useState("OMR");
    console.log(products, "product in pl2")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProducts(data.data || []);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <Laoder />
    //         </div>
    //     );
    // }
    useEffect(() => {
        const storeSettingRaw = localStorage.getItem("storeSettings");
        if (storeSettingRaw) {
            try {
                const storeSetting = JSON.parse(storeSettingRaw);
                if (storeSetting?.currency_code) {
                    setCurrencyCode(storeSetting.currency_code);
                }
            } catch (err) {
                console.error("Failed to parse storeSetting from localStorage", err);
            }
        }
    }, []);


    // Check if there's a valid sale price
    const hasValidSalePrice = products[0]?.prices?.[0]?.sale_price > 1 &&
        products[0]?.prices?.[0]?.sale_price < products[0]?.prices?.[0]?.price;


    return (
        <div className='max-w-[640px] mx-auto pt-12 overflow-hidden'>
            <HeroSlider products={products} />
            <ProductHeadings product_sku={products[0]?.product_sku} />
            <PolicyService product_sku={products[0]?.product_sku} />
            <ProductTabInfo product_sku={products[0]?.product_sku} />
            <BuyNowModal product_sku={products[0]?.product_sku} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className='bg-[#362e2b] max-w-[640px] mx-auto px-[10px] py-[6px] mx-h-[60px] w-full z-[999] fixed bottom-0 '>
                <div className="flex justify-between">
                    <button onClick={() => setIsModalOpen(true)} className='bg-[#f39800] buy-it-nowbtn font-[500] hover:scale-[1.05] text-[#fff] px-4 text-[18px] md:text-[20px] h-[48px] w-[40%] md:w-[45%] rounded-lg cursor-pointer transition-all duration-[0.5s] ease-in-out'>
                        {t('Buy_it_now')}
                    </button>

                    <div className="price flex items-center gap-1 md:gap-4">
                        {hasValidSalePrice ? (
                            <>
                                <p className='text-[#f39800] font-[600] main-price text-[20px] md:text-[1.75rem]'>
                                    {products[0]?.prices?.[0]?.sale_price} {currencyCode}
                                </p>
                                <p className='line-through off-price text-[#c2c2c2]'>
                                    {products[0]?.prices?.[0]?.price} {currencyCode}
                                </p>
                            </>
                        ) : (
                            <p className='text-[#f39800] font-[600] main-price text-[20px] md:text-[1.75rem]'>
                                {products[0]?.prices?.[0]?.price || 'N/A'} {currencyCode}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home;
