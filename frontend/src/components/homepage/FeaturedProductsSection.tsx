import SectionShell from "./SectionShell";
import ProductCard from "../ui/ProductCard";

const FeaturedProductsSection = ({ section }: { section: any }) => {
  const products = section.data?.products || [];
  const title = section.title || "Featured Picks";
  const subtitle = section.subtitle || "Handpicked styles with effortless tailoring.";

  const displayProducts = products.length
    ? products
    : Array.from({ length: 4 }).map((_, index) => ({
        id: `placeholder-${index}`,
        name: "Signature Knit",
        description: "Soft-touch layering piece",
        price: 89,
        sale_price: null,
        rating: 4.7
      }));

  return (
    <SectionShell eyebrow="Featured" title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {displayProducts.map((product: any, index: number) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={Number(product.sale_price ?? product.price ?? 0)}
            rating={Number(product.rating ?? 4.7)}
            image={
              product.image ||
              `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80&sig=${index}`
            }
            badge={index < 2 ? "Best seller" : undefined}
          />
        ))}
      </div>
    </SectionShell>
  );
};

export default FeaturedProductsSection;
