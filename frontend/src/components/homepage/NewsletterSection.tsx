import SectionShell from "./SectionShell";

const NewsletterSection = ({ section }: { section: any }) => {
  const title = section.title || "Newsletter";
  const subtitle = section.subtitle || "Get first access to releases and private sales.";
  const config = section.config || {};

  return (
    <SectionShell eyebrow="Stay in touch" title={title} subtitle={subtitle}>
      <div className="rounded-3xl border border-[#e4dfd5] bg-white p-6 md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#5b5b5b]">
            {config.description || "We send thoughtful drops, never noise."}
          </p>
        </div>
        <form className="mt-4 flex w-full flex-col gap-3 md:mt-0 md:max-w-md md:flex-row">
          <input
            className="flex-1 rounded-full border border-[#ded7c9] bg-[#f7f4ef] px-4 py-3 text-sm"
            placeholder={config.placeholder || "Email address"}
            type="email"
          />
          <button
            type="button"
            className="rounded-full bg-[#0b0c10] px-6 py-3 text-sm font-semibold text-[#f5f3ef]"
          >
            {config.button_label || "Subscribe"}
          </button>
        </form>
      </div>
    </SectionShell>
  );
};

export default NewsletterSection;
