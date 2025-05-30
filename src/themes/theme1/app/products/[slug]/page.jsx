"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { getProducts, getCategories } from "../../../../../lib/api";
import { useLanguage } from "../../../../../context/LanguageContext";
import ProductMainLists from "../../../components/productListing/productMainLists";
import { useSelectedCategory } from "../../../../../context/SelectedCategoryContext";
import Loader from "../../../components/loader";
import { IoClose } from "react-icons/io5";
import { trackBothEvents } from "../../../../../lib/pixelEvents";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryCheckboxList from "../../../components/CategoryCheckboxList";

const Products = ({ slug }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState("");
  const { selectedCategory, setSelectedCategory } = useSelectedCategory();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugFromURL = searchParams.get("slug");

  useEffect(() => {
    trackBothEvents("ViewContent", {
      content_name: "Products",
    });
  }, []);

  const saveCategoriesToLocalStorage = (categories) => {
    localStorage.setItem("categories", JSON.stringify(categories));
  };

  // get categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storedCategories = localStorage.getItem("categories");
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          const data = await getCategories();
          const categoryList = data.data || [];
          setCategories(categoryList);
          saveCategoriesToLocalStorage(categoryList);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const storedSelected = localStorage.getItem("selectedCategories");
    if (storedSelected) {
      const parsed = JSON.parse(storedSelected);
      setSelectedCategories(parsed);
    }
  }, []);

  // Save selected categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      try {
        let slugs = "";
        const pathSlug = window?.location?.pathname.split("/products/")[1];
        slugs = pathSlug || "";
        if (slugs) {
          const categoriesArray = slugs
            .split(",")
            .map((slug) =>
              slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            );
          setSelectedCategories(categoriesArray);
        }
        const data = await getProducts(slugs);
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      localStorage.setItem(
        "selectedCategories",
        JSON.stringify(selectedCategories)
      );
    }
  }, [selectedCategories]);

  // Handle category selection change
  const handleCheckboxChange = (categoryName) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName];
      const slugs = updated
        .map((cat) => cat.toLowerCase().replace(/\s+/g, "-"))
        .join(",");
      router.push(`/products/${slugs}`);
      return updated;
    });
  };

  useEffect(() => {
    const settings = localStorage.getItem("storeSettings");
    if (settings) {
      try {
        const parsedSettings = JSON.parse(settings);
        setCurrencyCode(parsedSettings.currency_code || "OMR");
      } catch (error) {
        console.error("Failed to parse storeSettings:", error);
      }
    }
  }, []);

  return (
    <div className="products-main container px-4 md:px-6 2xl:px-28 mx-auto py-6">
      <div className="block lg:hidden">
        <div className="flex justify-between items-center border-b-[1px] border-b-gray-300 pb-4">
          <button
            onClick={() => setIsOpen(true)}
            className="border-[1px] border-[#f69853] rounded-lg text-[#f69853] cursor-pointer py-1 px-4 hover:border-[#f69853] hover:text-[#f69853] transition-all duration-[0.3s] ease-in-out"
          >
            {t("Filters")}
          </button>
          <p className="pl-3 font-[300]">
            {t("Products")}
            {/* : {products.length} */}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-[15px]">
        <div className="filters-main hidden lg:block min-w-[280px] xl:min-w-[305px] max-w-[280px] xl:max-w-[305px] relative">
          <div className="filter-container border-[1px] border-gray-300 rounded-lg">
            <div className="border-b-[1px] border-b-gray-300">
              <h1 className="text-lg font-[600] px-4 py-2">{t("Filters")}</h1>
            </div>
            <div className="px-4 h-[94%] overflow-y-auto pb-12">
              {selectedCategories.length > 0 && (
                <div className="filter-for-you border-b-[1px] border-b-gray-300 pb-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-[600] py-2">
                      {t("Filter_Results")}
                    </h2>
                    <button
                      className="text-red-600 cursor-pointer py-1 px-4 transition-all duration-[0.3s] ease-in-out"
                      onClick={() => {
                        setSelectedCategories([]);
                        router.push("/products");
                      }}
                    >
                      {t("Clear")}
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap text-[14px]">

                    {selectedCategories.map((categoryName) => {
                      const matchedCategory = categories.find(
                        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
                      );
                      const displayName =
                        language === "ar"
                          ? matchedCategory?.name_ar || categoryName
                          : matchedCategory?.name || categoryName;

                      return (
                        <button
                          key={categoryName}
                          className="border-[1px] flex items-center gap-3 border-[#f69853] rounded-lg text-[#f69853] cursor-pointer py-1 px-2 hover:border-[#f69853] hover:text-[#f69853] transition-all duration-[0.3s] ease-in-out"
                          onClick={() => handleCheckboxChange(categoryName)}
                        >
                          {displayName}
                          <IoClose className="text-xl" />
                        </button>
                      );
                    })}

                  </div>
                </div>
              )}

              <div className="filter-cat ">
                <p className="text-lg font-[600] py-2">{t("Category")}</p>
                <div className="flex flex-col justify-between">
                  <CategoryCheckboxList
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onChange={handleCheckboxChange}
                    isArabic={language === "ar"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <ProductMainLists products={products} currencyCode={currencyCode} />
        )}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999999999]"
          aria-labelledby="slide-over-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          ></div>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full w-[90%] sm:w-[50%] pr-10">
                <div className="pointer-events-auto relative w-screen max-w-md transform transition ease-in-out duration-500 translate-x-0">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="absolute top-0 bg-white py-4 z-[9999999] flex justify-between right-0 -ml-8 w-full pt-5 pr-2 sm:-ml-10 sm:pr-4">
                      <div className="px-4 sm:px-6">
                        <h2
                          className="text-base font-semibold text-gray-900"
                          id="slide-over-title"
                        >
                          {t("Filters")}
                        </h2>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="relative rounded-md text-black hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                      >
                        <span className="absolute -inset-2.5"></span>
                        <span className="sr-only">{t("Close_panel")}</span>
                        <svg
                          className="size-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="px-3 h-screen overflow-y-auto pt-12">
                      {selectedCategories.length > 0 && (
                        <div className="filter-for-you border-b-[1px] border-b-gray-300 pb-6">
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-[600] py-2">
                              {t("Filter_Results")}
                            </h2>

                            <button
                              className="text-red-600 cursor-pointer py-1 px-4 transition-all duration-[0.3s] ease-in-out"
                              onClick={() => {
                                setSelectedCategories([]);
                                router.push("/products");
                              }}
                            >
                              {t("Clear")}
                            </button>
                          </div>
                          <div className="flex gap-2 flex-wrap text-[14px]">
                            {selectedCategories.map((categoryName) => {
                              const matchedCategory = categories.find(
                                (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
                              );
                              const displayName =
                                language === "ar"
                                  ? matchedCategory?.name_ar || categoryName
                                  : matchedCategory?.name || categoryName;

                              return (
                                <button
                                  key={categoryName}
                                  className="border-[1px] flex items-center gap-3 border-[#f69853] rounded-lg text-[#f69853] cursor-pointer py-1 px-2 hover:border-[#f69853] hover:text-[#f69853] transition-all duration-[0.3s] ease-in-out"
                                  onClick={() => handleCheckboxChange(categoryName)}
                                >
                                  {displayName}
                                  <IoClose className="text-xl" />
                                </button>
                              );
                            })}

                          </div>
                        </div>
                      )}
                      <div className="filter-cat pb-6">
                        <p className="text-lg font-[600] py-2">
                          {t("Category")}
                        </p>
                        <div className="flex flex-col justify-between">
                          <CategoryCheckboxList
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onChange={handleCheckboxChange}
                            isArabic={language === "ar"}

                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
