import SectionShell from "./SectionShell";

const CategoriesSection = ({ section }: { section: any }) => {
  const categories = section.data?.categories || [];
  const title = section.title || "Shop by Category";
  const subtitle = section.subtitle || "Curated wardrobes for every mood and moment.";

  const displayCategories = categories.length
    ? categories
    : [
        { id: "cat-1", name: "Outerwear" },
        { id: "cat-2", name: "Tailored" },
        { id: "cat-3", name: "Essentials" },
        { id: "cat-4", name: "Accessories" }
      ];

  return (
    <SectionShell eyebrow="Categories" title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayCategories.map((category: any) => (
          <div
            key={category.id}
            className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#f7f1e8] via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative z-10 flex items-end justify-between gap-3">
              <div>
                <p className="text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
                  {category.name}
                </p>
                <p className="text-xs text-[#8d836d]">Shop now</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#f0d9a8] transition group-hover:scale-110" />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

export default CategoriesSection;
