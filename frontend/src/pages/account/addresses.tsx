import Head from "next/head";
import Link from "next/link";

const AccountAddressesPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Saved Addresses | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Account</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
              Saved Addresses
            </h1>
          </div>
          <Link href="/account" className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">
            Back to account
          </Link>
        </div>

        <div className="mt-8 grid gap-4">
          {[
            { title: "Home", address: "Banani, Dhaka, Bangladesh" },
            { title: "Office", address: "Gulshan Avenue, Dhaka, Bangladesh" }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/10 p-4">
              <p className="text-sm font-semibold text-[#1f1a17]">{item.title}</p>
              <p className="text-xs text-[#6b5f52]">{item.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountAddressesPage;
