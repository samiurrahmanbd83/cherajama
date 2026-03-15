const FooterSection = ({ section }: { section: any }) => {
  const config = section.config || {};
  const settings = section.data?.settings || {};
  const columns = config.columns || [
    { title: "Company", links: ["About", "Sustainability", "Careers"] },
    { title: "Support", links: ["Contact", "Shipping", "Returns"] },
    { title: "Explore", links: ["Lookbook", "Stores", "Gift cards"] }
  ];
  const socialLinks = settings.social_links || {};

  return (
    <footer className="w-full bg-[#0b0c10] py-14 text-[#f5f3ef]">
      <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            {settings.logo_url && (
              <img
                src={settings.logo_url}
                alt={settings.site_name || "Logo"}
                className="h-10 object-contain"
              />
            )}
            <p className="text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
              {config.brand || settings.site_name || "Cherajama"}
            </p>
            <p className="mt-3 text-xs text-[#b9b1a3]">
              {config.tagline || settings.footer_text || "Designed for presence, crafted for comfort."}
            </p>
            {(settings.contact_email || settings.contact_phone) && (
              <div className="mt-4 text-xs text-[#d4ccbf]">
                {settings.contact_email && <p>{settings.contact_email}</p>}
                {settings.contact_phone && <p>{settings.contact_phone}</p>}
              </div>
            )}
            {Object.keys(socialLinks).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#f0d9a8]">
                {Object.entries(socialLinks).map(([label, url]) => (
                  <a key={label} href={String(url)} className="hover:underline">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          {columns.map((column: any, index: number) => (
            <div key={`${column.title}-${index}`}>
              <p className="text-xs uppercase tracking-[0.3em] text-[#f0d9a8]">
                {column.title}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[#d4ccbf]">
                {column.links.map((link: string, linkIndex: number) => (
                  <li key={`${link}-${linkIndex}`}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#8d836d]">
          {config.copyright || `\u00a9 ${new Date().getFullYear()} Cherajama. All rights reserved.`}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
