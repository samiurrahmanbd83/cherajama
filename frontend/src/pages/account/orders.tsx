import Head from "next/head";
import Link from "next/link";

const orders = [
  { id: "CZ-1024", date: "Mar 10, 2026", total: "$189.00", status: "Processing" },
  { id: "CZ-1018", date: "Feb 26, 2026", total: "$129.00", status: "Shipped" },
  { id: "CZ-1007", date: "Feb 02, 2026", total: "$89.00", status: "Delivered" }
];

const AccountOrdersPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Order History | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Account</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
              Order History
            </h1>
          </div>
          <Link href="/account" className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">
            Back to account
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-black/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1f1a17]">{order.id}</p>
                  <p className="text-xs text-[#6b5f52]">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#1f1a17]">{order.total}</p>
                  <p className="text-xs text-[#6b5f52]">{order.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountOrdersPage;
