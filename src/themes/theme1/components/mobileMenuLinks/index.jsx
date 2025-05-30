"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBorderAll, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useLanguage } from "../../../../context/LanguageContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelectedCategory } from "../../../../context/SelectedCategoryContext";

const MobileMenuLinks = ({ categories, closeMobileMenu }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const formatCategoryName = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const { setSelectedCategory } = useSelectedCategory();
  const pathname = usePathname();
  const toggleMenu = () => {
    if (isAnimating) return;
    setIsOpen(!isOpen);
    setIsAnimating(true);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  const handleLinkClick = () => {
    closeMobileMenu();
    setSelectedCategory();
    localStorage.removeItem("selectedCategories");
  };

  // Handle animation end
  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };


  const allItems = categories.flatMap((category) => [
    { ...category, key: `cat-${category.id}` },
    ...(category.sub_categories || []).map((sub) => ({
      ...sub,
      key: `sub-${sub.id}`,
    })),
  ]);

  
  return (
    <div className="pt-8 h-[80vh] overflow-y-scroll">
      <li>
        <button
          onClick={toggleMenu}
          className="w-full text-[#222222] text-[16px] flex bg-white py-2 px-4 shadow-lg gap-2 items-center hover:text-[#f69853] font-[600] mt-2"
        >
          <FaBorderAll className="text-[#222222] text-[16px]" />
          {t("all_categories")}
          {isOpen ? (
            <FaChevronUp className="ml-auto" />
          ) : (
            <FaChevronDown className="ml-auto" />
          )}
        </button>
      </li>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px]" : "max-h-0"
          }`}
        onTransitionEnd={handleAnimationEnd}
      >
        <ul className="space-y-2 bg-white pl-4">
          {allItems.map((item) => (
            <li key={`${item.name}-${item.id}`}>
              <Link
               href={`/products/${formatCategoryName(item.name)}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(item.name);
                  router.push(`/products/${formatCategoryName(item.name)}`);
                  closeMobileMenu();
                }}
                className="block mb-2 border-b-[1px] border-b-gray-300 py-1 px-4 hover:bg-gray-100"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="">
        <li>
          <Link
            href="/products"
            className="text-[#222222] text-[16px] flex bg-white py-2 px-4 shadow-lg gap-2 items-center hover:text-[#f69853] font-[600] mt-2"
            onClick={handleLinkClick}
          >
            <FaBorderAll className="text-[#222222] text-[16px]" />
            {t("all_product")}
          </Link>
        </li>
      </div>
    </div>
  );
};

export default MobileMenuLinks;