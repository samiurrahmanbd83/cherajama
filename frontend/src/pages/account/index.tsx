import Head from "next/head";
import Link from "next/link";

const sections = [
  { label: "My Profile", href: "/account" },
  { label: "Order History", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Saved Addresses", href: "/account/addresses" },
  { label: "Account Settings", href: "/account/settings" },
  { label: "Logout", href: "/" }
];

const AccountDashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>My Account | Cherajama</title>
      </Head>

      <div className="mx-auto grid w-full max-w-screen-2xl gap-8 px-6 md:px-10 lg:grid-cols-[0.9fr_2fr] lg:px-16">
        <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Account</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
            Welcome back
          </h2>
          <div className="mt-6 grid gap-2 text-sm text-[#1f1a17]">
            {sections.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-xl px-3 py-2 hover:bg-[#f3eee7]">
                {item.label}
              </Link>
            ))}
          </div>
        </aside>

        <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
            My Profile
          </h1>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">Personal</p>
              <p className="mt-2 text-sm text-[#1f1a17]">Samir Rahman</p>
              <p className="text-xs text-[#6b5f52]">samir@example.com</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">Default Address</p>
              <p className="mt-2 text-sm text-[#1f1a17]">Dhaka, Bangladesh</p>
              <p className="text-xs text-[#6b5f52]">Manage addresses in account settings.</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">Orders</p>
              <p className="mt-2 text-sm text-[#1f1a17]">3 active orders</p>
              <p className="text-xs text-[#6b5f52]">Track shipment status and invoices.</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">Wishlist</p>
              <p className="mt-2 text-sm text-[#1f1a17]">5 saved items</p>
              <p className="text-xs text-[#6b5f52]">Quickly revisit your favorites.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountDashboardPage;
