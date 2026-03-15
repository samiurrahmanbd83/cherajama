import { useState } from "react";
import { useCart } from "../../context/CartContext";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  badge?: string;
  description?: string;
};

const ProductCard = ({ id, name, price, image, rating = 4.8, badge, description }: ProductCardProps) => {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    addItem({ id, name, price, image });
  };

  return (
    <div className="group rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden rounded-2xl bg-[#f3eee7]">
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#1f1a17] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
            {badge}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/90 p-2 text-xs shadow-sm transition hover:-translate-y-0.5"
          aria-label="Add to wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.8 7.6a5.5 5.5 0 0 0-9-3.9 5.5 5.5 0 0 0-9 3.9c0 6 9 11.3 9 11.3s9-5.3 9-11.3Z"
              stroke="#1f1a17"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 rounded-full border border-black/10 bg-white px-3 py-1 text-xs transition hover:-translate-y-0.5"
        >
          Quick view
        </button>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#1f1a17]">{name}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-[#6b5f52]">
          <span>${price.toFixed(2)}</span>
          <span className="flex items-center gap-1 text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.9L12 16.7 6.7 19.7l1-5.9-4.2-4.1 5.9-.9L12 3.5Z"
                stroke="#6b5f52"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
            {rating.toFixed(1)}
          </span>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 w-full rounded-full bg-[#1f1a17] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
        >
          Add to cart
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Quick view</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#1f1a17]">{name}</h3>
                <p className="mt-2 text-sm text-[#6b5f52]">
                  {description || "Soft tailoring and premium textures crafted for everyday wear."}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
              <div className="overflow-hidden rounded-2xl bg-[#f3eee7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={name} className="h-56 w-full object-cover" />
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-[#8e8375]">Price</p>
                <p className="text-2xl font-semibold text-[#1f1a17]">${price.toFixed(2)}</p>
                <button
                  onClick={handleAdd}
                  className="w-full rounded-full bg-[#1f1a17] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white"
                >
                  Add to cart
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em]"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
