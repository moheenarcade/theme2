"use client"
import React, { useEffect, useState, useRef } from 'react';
import { getProductBySlug, getSettings, getCityState } from "../../../../../../lib/api";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { FiPlus } from "react-icons/fi";
import { LuMinus } from "react-icons/lu";
import { FaCartShopping, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import Link from 'next/link';
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const getCustomStyles = (formErrors, field) => ({
    control: (provided, state) => ({
        ...provided,
        border: formErrors[field]
            ? "2px solid red"
            : state.isFocused
                ? "2px solid #9dd675"
                : "2px solid #9dd675",
        boxShadow: state.isFocused ? "0 0 0 4px rgba(209, 213, 219, 0.5)" : "none",
        borderRadius: "0.2rem",
        padding: "2px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            borderColor: state.isFocused ? "#9dd675" : "#9dd675",
        },
        backgroundColor: "white",
    }),
});

const CartForm = ({ product_sku }) => {
    const [showSummary, setShowSummary] = useState(true);
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [mobileCode, setMobileCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const router = useRouter();
    const [product, setProduct] = useState(null);
    console.log(mobileCode, " product detail in product cartform section pl3 ")
    const [quantity, setQuantity] = useState(1);
    const [isBundleChecked, setIsBundleChecked] = useState(false);
    const [selectedBundleIndex, setSelectedBundleIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [settings, setSettings] = useState({});
    const formContainerRef = useRef(null);
    const [currencyCode, setCurrencyCode] = useState("OMR");
    const [states, setStates] = useState([]);
    const [formValues, setFormValues] = useState({
        fullName: "",
        phone: "",
        address: "",
    });
    const formRefs = {
        fullName: useRef(null),
        phone: useRef(null),
        state: useRef(null),
        city: useRef(null),
        address: useRef(null),
    };

    const handleBundleChange = (index) => {
        setSelectedBundleIndex(index);
        const selectedDiscount = product?.discount_prices?.[index];
        if (selectedDiscount?.quantity) {
            setQuantity(selectedDiscount.quantity);
        }
    };
    const toggleBundleCheckbox = () => {
        setIsBundleChecked((prev) => !prev);
    };
    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };
    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    useEffect(() => {
        const storeSettingRaw = localStorage.getItem("storeSettings");
        if (storeSettingRaw) {
            try {
                const storeSetting = JSON.parse(storeSettingRaw);
                if (storeSetting?.currency_code) {
                    setCurrencyCode(storeSetting.currency_code);
                }
                if (storeSetting?.mobile_code) {
                    setMobileCode(storeSetting.mobile_code
                    );
                }
            } catch (err) {
                console.error("Failed to parse storeSetting from localStorage", err);
            }
        }
    }, []);


    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await getProductBySlug(product_sku);
                if (!data) {
                    router.push("/not-found");
                    return;
                }
                setProduct(data.data);
            } catch (err) {
                console.error("Failed to fetch product:", err);
                router.push("/not-found");
            } finally {
                setLoading(false);
            }
        }
        if (product_sku) {
            fetchProduct();
        }
    }, [product_sku]);


    const hasDiscountPrice = product?.discount_prices?.length > 0 &&
        product.discount_prices.some(dp => dp.price && dp.price !== '0' && dp.price !== '0.00' && dp.price !== null && dp.price !== '');

    const getValidPrice = (prices) => {
        return [prices?.offer_price, prices?.sale_price, prices?.price]
            .map(p => parseFloat(p))
            .find(p => !isNaN(p) && p > 0) || 0;
    };

    const selectedPrice = hasDiscountPrice && product?.discount_prices?.[selectedBundleIndex]
        ? parseFloat(product.discount_prices[selectedBundleIndex].price)
        : getValidPrice(product?.prices?.[0] || {});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settingsData = await getSettings();
                setSettings(settingsData);
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                setLoading(true);
                const data = await getCityState();
                console.log("Fetched states:", data);
                setStates(data.data || []);
            } catch (err) {
                console.error("Failed to fetch states", err);
            } finally {
                setLoading(false);
            }
        };

        if (settings.data?.country_id) {
            fetchStates();
        }
    }, [settings.data?.country_id]);


    const fetchCitiesByState = async (stateId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/store/city/areas/${stateId}`
            );
            const result = await response.json();
            const cities = result.data.map((city) => ({
                value: city.id,
                label: language === 'ar' ? city.name_ar?.trim() : city.name?.trim(),
            }));
            setCityOptions(cities);
            setSelectedCity(null);
        } catch (err) {
            console.error("Error fetching cities:", err);
            setCityOptions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedState?.value) {
            fetchCitiesByState(selectedState.value);
        }
    }, [selectedState]);
    const mobileLength = settings?.mobile_length || 9;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            if (!/^\d*$/.test(value)) return;
            const maxLength = settings?.mobile_length || 9;
            const trimmed = value.slice(0, maxLength);
            setFormValues((prev) => ({ ...prev, [name]: trimmed }));
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
            return;
        }
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const errors = {};
        if (!formValues.fullName.trim()) errors.fullName = t('Yourfull_name');
        if (!formValues.phone.trim()) {
            errors.phone = t('Phone_Number');
        } else if (formValues.phone.length < mobileLength) {
            errors.phone = `Phone number must be ${mobileLength} digits`;
        }
        if (!selectedState) errors.state = t('Select_a_state');
        if (!selectedCity) errors.city = t('Select_a_City');
        if (!formValues.address.trim()) errors.address = t('Your_complete_delivery_address');

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            formRefs[firstErrorKey]?.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            setIsSubmitting(false);
            return;
        }

        const payload = {
            customer_name: formValues.fullName,
            customer_mobile: `${settings.mobile_code || ""}${formValues.phone}`,
            customer_address: formValues.address,
            customer_city_id: selectedState?.value,
            customer_city_name: selectedState?.label,
            customer_area_id: selectedCity?.value,
            customer_area_name: selectedCity?.label,
            product_id: product.product_id,
            product_name: product.name,
            product_option_id: product?.options?.[0]?.product_option_id,
            product_option_label: product?.options?.[0]?.option_label,
            product_option_color: product?.product_colors?.[0]?.color || "",
            product_sku: product?.product_sku,
            product_price: selectedPrice,
            product_quantity: quantity,
            total_price: selectedPrice * quantity
        };

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/store/place/order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to place order");
            }

            const result = await res.json();
            console.log("Order placed successfully:", result);
            if (result.success) {
                const orderId = result.order_id;
                toast.success("Order placed successfully!");
                setFormValues({
                    fullName: "",
                    email: "",
                    phone: "",
                    address: "",
                });
                setSelectedState(null);
                setSelectedCity(null);
                setTimeout(() => {
                    router.push(`/pl3/success?orderId=${orderId}`);
                }, 2000);
            } else {
                toast.error(result.error || result.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer className="z-[99999999999999999999]"/>
            <div className='container mx-auto px-0 lg:px-100 pt-6 pb-6'>
                <div className="cart-form-main border-[2px] border-[#3cc150] p-2 rounded-md" id="cartForm" ref={formContainerRef}>
                    <h1 className='text-center py-4 text-2xl'>{t('Add_your_information_below')}</h1>
                    <form className='flex flex-col gap-2 lg:gap-4' onSubmit={handleSubmit}>
                        <div className="grid grid-flow-row grid-cols-2 gap-2 lg:gap-4">
                            <div className="">
                                <input className={`w-full border-[2px]  py-2 px-4 rounded-sm ${formErrors.fullName ? "border-red-500" : "border-[#9dd675]"
                                    } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-900 focus:shadow-lg`}
                                    type="text"
                                    name="fullName"
                                    value={formValues.fullName}
                                    onChange={handleInputChange}
                                    placeholder={t('Yourfull_name') || 'Your Full Name'}
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <div
                                    className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                                    ref={formRefs.phone}
                                >
                                    <input
                                        readOnly
                                        type="tel"
                                        name="code"
                                        value={`+${mobileCode || ''}`}
                                        className={`${language === 'ar' ? "border-l-[2px] border-r-0  rounded-l-sm " : "border-l-lg border-r-0 rounded-l-sm"} w-[60px] border-[#9dd675] border-[2px]  outline-none text-center items-center`}
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border-2 ${formErrors.phone ? 'border-red-500' : 'border-[#9dd675]'
                                            } focus:outline-none focus:shadow-lg 
      ${language === 'ar' ? 'rounded-l-0 rounded-r-sm' : 'rounded-r-sm'}`}
                                        placeholder={t('Phone_Number')}
                                    />
                                </div>
                                {formErrors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                )}
                            </div>
                            <div className="" ref={formRefs.state}>
                                <Select
                                    className="select-state"
                                    styles={getCustomStyles(formErrors, "state")}
                                    options={states.map((state) => ({
                                        value: state.id,
                                        label: language === 'ar' ? state.name_ar?.trim() : state.name?.trim(),
                                    }))}
                                    placeholder={t('Select_a_state')}
                                    value={selectedState}
                                    onChange={(option) => {
                                        setSelectedState(option);
                                        setFormErrors((prev) => ({ ...prev, state: "" }));
                                    }}
                                    isDisabled={loading || !states.length}
                                    isLoading={loading}
                                />
                                {formErrors.state && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                                )}
                            </div>

                            <div className="" ref={formRefs.city}>
                                <Select
                                    className="select-zone"
                                    styles={getCustomStyles(formErrors, "city")}
                                    options={cityOptions}
                                    placeholder={t('Select_a_City')}
                                    value={selectedCity}
                                    onChange={(option) => {
                                        setSelectedCity(option);
                                        setFormErrors((prev) => ({ ...prev, city: "" }));
                                    }}
                                    isDisabled={!selectedState || loading}
                                    isLoading={loading}
                                />
                                {formErrors.city && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                                )}
                            </div>
                        </div>
                        <div className="" ref={formRefs.address}>
                            <textarea
                                name="address"
                                value={formValues.address}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 rounded-sm border-2 ${formErrors.address ? "border-red-500" : "border-[#9dd675]"
                                    } focus:outline-none focus:ring-1 focus:shadow-lg`}
                                rows={3}
                                placeholder={t('Your_complete_delivery_address')}
                            />
                            {formErrors.address && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                            )}
                        </div>
                        <div className="productPrices">
                            <div className="">

                                <div className="bundlePrcie bg-[#f0f9ff] px-2 py-3 rounded-sm flex flex-col gap-2">
                                    {!hasDiscountPrice && (
                                        <div className="onlyPrice">
                                            <div className="flex gap-2 flex-row items-center text-2xl">
                                                {/* Main price to show: offer_price > sale_price > price (non-zero only) */}
                                                <p className="text-[#3cc150] sale_price font-[500]">
                                                    {getValidPrice(product?.prices?.[0])} {currencyCode}
                                                </p>

                                                {/* Line-through only if original price is greater than displayed price and > 0 */}
                                                {product?.prices?.[0]?.price > 0 &&
                                                    product?.prices?.[0]?.price !==
                                                    [
                                                        product?.prices?.[0]?.offer_price,
                                                        product?.prices?.[0]?.sale_price,
                                                        product?.prices?.[0]?.price,
                                                    ].find((p) => p > 0) && (
                                                        <p className="text-[#3cc150] price font-[500] line-through">
                                                            {product?.prices?.[0]?.price} {currencyCode}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {product?.discount_prices?.map((discount, index) => (
                                        <div
                                            key={index}
                                            className="singlBundlePrice cursor-pointer bg-white hover:scale-[1.02] transition-all duration-[0.3s] ease-in-out"
                                            onClick={() => handleBundleChange(index)}
                                        >
                                            <div
                                                className={`flex justify-between items-center w-full border-[2px] py-2 md:py-3 px-4 rounded-sm ${selectedBundleIndex === index ? "border-[#3cc150]" : "border-[#9dd675]"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-1 md:gap-2">
                                                    <div className="checkbox-wrapper-46">
                                                        <input
                                                            type="checkbox"
                                                            id={`bundleCheckbox-${index}`}
                                                            className="inp-cbx"
                                                            checked={selectedBundleIndex === index}
                                                            onChange={() => handleBundleChange(index)}
                                                        />
                                                        <label htmlFor={`bundleCheckbox-${index}`} className="cbx">
                                                            <span>
                                                                <svg viewBox="0 0 12 10" height="10px" width="12px">
                                                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                </svg>
                                                            </span>
                                                            <span className="text-lg text-[#404040]">
                                                                {discount.quantity === 1
                                                                    ? t('I_only_want_one')
                                                                    : `${t('Buy')} ${discount.quantity} ${t('pices')}`}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-0 md:gap-2 md:flex-row items-center text-[16px] md:text-[17px]">
                                                    <p className="text-[#3cc150] font-[500]">
                                                        {discount.price} {currencyCode}
                                                    </p>
                                                    {product?.prices?.[0]?.price && (
                                                        <p className="text-[#3cc150] font-[500] line-through">
                                                            {product?.prices?.[0]?.price} {currencyCode}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                            <div className="product-cart flex flex-col-reverse md:flex-row justify-between items-center py-6 gap-4">
                                <button type="submit" className='bg-[#3cc150] h-[48px] text-lg w-full text-white py-3 px-2 rounded-sm cursor-pointer'>
                                   {t('Click_here_to_confirm_your_order')}
                                </button>
                                <div className="cart-btn w-full md:w-fit flex items-center border-[2px] rounded-sm h-[48px] border-[#3cc150]">
                                    <button
                                        type="button"
                                        onClick={handleDecrement}
                                        className={`py-3 px-10 md:px-4 h-full text-center cursor-pointer text-xl ${language === "ar" ? "border-l-[2px] border-l-[#3cc150]" : "border-r-[2px] border-r-[#3cc150]"}`}
                                    >
                                        <LuMinus />
                                    </button>
                                    <input
                                        className='text-center text-xl w-full md:w-[60px] outline-0 h-full'
                                        type="text"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button
                                        type="button"
                                        onClick={handleIncrement}
                                        className={`py-3 px-10 md:px-4 h-full text-center cursor-pointer text-xl ${language === "ar" ? "border-r-[2px] border-r-[#3cc150]" : "border-l-[2px] border-l-[#3cc150]"} `}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="cart-status bg-[#f0f9ff] px-3 py-3 rounded-sm mb-4">
                                <div
                                    className="tabs flex items-center justify-between cursor-pointer"
                                    onClick={() => setShowSummary(!showSummary)}
                                >
                                    <div className="flex items-center gap-2">
                                        <FaCartShopping className='text-xl text-[#9dd675]' />
                                        <h2 className='text-lg text-[#404040]'>{t('Order_summary')}</h2>
                                    </div>
                                    {showSummary ? (
                                        <FaChevronUp className='text-2xl text-[#9dd675]' />
                                    ) : (
                                        <FaChevronDown className='text-2xl text-[#9dd675]' />
                                    )}
                                </div>
                                <div
                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${showSummary ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                                        } tab-info border-t-[2px] border-t-[#9dd675]`}
                                >
                                    <div className="py-3">
                                        <div className="flex items-center justify-between border-dashed border-b-[#9dd675] border-b-[2px] pb-2">
                                            <div className="text-lg text-[#404040] w-[180px] line-clamp-1">
                                            <p>{language === "ar" ? product?.name_ar : product?.name || "N/A"}</p>
                                            </div>
                                            <div className="flex items-center text-lg text-[#404040] w-[180px]">
                                                <p className={` flex text-white bg-[#3cc150] px-2 rounded-sm ${language === "ar" ? "ml-2" : "mr-2"}`}>x {quantity}</p>
                                                <p>
                                                    {selectedPrice} {currencyCode}
                                                </p>
                                            </div>
                                            <p className='hidden md:block'></p>
                                        </div>
                                        <div className="flex items-center justify-between border-dashed border-b-[#9dd675] border-b-[2px] py-2">
                                            <div className="text-lg text-[#404040] w-[180px]">
                                                <p>{t('Delivery_price')}</p>
                                            </div>
                                            <div className="flex items-center text-lg text-[#404040] w-[180px]">
                                                <p>{t('Free')}</p>
                                            </div>
                                            <p className='hidden md:block'></p>
                                        </div>
                                        <div className="flex items-center justify-between border-dashed border-b-[#9dd675] border-b-[2px] py-2">
                                            <div className="text-lg text-[#404040] w-[180px]">
                                                <p>{t('Total_price')}</p>
                                            </div>
                                            <div className="flex items-center text-lg text-[#404040] w-[180px]">
                                                <p>{(selectedPrice * quantity).toFixed(2)} {currencyCode}</p>
                                            </div>
                                            <p className='hidden md:block'></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="fixed buy-now-bottom z-[999999] bottom-0 w-full py-3 bg-[#fff] border-[#e0e0e0] border-[1px] flex justify-center items-center">
                <Link href="#cartForm" className='shake-loop text-center bg-[#3cc150] text-white rounded-sm py-3 px-6 w-[240px] cursor-pointer hover:scale-[1.02] transition-all duration-[0.3s] ease-in-out'>
                   {t('Buy_now')}
                </Link>
            </div>
        </>
    )
}

export default CartForm;
