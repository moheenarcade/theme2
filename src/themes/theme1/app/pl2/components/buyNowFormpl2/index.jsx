
"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";
import { getProductBySlug, getSettings, getCityState } from "../../../../../../lib/api";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const getCustomStyles = (formErrors, field) => ({
    control: (provided, state) => ({
        ...provided,
        border: formErrors[field]
            ? "2px solid #f87171"
            : state.isFocused
                ? "2px solid #1a1a1a"
                : "2px solid #838383",
        boxShadow: state.isFocused ? "0 0 0 4px rgba(209, 213, 219, 0.5)" : "none",
        borderRadius: "0.5rem",
        padding: "2px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            borderColor: state.isFocused ? "#1a1a1a" : "#838383",
        },
        backgroundColor: "white",
    }),
});

const BuyNowModal = ({ isOpen, onClose, product_sku }) => {
    if (!isOpen) return null;
    const { t } = useTranslation();
    const router = useRouter();
    const { language, toggleLanguage } = useLanguage();
    const [mobileCode, setMobileCode] = useState("");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currencyCode, setCurrencyCode] = useState("OMR");
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [settings, setSettings] = useState({});
    const formContainerRef = useRef(null);
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
    }, [product_sku, isOpen]);

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

    const getDisplayPrice = () => {
        const priceObj = product?.prices?.[0];
        if (!priceObj) return null;
        const salePrice = parseFloat(priceObj.sale_price);
        const regularPrice = parseFloat(priceObj.price);

        if (!isNaN(salePrice) && salePrice > 0) return salePrice;
        if (!isNaN(regularPrice)) return regularPrice;

        return null;
    };

    const displayPrice = getDisplayPrice();
    const shippingFee = displayPrice && displayPrice < 25 ? 1.5 : 0;
    const grandTotal = displayPrice ? (displayPrice + shippingFee).toFixed(2) : null;

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                console.log("Fetched settings:", data);
                setSettings(data.data || {});
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

        if (settings.country_id) {
            fetchStates();
        }
    }, [settings.country_id]);


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

    console.log(product, "sku data in form ")
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const errors = {};
        if (!formValues.fullName.trim()) errors.fullName = t('Your_Full_Name');
        if (!formValues.phone.trim()) {
            errors.phone = t('Your_Phone');
        } else if (formValues.phone.length < mobileLength) {
            errors.phone = `Phone number must be ${mobileLength} digits`;
        }
        if (!selectedState) errors.state = t('Select_a_state');
        if (!selectedCity) errors.city = t('Select_a_city');
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
            product_price: displayPrice,
            product_quantity: 1,
            total_price: displayPrice
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
                    router.push(`/pl2/success?orderId=${orderId}`);
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
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-[1000]">
            <ToastContainer />
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                <div className="flex justify-between items-center mb-2 border-b-gray-300 border-b-[1px] pb-3">
                    <h2 className="text-xl font-bold">{t('Cash_on_Delivery')}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {product && (
                    <div className="bg-gray-100 p-3 rounded-md mb-4">
                        <div className="flex justify-between">
                            <p className="text-[15px]">{t('Price')} :</p>
                            <p className="font-[600] text-[15px]">
                                {displayPrice !== null ? `${displayPrice} ${currencyCode}` : "Price Not Added"}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-[15px]">{t('Subtotal')} :</p>
                            <p className="font-[600] text-[15px]">
                                {displayPrice !== null ? `${displayPrice} ${currencyCode}` : "Price Not Added"}
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-[15px]">{t('Free_Shipping')} :</p>
                            <p className="font-[600] text-[15px]">
                                {shippingFee > 0 ? `${shippingFee} ${currencyCode}` : t('Free')}
                            </p>
                        </div>
                        <div className="flex justify-between border-t-[1px] border-t-gray-300 pt-2 mt-2">
                            <div className="flex justify-between w-full">
                                <p className="font-[600] text-[15px]">{t('Grand_Total')} :</p>
                                <p className="font-[600] text-[15px]">
                                    {grandTotal !== null ? `${grandTotal} ${currencyCode}` : "Price Not Added"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <div className="" ref={formContainerRef}>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="mb-2 lg:mb-3" ref={formRefs.fullName}>
                            <input
                                name="fullName"
                                value={formValues.fullName}
                                onChange={handleInputChange}
                                placeholder={t('Yourfull_name') || 'Your Full Name'}
                                className={`w-full px-3 py-2 rounded-lg border-2 ${formErrors.fullName ? "border-red-500" : "border-[#838383]"
                                    } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-900 focus:shadow-lg`}
                                type="text"

                            />
                            {formErrors.fullName && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                            )}
                        </div>

                        <div className="mb-2 lg:mb-3 flex flex-col">
                            <div
                                className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''}`}
                                ref={formRefs.phone}
                            >
                                <input
                                    readOnly
                                    type="tel"
                                    name="code"
                                    value={`+${settings.mobile_code || ''}`}
                                    className={`${language === 'ar' ? "border-l-[2px] border-r-0  rounded-l-lg " : "border-l-lg border-r-0 rounded-l-lg"} w-[60px] border-[#838383] border-[2px]  outline-none text-center items-center`}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formValues.phone}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border-2 ${formErrors.phone ? 'border-red-500' : 'border-[#838383]'
                                        } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-900 focus:shadow-lg 
      ${language === 'ar' ? 'rounded-l-0 rounded-r-lg' : 'rounded-r-lg'}`}
                                    placeholder={t('Phone_Number')}
                                />
                            </div>
                            {formErrors.phone && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                            )}
                        </div>
                        <div className="mb-2 lg:mb-3" ref={formRefs.state}>
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

                        <div className="mb-2 lg:mb-3" ref={formRefs.city}>
                            <Select
                                className="select-zone"
                                styles={getCustomStyles(formErrors, "city")}
                                options={cityOptions}
                                placeholder={t('city')}
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
                        <div className="mb-2 lg:mb-3" ref={formRefs.address}>
                            <textarea
                                name="address"
                                value={formValues.address}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 rounded-lg border-2 ${formErrors.address ? "border-red-500" : "border-[#838383]"
                                    } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-900 focus:shadow-lg`}
                                rows={3}
                                placeholder={t('Your_complete_delivery_address')}
                            />
                            {formErrors.address && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                            )}
                        </div>

                        <div className="flex justify-center pt-2 px-2">
                            <button type="submit" className="px-4 py-2 cursor-pointer w-full bg-black text-white rounded-md flex items-center justify-center gap-2 hover:bg-gray-800">
                                {t('Order_Now')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BuyNowModal;
