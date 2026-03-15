import { useEffect, useMemo, useState } from "react";
import { getApiBase } from "../../lib/api";
import Head from "next/head";
import { useRouter } from "next/router";
import { Inter, Fraunces } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

const AdminLoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("admin@cherajama.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiBase = useMemo(() => getApiBase(), []);

  useEffect(() => {
    const existing = window.localStorage.getItem("admin_token");
    if (existing) {
      setSuccess("Admin token detected. Redirecting to dashboard...");
      setTimeout(() => router.push("/admin/homepage-builder"), 800);
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const role = data.data?.admin?.role;
      if (role !== "admin") {
        throw new Error("This account does not have admin access.");
      }

      const token = data.data?.token;
      if (!token) throw new Error("Token missing from response.");

      window.localStorage.setItem("admin_token", token);
      setSuccess("Login successful. Redirecting...");
      setTimeout(() => router.push("/admin/dashboard"), 600);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${inter.variable} ${fraunces.variable} min-h-screen bg-[#0f1217] text-[#f4f2ef]`}>
      <Head>
        <title>Admin Login | Cherajama</title>
      </Head>

      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-gradient-to-br from-[#1f2a44] via-[#172031] to-[#0f1217] p-8 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8fb3ff]">Admin Console</p>
            <h1 className="mt-4 font-serif text-4xl">Welcome back</h1>
            <p className="mt-3 text-sm text-[#c4d1f0]">
              Use your admin credentials to manage homepage sections, payments, SEO, and store settings.
            </p>
            <div className="mt-6 rounded-2xl border border-[#2f3c52] bg-[#0f141e] p-5 text-xs text-[#8e9bb3]">
              <p className="uppercase tracking-[0.2em] text-[#8fb3ff]">Quick Links</p>
              <ul className="mt-3 grid gap-2">
                <li>/admin/homepage-builder</li>
                <li>/admin/payments</li>
                <li>/admin/payment-gateways</li>
                <li>/admin/settings</li>
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-[#243045] bg-[#151b25] p-8 shadow-2xl">
            <h2 className="font-serif text-2xl">Admin Login</h2>
            <p className="mt-2 text-sm text-[#8e9bb3]">Sign in to access your dashboard.</p>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <input
                className="rounded-lg border border-[#2f3c52] bg-[#0f141e] px-4 py-3 text-sm text-white"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                required
              />
              <input
                className="rounded-lg border border-[#2f3c52] bg-[#0f141e] px-4 py-3 text-sm text-white"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#8fb3ff] px-5 py-3 text-sm font-semibold text-[#0f1217]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            {success && <p className="mt-4 text-sm text-emerald-400">{success}</p>}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;




