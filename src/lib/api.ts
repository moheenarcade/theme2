import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

import { getBaseUrls } from "../../utils/getBaseurls";

const { API_BASE_URL } = getBaseUrls() || {
  API_BASE_URL: "https://reselluae.com/api/rest",
};


export const getCategories = async () => {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);

    throw error;
  }
};

export const getProducts = async (slugs = "") => {
  try {
    const url = slugs
      ? `${API_BASE_URL}/store/products/${slugs}`
      : `${API_BASE_URL}/store/products`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// export const getProductsByCategorySlug = async (slug: string) => {
//   const response = await axios.get(`${baseUrl}/categories/${slug}/products`);
//   return response.data;
// };

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/store/product/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

export const getSettings = async () => {
  if (window.location.pathname === '/404') {
    return; // Skip fetching data if already on 404 page
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/store/setting`);
    const settings = response.data;
    if (typeof window !== "undefined") {
      localStorage.setItem("storeSettings", JSON.stringify(settings.data));
    }
    return settings;
  } catch (error) {
    console.error("Error fetching setting:", error);
    // if (error?.response?.status === 404) {
    //   window.location.href = "/404";
    // }
    throw error;
  }
};

export const getCityState = async () => {
  const savedSettings = JSON.parse(
    localStorage.getItem("storeSettings") || "{}"
  );
  try {
    const response = await axios.get(
      `${API_BASE_URL}/store/cities/${savedSettings.country_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching setting:", error);
    throw error;
  }
};

export const getPages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/store/pages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

export async function getPageBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/store/page/detail/${slug}`);
    if (!response.ok) {
      throw new Error("Page not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export const getSBanners = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/store/banners`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

// NEW: search products by free‑text
export const searchProducts = async (query: string) => {
  if (!query?.trim()) return [];
  try {
    const response = await axios.get(`${API_BASE_URL}/store/search/list`, {
      params: { search: query.trim() },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
