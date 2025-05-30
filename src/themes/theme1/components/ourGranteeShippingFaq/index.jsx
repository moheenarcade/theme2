import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../.././../../context/LanguageContext";



const OurGranteeShippingFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const faqData = [
    {
      question: t('Our_Grantee'),
      answer: t('first_faqs_answer'),
    },
    {
      question: t('Shipping_Info'),
      answer:
        t('second_faq_answer'),
    },
  ];

  return (
    <div className="shippng-grantee-faq max-w-3xl mx-auto pt-3">
      <div className="space-y-2">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full cursor-pointer flex justify-between items-center px-3 py-2 text-left text-[14px] md:text-md font-[600] hover:bg-gray-100 transition-all"
            >
              <span>{faq.question}</span>
              {openIndex === index ? <FaChevronUp  /> : <FaChevronDown />}
            </button>
            <div
              className={`px-4 transition-max-height duration-300 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-96 py-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurGranteeShippingFaq;
