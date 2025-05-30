"use client";
import { useTheme } from "../context/ThemeContext";
import Theme1Page from "../themes/theme1/app/page";
import Theme1Layout from "../themes/theme1/app/layout";
import Theme2PageHome from "../themes/theme2/app/page";
import Theme2Layout from "../themes/theme2/app/layout";
import Theme1ProductPage from "../themes/theme1/app/products/page";
import Theme1ProductPageSlug from "../themes/theme1/app/products/[slug]/page";
import ProductDetailPage from "../themes/theme1/app/p/[slug]/page";
import { usePathname } from "next/navigation";
import Theme1Success from "../themes/theme1/app/success/page";
import Theme1DynamicPage from "../themes/theme1/app/[slug]/page";
import Theme1NotFound from "../themes/theme1/app/not-found/page";
import PL1Layout from "../themes/theme1/app/pl1/layout";
import Them1pl1 from "../themes/theme1/app/pl1/page";
import Theme2ProductsPage from "../themes/theme2/app/products/page";
import Theme2Success from "../themes/theme2/app/success/page";
import ProductDetailstheme2 from "../themes/theme2/app/product-details/page";
import DynamicPagepl1 from "../themes/theme1/app/pl1/page/[slug]/page";
import PageSlugLayout from "../themes/theme1/app/layout";
import SkuPagePl1 from "../themes/theme1/app/pl1/[sku]/page";
import Theme1Successpl1 from "../themes/theme1/app/pl1/success/page";
import Theme2Layoutpl2 from "../themes/theme1/app/pl2/layout";
import Theme1HomePagepl2 from "../themes/theme1/app/pl2/page";
import DynamicPagePl2 from "../themes/theme1/app/pl2/page/[slug]/page";
import SkuproductPagePl2 from "../themes/theme1/app/pl2/[sku]/page";
import Theme1SuccessPl2 from "../themes/theme1/app/pl2/success/page";
import Theme1HomePagePl3 from "../themes/theme1/app/pl3/page";
import Theme1LayoutpPl3 from "../themes/theme1/app/pl3/layout";
import DynamicPagePl3 from "../themes/theme1/app/pl3/page/[slug]/page";
import SkuproductPagePl3 from "../themes/theme1/app/pl3/[sku]/page";
import Theme1SuccessPl3 from "../app/pl3/success/page";
import Theme2ContactUs from "../themes/theme2/app/contact-us/page";
import Theme2DynamicPage from "../themes/theme2/app/[slug]/page";
import ProductDetailPagetheme2 from "../themes/theme2/app/p/[slug]/page";

