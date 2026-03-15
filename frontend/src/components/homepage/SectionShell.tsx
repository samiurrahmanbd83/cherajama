import { ReactNode } from "react";

// Shared wrapper for homepage sections
const SectionShell = ({
  eyebrow,
  title,
  subtitle,
  children,
  tone = "light"
}: {
  eyebrow?: string;
  title?: string | null;
  subtitle?: string | null;
  children: ReactNode;
  tone?: "light" | "dark";
}) => {
  const base = tone === "dark"
    ? "bg-[#0d0f14] text-[#f5f3ef]"
    : "bg-[#f7f4ef] text-[#141414]";
  const subtitleTone = tone === "dark" ? "text-[#b9b1a3]" : "text-[#5b5b5b]";
  const eyebrowTone = tone === "dark" ? "text-[#f0d9a8]" : "text-[#8d836d]";

  return (
    <section className={`${base} w-full py-16`}>
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16">
        {(eyebrow || title || subtitle) && (
          <header className="mb-10">
            {eyebrow && (
              <p className={`text-xs uppercase tracking-[0.35em] ${eyebrowTone}`}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 text-3xl md:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-3 max-w-2xl text-sm ${subtitleTone}`}>
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionShell;
