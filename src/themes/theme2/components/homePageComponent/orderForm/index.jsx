"use client";
import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { getCityState, getSettings } from "../../../../../lib/api";
import { ToastContainer, toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import Link from 'next/link';
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";
import { trackBothEvents } from "../../../../../lib/pixelEvents";


const getCustomStyles = (formErrors, field) => ({
  control: (provided, state) => ({
    ...provided,
    borderColor: '#592404',
    borderRadius: '0.5rem',
    minHeight: '28px',
    padding: '0px',
    boxShadow: state.isFocused ? '0 0 0 1px #592404' : 'none',
    ':focus': {
      outline: 'none',
    },
    '&:hover': {
      borderColor: '#ccc',
    },
  }),
});


const OrderForm = ({ product, selectedPrice, selectedQuantity }) => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currencyCode, setCurrencyCode] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  console.log(selectedPrice, "produuct in form section selectedPrice")
  const router = useRouter();
  const pathname = usePathname();
  const [states, setStates] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [formValues, setFormValues] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRefs = {
    fullName: useRef(null),
    phone: useRef(null),
    state: useRef(null),
    city: useRef(null),
    address: useRef(null),
  };


  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };
  const formContainerRef = useRef(null);


  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

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

  useEffect(() => {
    if (selectedState?.value) {
      fetchCitiesByState(selectedState.value);
    }
  }, [selectedState]);

  const mobileCode = settings?.mobile_code || currencyCode;
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

  const getProductPrice = () => {
    if (!product) return 0;

    if (selectedPrice && selectedPrice > 0) {
      return parseFloat(selectedPrice);
    }

    const selectedIndex = 0;
    const discountPriceValid =
      product.discount_prices?.length > 0 &&
      product.discount_prices?.[selectedIndex]?.price > 0;

    if (discountPriceValid) {
      return parseFloat(product.discount_prices[selectedIndex].price);
    }

    const regularPrice =
      product.prices?.[0]?.sale_price > 0
        ? product.prices?.[0]?.sale_price
        : product.prices?.[0]?.price;

    return regularPrice ? parseFloat(regularPrice) : 0;
  };

  const isDiscounted = selectedPrice && selectedPrice > 0;
  const unitPrice = getProductPrice();
  const finalQuantity = isDiscounted ? selectedQuantity : quantity;
  const totalPrice = isDiscounted
    ? parseFloat(selectedPrice)
    : unitPrice * quantity;

  const finalTotalPrice = !isDiscounted && totalPrice < 15
    ? totalPrice + 1.5
    : totalPrice;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = {};
    if (!formValues.fullName.trim()) errors.fullName = t('Your_Full_Name');
    // if (!formValues.email.trim()) errors.email = "Email is required";
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
      product_price: unitPrice,
      product_quantity: finalQuantity,
      total_price: finalTotalPrice,
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
        // Track Purchase Event (with TikTok-required fields)
        trackBothEvents("Purchase", {
          content_ids: [product.product_id],
          content_id: product.product_id,
          content_name: product.name,
          content_type: "product",
          currency: currencyCode,
          value: finalTotalPrice,
          quantity: finalQuantity,
          order_id: orderId,
          phone: `${mobileCode}${formValues.phone}`,
        });
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
      <div className='orderForm-main theme2-orderform border-t-[#f0f0f0] border-t-[1px] pt-[25px] ' id='cart-form' ref={formContainerRef}>
        <p className='font-[500] text-center text-[18px]'>{t('To_order_please_enter_your_information')}</p>

        <form className='mt-6' onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex flex-col w-full md:w-[50%] mb-[15px]" ref={formRefs.fullName}>
              <label htmlFor="fullName" className='text-[#000000] text-[15px]'>{t('Full_Name')}</label>
              <input
                name="fullName"
                value={formValues.fullName}
                onChange={handleInputChange}
                className={` focus:outline-1 focus:outline-[#592404] p-[10px] w-full text-[15px] rounded-[5px] border-[1px] border-[#e5e5e5] ${formErrors.fullName ? "border-red-500" : "border-[#838383]"
                  }`} type="text" placeholder={t('Full_Name')} />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
              )}
            </div>
            <div className="flex flex-col w-full md:w-[50%] mb-[15px]">
              <label htmlFor="phone" className='text-[#000000] text-[15px]'>{t('Phone_Number')}
              </label>
              <div className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''}`} ref={formRefs.phone}>
                <input readOnly
                  type="tel"
                  name="code"
                  value={`+${settings.mobile_code || ''}`} className={`focus:outline-2 focus:outline-[#592404] p-[10px] w-[60px] text-[15px]  text-center border-[1px] border-[#e5e5e5] ${language === "ar" ? "rounded-l-[5px] border-r-0" : "rounded-l-[5px] border-r-0"}`} />
                <input
                  type="tel"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  className={`${formErrors.phone ? 'border-red-500' : 'border-[#838383]'
                    } focus:outline-1 focus:outline-[#592404] p-[10px] w-full text-[15px]  border-[1px] border-[#e5e5e5] ${language === "ar" ? "rounded-r-[5px]" : "rounded-r-[5px]"} `}
                  placeholder={t('Phone_Number')} />
              </div>
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="flex flex-col w-full md:w-[50%] mb-[15px]" ref={formRefs.state}>
              <label htmlFor="state" className='text-[#000000] text-[15px]'>{t('State')}</label>
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
            <div className="flex flex-col w-full md:w-[50%] mb-[15px]" ref={formRefs.city}>
              <label htmlFor="city" className='text-[#000000] text-[15px]'>{t('city')}
              </label>
              <Select
                className="select-zone"
                styles={getCustomStyles(formErrors, "city")}
                options={cityOptions}
                placeholder={t('Select_a_city')}
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
          <div className="flex flex-col w-full mb-[15px]" ref={formRefs.address}>
            <label htmlFor="address" className='text-[#000000] text-[15px]'>{t('address')}
            </label>
            <textarea
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              className={` ${formErrors.address ? "border-red-500" : "border-[#838383]"
                } focus:outline-1 focus:outline-[#592404] p-[10px] h-[100px] w-full text-[15px] rounded-[5px] border-[1px] border-[#e5e5e5]`} placeholder={t('address')} />
            {formErrors.address && (
              <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-8 pb-4 border-b-[#f0f0f0] border-b-[1px]">
            <button type="submit" className='bg-[#592404] w-full hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-2 md:px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] mx-auto rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
              {t('Click_here_to_order')}
            </button>
            {!isDiscounted && (
              <div className="flex">
                <button
                  type="button"
                  onClick={handleIncrement}
                  className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
                >
                  <FaPlus />
                </button>
                <input
                  readOnly
                  className='w-[40px] md:w-[80px] text-lg font-[500] outline-none text-center'
                  type="text"
                  value={quantity}
                />
                <button
                  type="button"
                  onClick={handleDecrement}
                  className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
                >
                  <FaMinus />
                </button>
              </div>
            )}

          </div>
        </form>

        {pathname !== "/" && (
          <div className="bottom-cart-btns fixed bottom-0 z-[9] right-0 border-y-[#f0f0f0] border-y-[1px] left-0 px-4 bg-white w-full mx-auto block lg:hidden">
            <div className="flex items-center gap-2 py-4 ">
              <Link href="#cart-form" className='bg-[#592404] text-center w-full hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-2 md:px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] mx-auto rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
                {t('Click_here_to_order')}
              </Link>
              {!isDiscounted && (
                <div className="flex">
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
                  >
                    <FaPlus />
                  </button>
                  <input
                    readOnly
                    className='w-[40px] md:w-[80px] text-lg font-[500] outline-none text-center'
                    type="text"
                    value={quantity}
                  />
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className='bg-[#f0f0f0] flex items-center justify-center text-center text-[#333333] rounded-[3px] border-[#f0f0f0] w-[30px] h-[30px] cursor-pointer'
                  >
                    <FaMinus />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrderForm;
