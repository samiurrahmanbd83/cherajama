import Head from "next/head";

const lookbookImages = Array.from({ length: 6 }).map((_, index) => ({
  id: index,
  url: `https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80&sig=${index}`
}));

const LookbookPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <Head>
        <title>Lookbook | Cherajama</title>
      </Head>

      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8e8375]">Lookbook</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#1f1a17]" style={{ fontFamily: "var(--font-serif)" }}>
            City Uniform Collection
          </h1>
          <p className="mt-4 text-sm text-[#6b5f52]">
            Editorial styling notes featuring calm neutrals, tailored layers, and soft textures built for the modern rhythm.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lookbookImages.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="Lookbook" className="h-72 w-full object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;
