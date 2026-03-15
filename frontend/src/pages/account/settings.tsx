import Head from "next/head";
import Link from "next/link";

const AccountSettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Account Settings | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Account</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
              Account Settings
            </h1>
          </div>
          <Link href="/account" className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">
            Back to account
          </Link>
        </div>

        <form className="mt-8 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="First name" />
            <input className="rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="Last name" />
          </div>
          <input className="rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="Email" type="email" />
          <input className="rounded-xl border border-black/10 px-4 py-3 text-sm" placeholder="Phone" />
          <button
            type="submit"
            className="rounded-full bg-[#1f1a17] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
