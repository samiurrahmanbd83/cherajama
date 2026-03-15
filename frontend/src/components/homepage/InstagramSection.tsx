const images = Array.from({ length: 6 }).map((_, index) => ({
  id: index,
  url: `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80&sig=${index}`
}));

const InstagramSection = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Social</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
              Follow us on Instagram
            </h2>
            <p className="mt-2 text-sm text-[#6b5f52]">
              A curated feed of textures, layers, and daily styling inspiration.
            </p>
          </div>
          <button className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#1f1a17]">
            @cherajama
          </button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-3xl bg-[#f3eee7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="Instagram" className="h-52 w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
