import type { MetadataRoute } from "next";
import { buildApiUrl } from "../lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const getProducts = async () => {
  const res = await fetch(buildApiUrl("/api/products"), { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data?.products || [];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date()
    }
  ];

  const productRoutes = products.map((product: any) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(product.created_at || Date.now())
  }));

  return [...staticRoutes, ...productRoutes];
}
