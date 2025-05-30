"use client";
import React, { useState, useEffect } from "react";
import "../../assets/style/togglemenu.css";
import { useTranslation } from "../../../../hooks/useTranslation";
import { BiCategory } from "react-icons/bi";
import Link from "next/link";
import { useLanguage } from "../../../../context/LanguageContext";
import { getCategories } from "../../../../lib/api";
import { MdOutlineBallot } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSelectedCategory } from "../../../../context/SelectedCategoryContext";

const HeaderCategory = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const formatCategoryName = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };
  const { setSelectedCategory } = useSelectedCategory();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  // console.log(categories, "category");
  const [loading, setLoading] = useState(true);
  const { setSelectedCategories } = useSelectedCategory();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data || []);
        localStorage.setItem("categories", JSON.stringify(data.data));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="nav-category">
      <ul className="flex items-center gap-4 py-2 text-[#000] font-[400]">
        <li
          className={`${language === "ar"
            ? "border-l-[1px] border-l-gray-300 pl-2"
            : "border-r-[1px] border-r-gray-300 pr-2"
            } 
        cursor-pointer flex items-center gap-1 hover:text-[#f69853] transition-all duration-[0.3s] ease-in-out`}
        >
          <div className="group relative cursor-pointer">
            <div className="flex items-center justify-between space-x-5 bg-white">
              <a className="menu-hover group-hover:text-[#f69853] flex items-center gap-1 text-base font-[400] text-black lg:mx-4">
                <BiCategory className="text-xl" />
                {t("all_categories")}
              </a>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </div>

            <div
              className={`invisible absolute z-50 bg-white shadow-2xl rounded-lg py-1 text-gray-800 group-hover:visible ${language === "ar" ? "w-[250px]" : "w-full"
                }`}
            >
              {categories.map((cat) => (
                <div key={cat.id} className="relative group/main-cat">
                  <div className="flex items-center justify-between border-b px-3 border-gray-100 py-2 font-[400] text-gray-500 hover:text-black md:mx-2">
                    <Link
                      href={`/products/${formatCategoryName(cat.name)}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(cat.name);
                        router.push(`/products/${formatCategoryName(cat.name)}`);
                      }}
                    >
                      {language === 'ar' ? cat.name_ar : cat.name}
                    </Link>
                    {cat.sub_categories && cat.sub_categories.length > 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className={`h-4 w-4 ml-2 ${language === "ar" ? "rotate-180" : ""
                          }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    )}
                  </div>

                  {cat.sub_categories && cat.sub_categories.length > 0 && (
                    <div
                      className={`invisible absolute left-full top-0 z-50 w-56 bg-white shadow-2xl rounded-lg py-1 text-gray-800 group-hover/main-cat:visible pl-1 ${language === "ar" ? "right-[96%]" : "right-0"
                        }`}
                    >
                      {cat.sub_categories.map((subCat) => (
                        <Link
                          href={`/products/${formatCategoryName(
                            cat.name
                          )},${formatCategoryName(subCat.name)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCategory(subCat.name);
                            router.push(
                              `/products/${formatCategoryName(
                                cat.name
                              )},${formatCategoryName(subCat.name)}`
                            );
                          }}
                          key={subCat.id}
                          className="block border-b px-3 border-gray-100 py-2 font-[400] text-gray-500 hover:text-black"
                        >
                          {language === 'ar' ? subCat.name_ar : subCat.name}

                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </li>
        <Link
          href="/products"
          onClick={() => {
            setSelectedCategory();
            localStorage.removeItem("selectedCategories");
          }}
        >
          <li
            className={`${language === "ar"
              ? "border-l-[1px] border-l-gray-300 pl-2"
              : "border-r-[1px] border-r-gray-300 pr-2"
              } 
    cursor-pointer flex items-center gap-1 hover:text-[#f69853] transition-all duration-[0.3s] ease-in-out`}
          >
            <MdOutlineBallot className="text-xl" /> {t("all_product")}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default HeaderCategory;
