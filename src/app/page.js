import OurNewProducts from "../components/homePageComponent/ourNewProduct";
import HeroSlider from "../components/homePageComponent/heroSlider";
import OurBestSellingProduct from "../components/homePageComponent/ourBestSellingProduct/indewx";
import ProductBytype from "../components/homePageComponent/productBytype";
import OurFeatures from "../components/homePageComponent/ourFeatures";

const Home = () => {
  return (
    <>
      <HeroSlider />
      <OurNewProducts />
      <OurBestSellingProduct />
      <OurFeatures />
    </>
  );
};

export default Home;
