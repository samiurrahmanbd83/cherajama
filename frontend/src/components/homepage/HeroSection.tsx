import SectionShell from "./SectionShell";

const HeroSection = ({ section }: { section: any }) => {
  const config = section.config || {};
  const heading = config.heading || section.title || "Layers that move with you";
  const subheading =
    config.subheading || section.subtitle || "Tailored silhouettes, effortless textures, and calm neutrals.";
  const ctaLabel = config.cta_label || "Shop collection";
  const ctaUrl = config.cta_url || "/shop";
  const imageUrl = config.image_url || "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative w-full overflow-hidden bg-[#0b0c10] text-[#f4f1ea]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(240,200,140,0.18),_transparent_65%)]" />
      <div className="relative mx-auto grid w-full max-w-screen-2xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:px-10 lg:px-16">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#f0d9a8]">
            {config.eyebrow || "New arrivals"}
          </p>
          <h1
            className="mt-4 text-4xl md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {heading}
          </h1>
          <p className="mt-5 max-w-xl text-sm text-[#d9d0c2]">
            {subheading}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={ctaUrl}
              className="rounded-full bg-[#f0d9a8] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#0b0c10] transition hover:-translate-y-0.5"
            >
              {ctaLabel}
            </a>
            <a
              href="/lookbook"
              className="rounded-full border border-white/30 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/90 transition hover:bg-white/10"
            >
              View Lookbook
            </a>
            <span className="text-xs uppercase tracking-[0.3em] text-[#8d836d]">
              {config.tagline || "Sustainable staples"}
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-[#f0d9a8]/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={imageUrl}
              alt={heading}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
