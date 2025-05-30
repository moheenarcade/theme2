import React from 'react'
import { useTranslation } from "../../../../../hooks/useTranslation";
import { useLanguage } from "../../../../../context/LanguageContext";

const ProductDetails = ({ product }) => {
    const { t } = useTranslation();
    const { language, toggleLanguage } = useLanguage();
    // console.log(product, "product detail in form after section")
    const description = language === "ar" ? product.description_ar : product.description;
    return (
        <div className="">
            {product.description && (
                <div
                    className="product-description py-6"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}
        </div>
    )
}

export default ProductDetails;
