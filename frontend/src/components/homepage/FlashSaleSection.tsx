import SectionShell from "./SectionShell";

const FlashSaleSection = ({ section }: { section: any }) => {
  const products = section.data?.products || [];
  const title = section.title || "Flash Sale";
  const subtitle = section.subtitle || "Limited-time drops. Move fast.";
  const endsAt = section.config?.ends_at;

  return (
    <SectionShell eyebrow="Limited" title={title} subtitle={subtitle} tone="dark">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-[#141720] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f0d9a8]">Ends soon</p>
          <h3 className="mt-3 text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>
            {endsAt ? `Sale ends ${new Date(endsAt).toLocaleDateString()}` : "48-hour exclusive"}
          </h3>
          <p className="mt-3 text-sm text-[#b9b1a3]">
            Stack your favorites before the clock runs out.
          </p>
        </div>
        <div className="grid gap-4">
          {(products.length ? products : [{ id: "p1", name: "Weekend Jacket", price: 129 }]).map(
            (product: any) => (
              <div key={product.id} className="rounded-2xl border border-white/10 bg-[#10131a] p-4">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-[#b9b1a3]">Now ${Number(product.sale_price ?? product.price ?? 0).toFixed(2)}</p>
              </div>
            )
          )}
        </div>
      </div>
    </SectionShell>
  );
};

export default FlashSaleSection;
