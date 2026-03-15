import SectionShell from "./SectionShell";

const PromoBannersSection = ({ section }: { section: any }) => {
  const banners = section.config?.banners || [];
  const title = section.title || "Promotions";
  const subtitle = section.subtitle || "Seasonal edits and limited releases.";

  const displayBanners = banners.length
    ? banners
    : [
        {
          image_url:
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
          label: "Resort Capsule",
          cta_url: "/"
        },
        {
          image_url:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
          label: "City Uniform",
          cta_url: "/"
        }
      ];

  return (
    <SectionShell eyebrow="Highlights" title={title} subtitle={subtitle}>
      <div className="grid gap-6 md:grid-cols-2">
        {displayBanners.map((banner: any, index: number) => (
          <a
            key={`${banner.label}-${index}`}
            href={banner.cta_url || "/"}
            className="group relative overflow-hidden rounded-3xl"
          >
            <img
              src={banner.image_url}
              alt={banner.label}
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#f0d9a8]">Collection</p>
              <p className="text-xl text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                {banner.label}
              </p>
              <button className="mt-3 rounded-full border border-white/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/90 transition hover:bg-white/10">
                Shop now
              </button>
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
};

export default PromoBannersSection;
