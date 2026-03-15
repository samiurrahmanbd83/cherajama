export type HomepageSectionType =
  | "hero_banner"
  | "hero"
  | "featured_products"
  | "categories"
  | "promo_banner"
  | "flash_sale"
  | "promo_banners"
  | "testimonials"
  | "customer_reviews"
  | "newsletter"
  | "footer";

export type HomepageSection = {
  id: string;
  type: HomepageSectionType;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  image?: string | null;
  position?: number | null;
  config?: Record<string, any>;
  sort_order: number;
  is_active: boolean;
  data?: Record<string, any>;
};

export type HomepagePayload = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sections: HomepageSection[];
};
