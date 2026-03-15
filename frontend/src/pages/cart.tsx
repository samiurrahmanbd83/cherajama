import Head from "next/head";
import Link from "next/link";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Cart | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Cart</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
              Your Bag
            </h1>
          </div>
          <Link href="/shop" className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            Continue shopping
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            {items.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-[#6b5f52]">Your cart is empty.</p>
                <Link href="/shop" className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                  Shop now
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-28 w-28 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1f1a17]">{item.name}</p>
                      <p className="mt-1 text-xs text-[#6b5f52]">Size M · Sand</p>
                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>Qty {item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs uppercase tracking-[0.2em] text-[#8e8375]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-[#1f1a17]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Summary</p>
            <div className="mt-4 space-y-3 text-sm text-[#1f1a17]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-[#6b5f52]">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-3 text-base font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1f1a17] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
            >
              Proceed to checkout
            </Link>
            <p className="mt-4 text-xs text-[#8e8375]">Taxes calculated at checkout.</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
