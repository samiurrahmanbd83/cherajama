import Head from "next/head";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Sign In | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-lg rounded-3xl border border-black/10 bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
          Sign In
        </h1>
        <p className="mt-2 text-sm text-[#6b5f52]">
          Sign in to access your profile, orders, and saved items.
        </p>

        <form className="mt-6 grid gap-4">
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
          <div className="flex items-center justify-between text-xs text-[#6b5f52]">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <Link href="#" className="underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#1f1a17] px-4 py-3 text-xs uppercase tracking-[0.2em] text-white"
          >
            Login
          </button>
          <button
            type="button"
            className="rounded-full border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.2em]"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#6b5f52]">
          New here?{" "}
          <Link href="/signup" className="underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
