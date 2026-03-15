import { useEffect, useMemo, useState } from "react";
import { getApiBase } from "../lib/api";
import Head from "next/head";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

const PAYMENT_NUMBER = "01745256486";

const METHOD_LABELS: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  upay: "Upay",
  cash_on_delivery: "Cash on Delivery"
};

type Gateway = {
  id: string;
  name: string;
  gateway_code: string;
  is_active: boolean;
};

type CartSummary = {
  cart_id: string;
  items: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    product_id: string;
    name: string;
    slug: string;
  }>;
  summary: {
    subtotal: number;
    tax: number;
    shipping_cost: number;
    total: number;
  };
};

type OrderResult = {
  order_id: string;
  order_number: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
};

const CheckoutPage = () => {
  const [token, setToken] = useState("");
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    email: "",
    shipping_address: "",
    city: "",
    postal_code: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    payment_method: "",
    sender_phone: "",
    transaction_id: "",
    paid_amount: ""
  });

  const apiBase = useMemo(() => getApiBase(), []);

  const activeGateways = gateways.filter((gateway) => gateway.is_active);

  useEffect(() => {
    const saved = window.localStorage.getItem("auth_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    let alive = true;

    const loadGateways = async () => {
      try {
        const res = await fetch(`${apiBase}/api/payment-gateways`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load gateways");
        if (!alive) return;
        setGateways(data.data.gateways as Gateway[]);
        const firstActive = data.data.gateways.find((gateway: Gateway) => gateway.is_active);
        if (firstActive) {
          setPaymentForm((prev) => ({ ...prev, payment_method: firstActive.gateway_code }));
        }
      } catch {
        if (!alive) return;
        setGateways([]);
      }
    };

    loadGateways();
    const timer = setInterval(loadGateways, 60000);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [apiBase]);

  useEffect(() => {
    if (!token) return;
    window.localStorage.setItem("auth_token", token);
    setError("");
    setLoading(true);
    fetch(`${apiBase}/api/checkout/summary`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load cart summary");
        return data.data as CartSummary;
      })
      .then((data) => setSummary(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [apiBase, token]);

  const handleCheckoutSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return setError("Please provide your auth token.");

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiBase}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(checkoutForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");
      setOrder(data.data.order as OrderResult);
      setPaymentForm((prev) => ({
        ...prev,
        paid_amount: data.data.order?.total ? String(data.data.order.total) : prev.paid_amount
      }));
    } catch (err: any) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!order) return;

    setPaymentLoading(true);
    setPaymentSuccess("");
    setError("");
    try {
      const payload = {
        order_id: order.order_id,
        ...paymentForm,
        paid_amount: Number(paymentForm.paid_amount)
      };

      const res = await fetch(`${apiBase}/api/payments/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment submission failed");
      setPaymentSuccess("Payment submitted. Awaiting admin verification.");
    } catch (err: any) {
      setError(err.message || "Payment submission failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className={`${inter.variable} ${fraunces.variable} min-h-screen bg-[#f6f1ea] text-[#1d1a16]`}>
      <Head>
        <title>Checkout | CheraJama</title>
      </Head>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="rounded-3xl bg-gradient-to-br from-[#1d1a16] via-[#2c241c] to-[#4a3a2a] p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#f5d0a9]">Secure Checkout</p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">Complete your order</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#f2e8dd]">
            Review your cart, confirm shipping details, then submit your payment proof for manual verification.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="font-serif text-2xl">Cart Summary</h2>
              <p className="mt-1 text-sm text-[#6d5c4b]">Preview items and totals before placing the order.</p>

              <div className="mt-4 flex flex-col gap-4">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6d5c4b]">Auth Token</label>
                <input
                  className="w-full rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  placeholder="Paste your JWT token"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                />
              </div>

              {loading && <p className="mt-4 text-sm text-[#6d5c4b]">Loading cart...</p>}
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              {summary && (
                <div className="mt-6 space-y-4">
                  <ul className="divide-y divide-[#efe6dc]">
                    {summary.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-[#6d5c4b]">
                            Qty: {item.quantity} Â· Unit: ${Number(item.unit_price).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ${(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-xl bg-[#f6f1ea] p-4 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${summary.summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Tax</span>
                      <span>${summary.summary.tax.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span>Shipping</span>
                      <span>${summary.summary.shipping_cost.toFixed(2)}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>${summary.summary.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="font-serif text-2xl">Shipping Details</h2>
              <p className="mt-1 text-sm text-[#6d5c4b]">We will use these details to prepare your order.</p>

              <form onSubmit={handleCheckoutSubmit} className="mt-6 grid gap-4">
                <input
                  className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  placeholder="Full name"
                  value={checkoutForm.name}
                  onChange={(event) =>
                    setCheckoutForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                    placeholder="Phone"
                    value={checkoutForm.phone}
                    onChange={(event) =>
                      setCheckoutForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    required
                  />
                  <input
                    className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                    placeholder="Email"
                    type="email"
                    value={checkoutForm.email}
                    onChange={(event) =>
                      setCheckoutForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                  />
                </div>
                <input
                  className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  placeholder="Shipping address"
                  value={checkoutForm.shipping_address}
                  onChange={(event) =>
                    setCheckoutForm((prev) => ({ ...prev, shipping_address: event.target.value }))
                  }
                  required
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                    placeholder="City"
                    value={checkoutForm.city}
                    onChange={(event) =>
                      setCheckoutForm((prev) => ({ ...prev, city: event.target.value }))
                    }
                    required
                  />
                  <input
                    className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                    placeholder="Postal code"
                    value={checkoutForm.postal_code}
                    onChange={(event) =>
                      setCheckoutForm((prev) => ({ ...prev, postal_code: event.target.value }))
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#1d1a16] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2721]"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="font-serif text-2xl">Payment Instructions</h2>
              <p className="mt-2 text-sm text-[#6d5c4b]">
                Send payment to the number below using your preferred mobile banking method. Then submit
                the sender phone, transaction ID, and method.
              </p>

              <div className="mt-4 rounded-xl border border-dashed border-[#d4c3b4] bg-[#f9f3ec] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6d5c4b]">Payment Number</p>
                <p className="mt-2 text-2xl font-semibold text-[#1d1a16]">{PAYMENT_NUMBER}</p>
              </div>

              <ul className="mt-4 grid gap-2 text-sm text-[#6d5c4b]">
                {activeGateways.length === 0 && (
                  <li className="rounded-lg bg-[#f6f1ea] px-3 py-2 text-xs">
                    No payment methods are currently available.
                  </li>
                )}
                {activeGateways.map((gateway) => (
                  <li
                    key={gateway.id}
                    className="flex items-center justify-between rounded-lg bg-[#f6f1ea] px-3 py-2"
                  >
                    <span>{gateway.name || METHOD_LABELS[gateway.gateway_code]}</span>
                    <span className="text-xs uppercase tracking-[0.2em]">Supported</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="font-serif text-2xl">Submit Payment Proof</h2>
              <p className="mt-1 text-sm text-[#6d5c4b]">
                Submit after sending your payment. Admin verification is required to proceed.
              </p>

              {order ? (
                <div className="mt-4 rounded-xl bg-[#f6f1ea] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6d5c4b]">Order Number</p>
                  <p className="mt-2 font-semibold">{order.order_number}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#9b7d64]">Place your order to unlock payment submission.</p>
              )}

              <form onSubmit={handlePaymentSubmit} className="mt-6 grid gap-4">
                <select
                  className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  value={paymentForm.payment_method}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, payment_method: event.target.value }))
                  }
                  disabled={!order || activeGateways.length === 0}
                >
                  {activeGateways.map((gateway) => (
                    <option key={gateway.id} value={gateway.gateway_code}>
                      {gateway.name || METHOD_LABELS[gateway.gateway_code]}
                    </option>
                  ))}
                </select>
                <input
                  className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  placeholder="Sender phone number"
                  value={paymentForm.sender_phone}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, sender_phone: event.target.value }))
                  }
                  disabled={!order || activeGateways.length === 0}
                />
                <input
                  className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  placeholder="Transaction ID"
                  value={paymentForm.transaction_id}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, transaction_id: event.target.value }))
                  }
                  disabled={!order || activeGateways.length === 0}
                />
                <input
                  className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
                  placeholder="Paid amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentForm.paid_amount}
                  onChange={(event) =>
                    setPaymentForm((prev) => ({ ...prev, paid_amount: event.target.value }))
                  }
                  disabled={!order || activeGateways.length === 0}
                />
                <button
                  type="submit"
                  disabled={!order || paymentLoading || activeGateways.length === 0}
                  className="rounded-lg bg-[#2f5d50] px-5 py-3 text-sm font-semibold text-white hover:bg-[#23473d]"
                >
                  {paymentLoading ? "Submitting..." : "Submit Payment"}
                </button>
              </form>

              {paymentSuccess && <p className="mt-4 text-sm text-emerald-700">{paymentSuccess}</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckoutPage;





