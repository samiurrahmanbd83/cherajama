import Head from "next/head";
import Link from "next/link";
import ProductCard from "../../components/ui/ProductCard";

const items = [
  {
    id: "wish-1",
    name: "Soft Tailored Blazer",
    price: 149,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "wish-2",
    name: "Signature Knit",
    price: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
  }
];

const AccountWishlistPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Wishlist | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Account</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
              Wishlist
            </h1>
          </div>
          <Link href="/account" className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">
            Back to account
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <ProductCard key={item.id} id={item.id} name={item.name} price={item.price} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountWishlistPage;
