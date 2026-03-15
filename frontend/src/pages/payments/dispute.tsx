import { useEffect, useMemo, useState } from "react";
import { getApiBase } from "../../lib/api";
import Head from "next/head";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

const METHODS = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "upay", label: "Upay" },
  { value: "cash_on_delivery", label: "Cash on Delivery" }
];

const PaymentDisputePage = () => {
  const [token, setToken] = useState("");
  const [form, setForm] = useState({
    order_id: "",
    payment_method: "bkash",
    transaction_id: "",
    description: "",
    screenshot_url: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBase = useMemo(() => getApiBase(), []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError("Please provide your auth token.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${apiBase}/api/payments/dispute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: form.order_id,
          payment_method: form.payment_method,
          transaction_id: form.transaction_id,
          description: form.description,
          screenshot_url: form.screenshot_url || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit dispute");
      setSuccess("Dispute submitted. Our team will review shortly.");
      setForm({
        order_id: "",
        payment_method: "bkash",
        transaction_id: "",
        description: "",
        screenshot_url: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit dispute");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("auth_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    window.localStorage.setItem("auth_token", token);
  }, [token]);

  return (
    <div className={`${inter.variable} ${fraunces.variable} min-h-screen bg-[#f6f1ea] text-[#1d1a16]`}>
      <Head>
        <title>Payment Dispute | CheraJama</title>
      </Head>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <header className="rounded-3xl bg-gradient-to-br from-[#1d1a16] via-[#2c241c] to-[#4a3a2a] p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#f5d0a9]">Support</p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">Payment Dispute</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#f2e8dd]">
            Submit a dispute if there is an issue with your payment.
          </p>
        </header>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <label className="text-xs uppercase tracking-[0.2em] text-[#6d5c4b]">Auth Token</label>
          <input
            className="mt-2 w-full rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
            placeholder="Paste your JWT token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <input
              className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
              placeholder="Order ID"
              value={form.order_id}
              onChange={(event) => setForm((prev) => ({ ...prev, order_id: event.target.value }))}
              required
            />
            <select
              className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
              value={form.payment_method}
              onChange={(event) => setForm((prev) => ({ ...prev, payment_method: event.target.value }))}
            >
              {METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            <input
              className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
              placeholder="Transaction ID"
              value={form.transaction_id}
              onChange={(event) => setForm((prev) => ({ ...prev, transaction_id: event.target.value }))}
              required
            />
            <textarea
              className="min-h-[120px] rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
              placeholder="Describe the issue"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-[#d4c3b4] px-4 py-3 text-sm"
              placeholder="Screenshot URL (optional)"
              value={form.screenshot_url}
              onChange={(event) => setForm((prev) => ({ ...prev, screenshot_url: event.target.value }))}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#1d1a16] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d2721]"
            >
              {loading ? "Submitting..." : "Submit Dispute"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-700">{success}</p>}
        </section>
      </main>
    </div>
  );
};

export default PaymentDisputePage;





