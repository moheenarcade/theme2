"use client";
import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { getCityState, getSettings } from "../../lib/api";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useLanguage } from "../../../../../../context/LanguageContext";

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

const BuyForm = ({ product, selectedQuantity, selectedTotalPrice }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const router = useRouter();
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    fullName: "",
    // email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({});
  const formContainerRef = useRef(null);

  const formRefs = {
    fullName: useRef(null),
    // email: useRef(null),
    phone: useRef(null),
    state: useRef(null),
    city: useRef(null),
    address: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 1000) {
        setShowStickyButton(true);
      } else {
        setShowStickyButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      // customer_email: formValues.email,
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
      product_price: selectedTotalPrice,
      product_quantity: selectedQuantity,
      total_price:
        selectedTotalPrice < 15 ? selectedTotalPrice + 1.5 : selectedTotalPrice,
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
          router.push(`/pl1/success?orderId=${orderId}`);
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
    <div className="form-sec " ref={formContainerRef}>
      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <div className="mb-2 lg:mb-3" ref={formRefs.fullName}>
          <input
            name="fullName"
            value={formValues.fullName}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 rounded-lg border-2 ${formErrors.fullName ? "border-red-500" : "border-[#838383]"
              } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-900 focus:shadow-lg`}
            type="text"
            placeholder={t('Your_Full_Name')}
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
              className={`w-full px-3 py-3 border-2 ${formErrors.phone ? 'border-red-500' : 'border-[#838383]'
                } focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-900 focus:shadow-lg 
      ${language === 'ar' ? 'rounded-l-0 rounded-r-lg' : 'rounded-r-lg'}`}
              placeholder={t('Your_Phone')}
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

        <button
          type="submit"
          className="w-full cursor-pointer py-3 px-12 bg-[#764202] hover:text-[#764202] hover:bg-white border-tarnsparent hover:border-[#764202] border-2 rounded-full text-white text-xl tarnsition-all duration-[0.3s] ease-in-out"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : t("Confirm_Order")}
        </button>
      </form>

      {showStickyButton && !isSubmitting && (
        <div className="fixed bg-black rounded-t-xl bottom-0 right-0 left-0 z-[999999] w-full py-4 px-4">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                formContainerRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="w-full lg:w-[50%] cursor-pointer py-2 px-4 bg-transparent hover:text-[#764202] hover:bg-white border-white hover:border-[#764202] border-2 rounded-full text-white text-md sm:text-lg transition-all duration-[0.3s] ease-in-out"
            >
              {t('Order_now_and_pay_upon_receipt')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyForm;
