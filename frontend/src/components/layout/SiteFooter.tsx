import Link from "next/link";

const footerLinks = [
  {
    title: "Company",
    links: ["About", "Sustainability", "Careers"]
  },
  {
    title: "Support",
    links: ["Contact", "Shipping", "Returns"]
  },
  {
    title: "Explore",
    links: ["Lookbook", "Stores", "Gift Cards"]
  }
];

const SiteFooter = () => {
  return (
    <footer className="mt-16 w-full border-t border-black/5 bg-[#111111] py-12 text-[#f5f1ea]">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-10 px-6 md:grid-cols-[1.2fr_2fr] md:px-10 lg:px-16">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9bba5]">Cherajama</p>
          <p className="mt-4 text-sm text-[#d6cec2]">
            Crafted with intention. Designed for a premium everyday wardrobe.
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#c9bba5]">
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17" cy="7" r="1" fill="currentColor" />
              </svg>
              Instagram
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Facebook
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 9.5v7c0 .8.8 1.4 1.6 1l7.4-3.8c.9-.4.9-1.6 0-2L10.6 8.5C9.8 8.1 9 8.7 9 9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              TikTok
            </span>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <p className="text-xs uppercase tracking-[0.3em] text-[#c9bba5]">{column.title}</p>
              <div className="mt-4 grid gap-2 text-sm text-[#f5f1ea]">
                {column.links.map((link) => (
                  <Link key={link} href="#" className="transition hover:text-white">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-2 px-6 text-xs text-[#c9bba5] md:px-10 lg:px-16">
        <span>Copyright {new Date().getFullYear()} Cherajama. All rights reserved.</span>
        <span>Privacy | Terms | Accessibility</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
