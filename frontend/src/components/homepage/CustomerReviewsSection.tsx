import SectionShell from "./SectionShell";

const CustomerReviewsSection = ({ section }: { section: any }) => {
  const reviews = section.data?.reviews || [];
  const title = section.title || "Customer Reviews";
  const subtitle = section.subtitle || "Honest notes from the community.";

  const displayReviews = reviews.length
    ? reviews
    : [
        {
          id: "r1",
          rating: 5,
          comment: "The fit is flawless and the fabric feels premium.",
          user_name: "Amina K.",
          product_name: "Linen Set"
        },
        {
          id: "r2",
          rating: 4,
          comment: "Super soft and versatile. My new favorite layer.",
          user_name: "Jason R.",
          product_name: "Cable Knit"
        }
      ];

  return (
    <SectionShell eyebrow="Reviews" title={title} subtitle={subtitle}>
      <div className="grid gap-6 md:grid-cols-2">
        {displayReviews.map((review: any) => (
          <div key={review.id} className="rounded-3xl border border-[#e4dfd5] bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{review.user_name}</p>
              <p className="flex items-center gap-1 text-xs text-[#8d836d]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.9L12 16.7 6.7 19.7l1-5.9-4.2-4.1 5.9-.9L12 3.5Z"
                    stroke="#8d836d"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                {Number(review.rating).toFixed(1)}
              </p>
            </div>
            <p className="mt-4 text-sm text-[#5b5b5b]">{review.comment}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8d836d]">
              {review.product_name || "Verified purchase"}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
};

export default CustomerReviewsSection;
