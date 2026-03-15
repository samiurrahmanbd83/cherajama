import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Manrope, Playfair_Display } from "next/font/google";
import SectionRenderer from "../components/homepage/SectionRenderer";
import TrustSection from "../components/homepage/TrustSection";
import InstagramSection from "../components/homepage/InstagramSection";
import BestSellersSection from "../components/homepage/BestSellersSection";
import { HomepagePayload } from "../components/homepage/types";
import { buildApiUrl } from "../lib/api";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

type SeoPayload = {
  title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  og_type?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  nofollow?: boolean;
};

type HomeProps = {
  homepage: HomepagePayload | null;
  sections: HomepagePayload["sections"] | null;
  seo: SeoPayload | null;
  siteSeo: SeoPayload | null;
  settings: Record<string, any> | null;
};

const demoSections: HomepagePayload["sections"] = [
  {
    id: "demo-hero",
    type: "hero",
    title: "Layers that move with you",
    subtitle: "Tailored silhouettes, effortless textures, and calm neutrals.",
    content: "Tailored silhouettes, effortless textures, and calm neutrals.",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    position: 1,
    is_active: true,
    config: {
      eyebrow: "New arrivals",
      heading: "Layers that move with you",
      subheading: "Tailored silhouettes, effortless textures, and calm neutrals.",
      cta_label: "Shop collection",
      cta_url: "/shop",
      image_url:
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
      tagline: "Sustainable staples"
    }
  },
  {
    id: "demo-featured",
    type: "featured_products",
    title: "Featured Picks",
    subtitle: "Handpicked styles with effortless tailoring.",
    position: 2,
    is_active: true,
    config: {}
  },
  {
    id: "demo-categories",
    type: "categories",
    title: "Shop by Category",
    subtitle: "Curated wardrobes for every mood and moment.",
    position: 3,
    is_active: true,
    config: {}
  },
  {
    id: "demo-promo",
    type: "promo_banners",
    title: "City Uniform Collection",
    subtitle: "Seasonal edits and limited releases.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    position: 4,
    is_active: true,
    config: {
      banners: [
        {
          image_url:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
          label: "City Uniform Collection",
          cta_url: "/shop"
        }
      ]
    }
  },
  {
    id: "demo-reviews",
    type: "customer_reviews",
    title: "Customer Reviews",
    subtitle: "Honest notes from the community.",
    position: 5,
    is_active: true,
    config: {}
  },
  {
    id: "demo-newsletter",
    type: "newsletter",
    title: "Stay in Touch",
    subtitle: "Get first access to releases and private sales.",
    position: 6,
    is_active: true,
    config: {}
  }
];

const buildRobotsContent = (seo?: SeoPayload | null) => {
  if (!seo) return undefined;
  const directives = [] as string[];
  if (seo.noindex) directives.push("noindex");
  if (seo.nofollow) directives.push("nofollow");
  return directives.length ? directives.join(", ") : undefined;
};

export default function Home({ homepage, sections, seo, siteSeo, settings }: HomeProps) {
  const fallbackSections = sections && sections.length ? sections : demoSections;
  const [clientHomepage, setClientHomepage] = useState<HomepagePayload | null>(homepage);
  const [clientSections, setClientSections] = useState<HomepagePayload["sections"] | null>(
    fallbackSections || homepage?.sections || demoSections
  );

  useEffect(() => {
    const shouldFetch = !clientSections || clientSections.length === 0;
    if (!shouldFetch) return;

    const load = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/homepage"));
        const data = await res.json();
        if (!res.ok) return;
        const nextHomepage = data.data?.homepage || null;
        const nextSections = data.data?.sections || data.data?.homepage?.sections || null;
        setClientHomepage(nextHomepage);
        setClientSections(nextSections && nextSections.length ? nextSections : demoSections);
      } catch {
        // ignore client fallback errors
      }
    };

    load();
  }, []);

  const resolvedSections = (clientSections || demoSections || [])
    .filter((section) => section.is_active)
    .sort((a, b) => {
      const aPos = a.position ?? a.sort_order ?? 0;
      const bPos = b.position ?? b.sort_order ?? 0;
      return aPos - bPos;
    });
  const finalSections = resolvedSections.length ? resolvedSections : demoSections;

  const resolvedSeo = seo || siteSeo;
  const title = resolvedSeo?.title || settings?.site_name || clientHomepage?.name || "Cherajama";
  const description = resolvedSeo?.meta_description || "";
  const keywords = resolvedSeo?.meta_keywords?.join(", ") || undefined;
  const robots = buildRobotsContent(resolvedSeo);

  return (
    <div className={`${manrope.variable} ${playfair.variable}`} style={{ fontFamily: "var(--font-manrope)" }}>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {robots && <meta name="robots" content={robots} />}
        {resolvedSeo?.canonical_url && (
          <link rel="canonical" href={resolvedSeo.canonical_url} />
        )}
        <link rel="icon" href={settings?.favicon_url || "/favicon.ico"} />
        <meta property="og:title" content={resolvedSeo?.og_title || title} />
        {description && (
          <meta property="og:description" content={resolvedSeo?.og_description || description} />
        )}
        {resolvedSeo?.og_image && <meta property="og:image" content={resolvedSeo.og_image} />}
        <meta property="og:type" content={resolvedSeo?.og_type || "website"} />
      </Head>

      {finalSections.length ? (
        <>
          {finalSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
          <BestSellersSection />
          <TrustSection />
          <InstagramSection />
        </>
      ) : (
        <section className="min-h-screen w-full bg-[#0b0c10] py-20 text-[#f5f3ef]">
          <div className="mx-auto w-full max-w-screen-2xl px-6 text-center md:px-10 lg:px-16">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f0d9a8]">Homepage</p>
            <h1 className="mt-4 text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Homepage builder is empty
            </h1>
            <p className="mt-4 text-sm text-[#b9b1a3]">
              Add sections from the admin Homepage Builder to publish your storefront layout.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  try {
    const homepageRes = await fetch(buildApiUrl("/api/homepage"));
    const homepageData = homepageRes.ok ? await homepageRes.json() : null;
    const homepage = homepageData?.data?.homepage || null;
    const sections = homepageData?.data?.sections || homepage?.sections || null;

    const [siteSeoRes, settingsRes] = await Promise.all([
      fetch(buildApiUrl("/api/seo/site")),
      fetch(buildApiUrl("/api/settings"))
    ]);
    const entitySeoRes = homepage?.id
      ? await fetch(buildApiUrl(`/api/seo/homepage/${homepage.id}`))
      : null;

    const siteSeoData = siteSeoRes.ok ? await siteSeoRes.json() : null;
    const settingsData = settingsRes.ok ? await settingsRes.json() : null;
    const entitySeoData = entitySeoRes?.ok ? await entitySeoRes.json() : null;

    return {
      props: {
        homepage,
        sections,
        seo: entitySeoData?.data?.seo || null,
        siteSeo: siteSeoData?.data?.seo || null,
        settings: settingsData?.data?.settings || null
      }
    };
  } catch {
    return { props: { homepage: null, sections: null, seo: null, siteSeo: null, settings: null } };
  }
};
