import HeroSection from "./HeroSection";
import FeaturedProductsSection from "./FeaturedProductsSection";
import CategoriesSection from "./CategoriesSection";
import FlashSaleSection from "./FlashSaleSection";
import PromoBannersSection from "./PromoBannersSection";
import CustomerReviewsSection from "./CustomerReviewsSection";
import NewsletterSection from "./NewsletterSection";
import FooterSection from "./FooterSection";
import { HomepageSection } from "./types";

const normalizeSection = (section: HomepageSection) => {
  if (section.type === "hero_banner") {
    return {
      ...section,
      type: "hero",
      subtitle: section.content ?? section.subtitle,
      config: {
        ...(section.config || {}),
        heading: section.title ?? section.config?.heading,
        subheading: section.content ?? section.config?.subheading,
        image_url: section.image ?? section.config?.image_url
      }
    };
  }

  if (section.type === "promo_banner") {
    return {
      ...section,
      type: "promo_banners",
      config: {
        ...(section.config || {}),
        banners: section.config?.banners?.length
          ? section.config.banners
          : [
              {
                image_url: section.image,
                label: section.title || "Promotion",
                cta_url: "/"
              }
            ]
      }
    };
  }

  if (section.type === "testimonials") {
    return {
      ...section,
      type: "customer_reviews",
      subtitle: section.content ?? section.subtitle
    };
  }

  return section;
};

// Map a homepage section to its component
const SectionRenderer = ({ section }: { section: HomepageSection }) => {
  const mapped = normalizeSection(section);

  switch (mapped.type) {
    case "hero":
      return <HeroSection section={mapped} />;
    case "featured_products":
      return <FeaturedProductsSection section={mapped} />;
    case "categories":
      return <CategoriesSection section={mapped} />;
    case "flash_sale":
      return <FlashSaleSection section={mapped} />;
    case "promo_banners":
      return <PromoBannersSection section={mapped} />;
    case "customer_reviews":
      return <CustomerReviewsSection section={mapped} />;
    case "newsletter":
      return <NewsletterSection section={mapped} />;
    case "footer":
      return <FooterSection section={mapped} />;
    default:
      return null;
  }
};

export default SectionRenderer;
