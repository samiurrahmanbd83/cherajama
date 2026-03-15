import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildApiUrl } from "../../../lib/api";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  sale_price?: number | null;
  image?: string | null;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const getProduct = async (slug: string) => {
  const res = await fetch(buildApiUrl(`/api/products/${slug}`), {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data?.product as Product | null;
};

export const generateMetadata = async ({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false }
    };
  }

  const title = product.name;
  const description =
    product.description?.slice(0, 155) ||
    "Discover premium apparel crafted with comfort and style.";
  const image = product.image || undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/products/${product.slug}`
    },
    openGraph: {
      type: "product",
      url: `${siteUrl}/products/${product.slug}`,
      title,
      description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: product.name
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined
    }
  };
};

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const price = product.sale_price ?? product.price;

  return (
    <div className="min-h-screen bg-[#0f1217] px-6 py-16 text-[#f4f2ef]">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-[#243045] bg-[#151b25] p-6 shadow-2xl">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#0f141e]">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-[#8e9bb3]">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#243045] bg-[#151b25] p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8fb3ff]">Product</p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-sm text-[#c4d1f0]">
            {product.description || "Effortless essentials designed for everyday wear."}
          </p>
          <div className="mt-6">
            <span className="text-2xl font-semibold text-[#3dd598]">{formatPrice(price)}</span>
            {product.sale_price && (
              <span className="ml-2 text-sm text-[#8e9bb3] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button className="mt-6 w-full rounded-lg bg-[#8fb3ff] px-4 py-3 text-sm font-semibold text-[#0f1217]">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
