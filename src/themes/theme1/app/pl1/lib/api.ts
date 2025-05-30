import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProducts = async (slugs = "") => {
  try {
    const url = slugs
      ? `${baseUrl}/store/products/${slugs}`
      : `${baseUrl}/store/products`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await axios.get(`${baseUrl}/store/product/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const response = await axios.get(`${baseUrl}/store/setting`);
    const settings = response.data;
    if (typeof window !== "undefined") {
      localStorage.setItem("storeSettings", JSON.stringify(settings.data));
    }
    return settings;
  } catch (error) {
    console.error("Error fetching setting:", error);
    throw error;
  }
};

export const getCityState = async () => {
  const savedSettings = JSON.parse(
    localStorage.getItem("storeSettings") || "{}"
  );
  try {
    const response = await axios.get(
      `${baseUrl}/store/cities/${savedSettings.country_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching setting:", error);
    throw error;
  }
};

export const getPages = async () => {
  try {
    const response = await axios.get(`${baseUrl}/store/pages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};

export async function getPageBySlug(slug) {
  try {
    const response = await fetch(`${baseUrl}/store/page/detail/${slug}`);
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
    const response = await axios.get(`${baseUrl}/store/banners`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw error;
  }
};
