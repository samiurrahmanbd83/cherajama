import Head from "next/head";
import Link from "next/link";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Create Account | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-lg rounded-3xl border border-black/10 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Join Cherajama</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
          Create Account
        </h1>
        <p className="mt-2 text-sm text-[#6b5f52]">
          Create an account to track orders, save your wishlist, and manage addresses.
        </p>

        <form className="mt-6 grid gap-4">
          <input
            className="rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Full name"
            type="text"
            required
          />
          <input
            className="rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Password"
            type="password"
            required
          />
          <input
            className="rounded-xl border border-black/10 px-4 py-3 text-sm"
            placeholder="Confirm password"
            type="password"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[#1f1a17] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white"
          >
            Create Account
          </button>
          <button
            type="button"
            className="rounded-full border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em]"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#6b5f52]">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