export default function ThemeRenderer({ children }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  if (theme === "theme1") {
    const isPL1Route =
      pathname === "/pl1" ||
      (pathSegments[0] === "pl1" && pathSegments.length === 2) ||
      (pathSegments[0] === "pl1" &&
        pathSegments[1] === "page" &&
        pathSegments.length === 3);
    pathSegments[0] === "/pl1" && pathSegments[1] === "success";

    if (isPL1Route) {
      return (
        <PL1Layout>
          {pathname === "/pl1" && <Them1pl1 />}
          {pathSegments[0] === "pl1" &&
            pathSegments[1] === "page" &&
            pathSegments.length === 3 && (
              <DynamicPagepl1 slug={pathSegments[2]} />
            )}
          {pathSegments[0] === "pl1" &&
            pathSegments[1] === "success" &&
            pathSegments.length === 2 && <Theme1Successpl1 />}

          {/* pl1/[sku] */}
          {pathSegments[0] === "pl1" && pathSegments.length === 2 && (
            <SkuPagePl1 />
          )}
        </PL1Layout>
      );
    }

    // for pl2
    const isPL2Route =
      pathname === "/pl2" ||
      (pathSegments[0] === "pl2" && pathSegments.length === 2) ||
      (pathSegments[0] === "pl2" &&
        pathSegments[1] === "page" &&
        pathSegments.length === 3) ||
      (pathSegments[0] === "pl2" &&
        pathSegments[1] === "success" &&
        pathSegments.length === 2);

    if (isPL2Route) {
      return (
        <Theme2Layoutpl2>
          {pathname === "/pl2" && <Theme1HomePagepl2 />}
          {pathSegments[0] === "pl2" &&
            pathSegments[1] === "page" &&
            pathSegments.length === 3 && (
              <DynamicPagePl2 slug={pathSegments[2]} />
            )}
          {pathSegments[0] === "pl2" &&
            pathSegments[1] === "success" &&
            pathSegments.length === 2 && <Theme1SuccessPl2 />}
          {pathSegments[0] === "pl2" &&
            pathSegments.length === 2 &&
            !["page", "success"].includes(pathSegments[1]) && (
              <SkuproductPagePl2 />
            )}
        </Theme2Layoutpl2>
      );
    }

    // for pl3
    const isPL3Route =
      pathname === "/pl3" ||
      (pathSegments[0] === "pl3" && pathSegments.length === 2) ||
      (pathSegments[0] === "pl3" &&
        pathSegments[1] === "page" &&
        pathSegments.length === 3) ||
      (pathSegments[0] === "pl3" &&
        pathSegments[1] === "success" &&
        pathSegments.length === 2);

    if (isPL3Route) {
      return (
        <Theme1LayoutpPl3>
          {pathname === "/pl3" && <Theme1HomePagePl3 />}
          {pathSegments[0] === "pl3" &&
            pathSegments[1] === "page" &&
            pathSegments.length === 3 && (
              <DynamicPagePl3 slug={pathSegments[2]} />
            )}
          {pathSegments[0] === "pl3" &&
            pathSegments[1] === "success" &&
            pathSegments.length === 2 && <Theme1SuccessPl3 />}
          {pathSegments[0] === "pl3" &&
            pathSegments.length === 2 &&
            !["page", "success"].includes(pathSegments[1]) && (
              <SkuproductPagePl3 />
            )}
        </Theme1LayoutpPl3>
      );
    }

    // Regular Theme1 routes
    return (
      <Theme1Layout>
        {pathname === "/" && <Theme1Page />}
        {pathname === "/not-found" && <Theme1NotFound />}
        {pathname === "/success" && <Theme1Success />}
        {pathname === "/products" && <Theme1ProductPage />}
        {pathSegments[0] === "products" && pathSegments.length === 2 && (
          <Theme1ProductPageSlug slug={pathSegments[1]} />
        )}
        {pathSegments[0] === "p" && pathSegments.length === 2 && (
          <ProductDetailPage slug={pathSegments[1]} />
        )}
        {pathSegments.length === 1 && (
          <Theme1DynamicPage slug={pathSegments[0]} />
        )}
      </Theme1Layout>
    );
  }

  // theme 2 routes
  if (theme === "theme2") {
    return (
      <Theme2Layout>
        {pathname === "/" && <Theme2PageHome />}
        {pathname === "/products" && <Theme2ProductsPage />}
        {pathname === "/success" && <Theme2Success />}
        {pathname === "/contact-us" && <Theme2ContactUs />}
        {pathname === "/product-details" && <ProductDetailstheme2 />}
        {/* {pathSegments.length === 1 && (
          <Theme2DynamicPage slug={pathSegments[0]} />
        )} */}
        {pathSegments.length === 1 &&
          ![
            "products",
            "success",
            "contact-us",
            "product-details",
            "p",
          ].includes(pathSegments[0]) && (
            <Theme2DynamicPage slug={pathSegments[0]} />
          )}
        {pathSegments[0] === "p" && pathSegments.length === 2 && (
          <ProductDetailPagetheme2 slug={pathSegments[1]} />
        )}
      </Theme2Layout>
    );
  }

  return null;
}
