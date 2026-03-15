const TrustSection = () => {
  const items = [
    { title: "Free Shipping", subtitle: "On orders over $120", icon: "truck" },
    { title: "30 Day Returns", subtitle: "Flexible, no-fuss policy", icon: "return" },
    { title: "Secure Payment", subtitle: "Protected checkout flow", icon: "lock" },
    { title: "Premium Quality", subtitle: "Crafted with care", icon: "badge" }
  ];

  return (
    <section className="w-full bg-[#f7f4ef] py-16">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 px-6 md:grid-cols-4 md:px-10 lg:px-16">
        {items.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-black/10 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-[#f7f4ef] text-[#1f1a17]">
              {item.icon === "truck" && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h11v8H3V6Z M14 9h4l3 3v2h-7V9Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
              {item.icon === "return" && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 7l-4 4 4 4 M3 11h10a6 6 0 1 1 0 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {item.icon === "lock" && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {item.icon === "badge" && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l3 2 3.5.5.5 3.5 2 3-2 3-.5 3.5-3.5.5-3 2-3-2-3.5-.5-.5-3.5-2-3 2-3 .5-3.5L9 5l3-2Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Benefit</p>
            <p className="mt-2 text-lg font-semibold text-[#1f1a17]">{item.title}</p>
            <p className="mt-2 text-sm text-[#6b5f52]">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;
