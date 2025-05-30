"use client";
import { useEffect, useState, useRef } from "react";
import { getSettings, getCityState } from "../../../../lib/api";
import Select from "react-select";
import Loader from "../../components/loader";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { trackBothEvents } from "../../../../lib/pixelEvents";

const getCustomStyles = (formErrors, field) => ({
    control: (provided, state) => ({
        ...provided,
        borderColor: formErrors[field] ? '#f87171' : state.isFocused ? '#f69853' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(250, 204, 21, 0.8)' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#f69853' : '#d1d5db',
        },
    }),
});

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const BuyForm = ({ product, closeModal, selectedSize, selectedBundle, totalGrandPrice }) => {
    console.log("totalGrandPrice totalGrandPrice in form:", totalGrandPrice);
    const [currencyCode, setCurrencyCode] = useState('');
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const [getSetting, setGetSetting] = useState({});
    const [getState, setGetState] = useState([]);
    const [loading, setLoading] = useState(true);
    const shippingAmount = parseFloat(getSetting?.shipping_amount) || 0;
    const formRef = useRef(null);
    const router = useRouter();
    const [formValues, setFormValues] = useState({
        fullName: "",
        // email: "",
        phone: "",
        address: "",
    });
    // console.log(product, "product data in form ")
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRefs = {
        fullName: useRef(null),
        // email: useRef(null),
        phone: useRef(null),
        state: useRef(null),
        city: useRef(null),
        address: useRef(null),
    };

    const mobileCode = getSetting?.mobile_code || currencyCode;
    const mobileLength = getSetting?.mobile_length || 9;
    console.log(mobileCode, "mobile code ")
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                console.log("Fetched settings:", data);
                setGetSetting(data.data || {});
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const data = await getCityState();
                setGetState(data.data);
            } catch (err) {
                console.error("Failed to fetch states", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStates();
    }, []);

    const fetchCitiesByState = async (stateId) => {
        try {
            const response = await fetch(`${baseUrl}/store/city/areas/${stateId}`);
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
        }
    };

    useEffect(() => {
        if (selectedState?.value) {
            fetchCitiesByState(selectedState.value);
        }
    }, [selectedState]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone" && !/^\d*$/.test(value)) return;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    useEffect(() => {
        const settings = localStorage.getItem('storeSettings');
        if (settings) {
            try {
                const parsedSettings = JSON.parse(settings);
                setCurrencyCode(parsedSettings.currency_code || 'OMR');
            } catch (error) {
                console.error("Failed to parse storeSettings:", error);
            }
        } else {
            console.warn("storeSettings not found in localStorage");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const errors = {};
        if (!formValues.fullName.trim()) errors.fullName = t('Full_name_is_required');
        // if (!formValues.email.trim()) errors.email = t('Email_is_required');
        if (!formValues.phone.trim())
            errors.phone = t('Phone_number_is_required');
        else if (formValues.phone.length < mobileLength)
            errors.phone = `Phone must be ${mobileLength} digits`;

        if (!selectedState) errors.state = t('State_is_required');
        if (!selectedCity) errors.city = t('City_is_required');
        if (!formValues.address.trim()) errors.address = t('Address_is_required');

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            // Scroll to first invalid field
            const firstErrorKey = Object.keys(errors)[0];
            formRefs[firstErrorKey]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            setIsSubmitting(false);
            return;
        }

        try {
            const basePrice = Number(selectedBundle?.price) || (Number(product.prices?.[0]?.sale_price) * (product?.quantity || 1));
            const totalPrice = basePrice < 15 ? basePrice + Number(shippingAmount) : basePrice;

            const payload = {
                customer_name: formValues.fullName,
                // customer_email: formValues.email,
                customer_mobile: `${mobileCode}${formValues.phone}`,
                customer_city_id: selectedState?.value,
                customer_area_id: selectedCity?.value,
                customer_city_name: selectedState?.label,
                customer_area_name: selectedCity?.label,
                customer_address: formValues.address,
                product_id: product?.product_id || 0,
                product_name: product?.name || "",
                product_quantity: selectedBundle?.quantity || product?.quantity || 1,
                product_sku: product?.product_sku || "",
                product_price: selectedBundle?.price || product.prices?.[0]?.sale_price || 0,
                // total_price: selectedBundle?.price || (product.prices?.[0]?.sale_price) * (product?.quantity || 1),
                total_price: totalPrice,
                product_option_color: product.color || '',
                product_option_id: selectedSize?.product_option_id ?? product.options?.[0]?.product_option_id ?? null,
                product_option_label: selectedSize?.option_label ?? product.options?.[0]?.option_label ?? null,
            };

            console.log("Submitting payload:", payload);

            const res = await fetch(`${baseUrl}/store/place/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("API response:", result);

            if (result.success) {
                const orderId = result.order_id;

                // Track Purchase Event (with TikTok-required fields)
                trackBothEvents("Purchase", {
                    content_ids: [product.product_id],
                    content_id: product.product_id,
                    content_name: product.name,
                    content_type: "product",
                    currency: currencyCode,
                    value: selectedBundle?.price || (product.prices?.[0]?.sale_price) * (product?.quantity || 1),
                    quantity: selectedBundle?.quantity || product?.quantity || 1,
                    order_id: orderId,
                    phone: `${mobileCode}${formValues.phone}`,
                });

                toast.success('Order placed successfully!');
                setFormValues({
                    fullName: "",
                    // email: "",
                    phone: "",
                    address: "",
                });
                setSelectedState(null);
                setSelectedCity(null);

                setTimeout(() => {
                    router.push(`/success?orderId=${orderId}`);
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
            <ToastContainer />
            <form className="space-y-3" ref={formRef} onSubmit={handleSubmit}>
                <div className="space-y-3 overflow-y-auto px-2 pt-2">
                    <div ref={formRefs.fullName}>
                        <input
                            type="text"
                            name="fullName"
                            value={formValues.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${formErrors.fullName ? "border-red-500" : "border-gray-300"
                                } rounded-md`}
                            placeholder={t('Yourfull_name')}
                        />
                        {formErrors.fullName && <p className="text-red-500 text-sm">{formErrors.fullName}</p>}
                    </div>

                    <div ref={formRefs.phone}>

                        <div className="flex rounded-md shadow-sm flex-row-reverse rtl:flex-row">
                            {language === "ar" ? (
                                <>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${formErrors.phone ? "border-red-500" : "border-gray-300"} ml-[1px] rounded-r-md`}
                                        placeholder={t('Enter_valid_mobile_number')}
                                        maxLength={mobileLength}
                                    />
                                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                                        {mobileCode}+
                                    </span>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${formErrors.phone ? "border-red-500" : "border-gray-300"} rounded-r-md`}
                                        placeholder={t('Enter_valid_mobile_number')}
                                        maxLength={mobileLength}
                                    />
                                    <span className="inline-flex items-center px-3 border border-l-1 border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                                        +{mobileCode}
                                    </span>
                                </>
                            )}
                        </div>

                        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                    </div>

                    <div ref={formRefs.state}>

                        <Select
                            inputId="selectState"
                            options={getState.map((state) => ({
                                value: state.id,
                                label: language === 'ar' ? state.name_ar?.trim() : state.name?.trim(),
                            }))}
                            placeholder={t('Select_a_state')}
                            value={selectedState}
                            onChange={(option) => {
                                setSelectedState(option);
                                setFormErrors((prev) => ({ ...prev, state: "" }));
                            }}
                            // styles={customStyles}
                            styles={getCustomStyles(formErrors, 'state')}
                            className="mt-2"
                            error={!!formErrors.state}
                        />
                        {formErrors.state && <p className="text-red-500 text-sm">{formErrors.state}</p>}
                    </div>

                    <div ref={formRefs.city}>
                        <Select
                            inputId="selectCity"
                            options={cityOptions}
                            value={selectedCity}
                            onChange={(option) => {
                                setSelectedCity(option);
                                setFormErrors((prev) => ({ ...prev, city: "" }));
                            }}
                            placeholder={t('Select_a_City')}
                            // styles={customStyles}
                            styles={getCustomStyles(formErrors, 'state')}
                            className="mt-2"
                            isDisabled={!selectedState}
                            error={!!formErrors.city}
                        />
                        {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
                    </div>

                    <div ref={formRefs.address}>
                        <textarea
                            name="address"
                            value={formValues.address}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${formErrors.address ? "border-red-500" : "border-gray-300"
                                } rounded-md`}
                            rows={3}
                            placeholder={t('Your_complete_delivery_address')}
                        />
                        {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
                    </div>
                </div>

                <div className="flex justify-center pt-2 px-2">
                    <button
                        type="submit"
                        className={`px-4 py-2 cursor-pointer w-full bg-black text-white rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 ${isSubmitting ? "opacity-70" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="w-5 h-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                    />
                                </svg>
                                {t('Processing')}...
                            </>
                        ) : (
                            t('Order_Now')
                        )}
                    </button>

                </div>
            </form>
        </>
    );
};

export default BuyForm;