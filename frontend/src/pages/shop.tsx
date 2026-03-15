import Head from "next/head";
import { useMemo, useState } from "react";
import ProductCard from "../components/ui/ProductCard";

const products = [
  {
    id: "prod-1",
    name: "Soft Tailored Blazer",
    price: 149,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    rating: 4.9
  },
  {
    id: "prod-2",
    name: "Signature Knit",
    price: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    rating: 4.7
  },
  {
    id: "prod-3",
    name: "Calm Neutral Set",
    price: 129,
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
    rating: 4.8
  },
  {
    id: "prod-4",
    name: "City Uniform Coat",
    price: 189,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    rating: 4.6
  },
  {
    id: "prod-5",
    name: "Minimalist Trousers",
    price: 99,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    rating: 4.5
  },
  {
    id: "prod-6",
    name: "Refined Overshirt",
    price: 119,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    rating: 4.7
  },
  {
    id: "prod-7",
    name: "Tailored Midi Dress",
    price: 139,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    rating: 4.8
  },
  {
    id: "prod-8",
    name: "Structured Hoodie",
    price: 79,
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
    rating: 4.4
  }
];

const filters = [
  {
    title: "Category",
    options: ["Outerwear", "Tailored", "Essentials", "Accessories"]
  },
  {
    title: "Price",
    options: ["$0 - $100", "$100 - $200", "$200+"]
  },
  {
    title: "Size",
    options: ["XS", "S", "M", "L", "XL"]
  },
  {
    title: "Color",
    options: ["Ivory", "Sand", "Slate", "Ink"]
  }
];

const ShopPage = () => {
  const [sort, setSort] = useState("Newest");

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sort === "Price low to high") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sort === "Price high to low") {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [sort]);

  return (
    <div className="bg-[#f7f4ef]">
      <Head>
        <title>Shop | Cherajama</title>
      </Head>

      <section className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-6 py-16 md:px-10 lg:flex-row lg:px-16">
        <aside className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Filters</p>
          <div className="mt-4 grid gap-6">
            {filters.map((filter) => (
              <div key={filter.title}>
                <p className="text-sm font-semibold text-[#1f1a17]">{filter.title}</p>
                <div className="mt-2 grid gap-2 text-sm text-[#6b5f52]">
                  {filter.options.map((option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Shop</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
                Curated Essentials
              </h1>
            </div>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
            >
              {["Newest", "Price low to high", "Price high to low", "Best selling"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
