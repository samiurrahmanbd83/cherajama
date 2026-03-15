import SectionShell from "./SectionShell";
import ProductCard from "../ui/ProductCard";

const items = [
  {
    id: "best-1",
    name: "Soft Tailored Blazer",
    price: 149,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "best-2",
    name: "Signature Knit",
    price: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "best-3",
    name: "Calm Neutral Set",
    price: 129,
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "best-4",
    name: "City Uniform Coat",
    price: 189,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"
  }
];

const BestSellersSection = () => {
  return (
    <SectionShell eyebrow="Best Sellers" title="Most Loved Pieces" subtitle="Customer favorites that sell out fast.">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            badge="Best"
          />
        ))}
      </div>
    </SectionShell>
  );
};

export default BestSellersSection;
