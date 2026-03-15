import { useEffect, useMemo, useState } from "react";
import { getApiBase } from "../../lib/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop#categories" },
  { label: "New Arrivals", href: "/shop#new" },
  { label: "Sale", href: "/shop#sale" }
];

const categoryLinks = ["Outerwear", "Tailored", "Essentials", "Accessories"];

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#1f1a17] shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
    {children}
  </span>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 21L16.65 16.65M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M20.8 7.6a5.5 5.5 0 0 0-9-3.9 5.5 5.5 0 0 0-9 3.9c0 6 9 11.3 9 11.3s9-5.3 9-11.3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21a8 8 0 1 0-16 0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6h15l-1.5 9h-12L4 3H2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="18" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const Navbar = () => {
  const router = useRouter();
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const [recent, setRecent] = useState<string[]>([]);

  const apiBase = useMemo(() => getApiBase(), []);

  useEffect(() => {
    const stored = window.localStorage.getItem("recent_searches");
    if (stored) {
      setRecent(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBase}/api/products/search?keyword=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          const products = (data.data?.products || []).slice(0, 5);
          setSuggestions(products.map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch {
        setSuggestions([
          { id: "s1", name: "Signature Knit" },
          { id: "s2", name: "Soft Tailored Blazer" },
          { id: "s3", name: "Calm Neutral Set" }
        ]);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  const addRecent = (value: string) => {
    if (!value.trim()) return;
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 5);
    setRecent(next);
    window.localStorage.setItem("recent_searches", JSON.stringify(next));
  };

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addRecent(query);
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-[#f7f4ef]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-6 py-4 md:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#1f1a17] md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <span className="h-4 w-4 border-b-2 border-t-2 border-[#1f1a17]" />
            </button>
            <Link href="/" className="text-lg font-semibold tracking-[0.3em] uppercase text-[#1f1a17]">
              Cherajama
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[#1f1a17] md:flex">
            {navLinks.map((link) =>
              link.label === "Categories" ? (
                <div key={link.label} className="group relative">
                  <Link href={link.href} className="transition hover:text-[#6b5f52]">
                    {link.label}
                  </Link>
                  <div className="absolute left-0 top-full hidden w-52 rounded-2xl border border-black/10 bg-white p-3 shadow-xl group-hover:block">
                    {categoryLinks.map((item) => (
                      <Link
                        key={item}
                        href={`/shop?category=${encodeURIComponent(item)}`}
                        className="block rounded-xl px-3 py-2 text-sm text-[#1f1a17] hover:bg-[#f3eee7]"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.label} href={link.href} className="transition hover:text-[#6b5f52]">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)}>
              <Icon>
                <SearchIcon />
              </Icon>
            </button>
            <Link href="/account/wishlist">
              <Icon>
                <HeartIcon />
              </Icon>
            </Link>
            <div className="relative">
              <button onClick={() => setProfileOpen((prev) => !prev)}>
                <Icon>
                  <UserIcon />
                </Icon>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                  {[
                    { label: "Sign In", href: "/signin" },
                    { label: "Create Account", href: "/signup" },
                    { label: "My Profile", href: "/account" },
                    { label: "My Orders", href: "/account/orders" },
                    { label: "Wishlist", href: "/account/wishlist" },
                    { label: "Account Settings", href: "/account/settings" },
                    { label: "Logout", href: "/" }
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm text-[#1f1a17] hover:bg-[#f3eee7]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/cart" className="relative">
              <Icon>
                <CartIcon />
              </Icon>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1f1a17] text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <form onSubmit={onSearchSubmit} className="flex items-center gap-3">
              <input
                className="w-full rounded-full border border-black/10 px-5 py-3 text-sm outline-none"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="submit"
                className="rounded-full bg-[#1f1a17] px-5 py-3 text-sm text-white"
              >
                Search
              </button>
            </form>
            {recent.length > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">Recent searches</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recent.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="rounded-full border border-black/10 px-3 py-1 text-xs text-[#1f1a17]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8e8375]">Suggestions</p>
                <div className="mt-2 grid gap-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setQuery(item.name);
                        addRecent(item.name);
                        setSearchOpen(false);
                        router.push(`/shop?search=${encodeURIComponent(item.name)}`);
                      }}
                      className="rounded-xl border border-black/10 px-4 py-2 text-left text-sm hover:bg-[#f3eee7]"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="mt-6 text-xs uppercase tracking-[0.2em] text-[#8e8375]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="h-full w-72 bg-white px-6 py-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.3em] text-[#1f1a17]">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-sm">
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-[#1f1a17]">
              {navLinks.map((link) =>
                link.label === "Categories" ? (
                  <details key={link.label} className="group">
                    <summary className="cursor-pointer list-none">Categories</summary>
                    <div className="mt-2 grid gap-2 pl-2 text-xs text-[#6b5f52]">
                      {categoryLinks.map((item) => (
                        <Link
                          key={item}
                          href={`/shop?category=${encodeURIComponent(item)}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                )
              )}
              <div className="mt-6 border-t border-black/10 pt-4 text-xs uppercase tracking-[0.2em] text-[#8e8375]">
                Account
              </div>
              <Link href="/signin" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)}>
                Create Account
              </Link>
              <Link href="/account" onClick={() => setMobileOpen(false)}>
                My Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;




