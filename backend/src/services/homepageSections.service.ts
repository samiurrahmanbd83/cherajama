import { db } from "../database/pool";
import { AppError } from "../utils/AppError";
import { slugify } from "../utils/slugify";

const SECTION_TYPES = [
  "hero",
  "featured_products",
  "categories",
  "promo_banners",
  "customer_reviews",
  "newsletter",
  "footer",
  "flash_sale"
] as const;

type SectionType = typeof SECTION_TYPES[number];

type HomepageSectionInput = {
  type: SectionType;
  title?: string | null;
  content?: string | null;
  image?: string | null;
  position?: number | null;
  is_active?: boolean;
};

const ensureHomepageId = async () => {
  const active = await db.query(
    `SELECT id
     FROM homepages
     WHERE is_active = TRUE
     LIMIT 1`
  );

  if (active.rows[0]) {
    return active.rows[0].id as string;
  }

  const baseSlug = slugify("Default Homepage");
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const exists = await db.query("SELECT id FROM homepages WHERE slug = $1", [slug]);
    if (!exists.rows[0]) break;
    slug = `${baseSlug}-${counter++}`;
  }

  await db.query("UPDATE homepages SET is_active = FALSE");
  const created = await db.query(
    `INSERT INTO homepages (name, slug, is_active)
     VALUES ($1, $2, TRUE)
     RETURNING id`,
    ["Default Homepage", slug]
  );

  return created.rows[0].id as string;
};

const seedDemoSections = async (homepageId: string) => {
  const demo = [
    {
      type: "hero" as const,
      title: "New Season Drop",
      content: "Curated essentials crafted for everyday wear.",
      image:
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80"
    },
    {
      type: "featured_products" as const,
      title: "Featured Picks",
      content: "Handpicked styles with effortless tailoring.",
      image: null
    },
    {
      type: "categories" as const,
      title: "Shop by Category",
      content: "Curated wardrobes for every mood and moment.",
      image: null
    },
    {
      type: "promo_banners" as const,
      title: "City Uniform",
      content: "Seasonal edits and limited releases.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
    },
    {
      type: "customer_reviews" as const,
      title: "Customer Reviews",
      content: "Honest notes from the community.",
      image: null
    },
    {
      type: "newsletter" as const,
      title: "Newsletter",
      content: "Get first access to releases and private sales.",
      image: null
    }
  ];

  for (let index = 0; index < demo.length; index += 1) {
    const section = demo[index];
    await db.query(
      `INSERT INTO homepage_sections
        (homepage_id, type, title, subtitle, content, image, position, config, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)`,
      [
        homepageId,
        section.type,
        section.title,
        section.content,
        section.content,
        section.image,
        index + 1,
        {},
        index + 1
      ]
    );
  }
};

export const listHomepageSections = async () => {
  const homepageId = await ensureHomepageId();

  const existing = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE is_active = TRUE)::int AS active
     FROM homepage_sections
     WHERE homepage_id = $1`,
    [homepageId]
  );

  const total = Number(existing.rows[0]?.total ?? 0);
  const active = Number(existing.rows[0]?.active ?? 0);

  if (total === 0) {
    await seedDemoSections(homepageId);
  } else if (active === 0) {
    await db.query(
      "UPDATE homepage_sections SET is_active = TRUE WHERE homepage_id = $1",
      [homepageId]
    );
  }

  const result = await db.query(
    `SELECT id, homepage_id, type, title, subtitle, content, image, position, config, sort_order, is_active
     FROM homepage_sections
     WHERE homepage_id = $1 AND is_active = TRUE
     ORDER BY COALESCE(position, sort_order) ASC, created_at ASC`,
    [homepageId]
  );

  return result.rows;
};

export const createHomepageSection = async (input: HomepageSectionInput) => {
  if (!SECTION_TYPES.includes(input.type)) {
    throw new AppError("Invalid homepage section type.", 400);
  }

  const homepageId = await ensureHomepageId();
  const positionResult = await db.query<{ max: number }>(
    "SELECT COALESCE(MAX(position), 0) AS max FROM homepage_sections WHERE homepage_id = $1",
    [homepageId]
  );

  const position = input.position ?? Number(positionResult.rows[0].max) + 1;

  const result = await db.query(
    `INSERT INTO homepage_sections
      (homepage_id, type, title, subtitle, content, image, position, config, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, type, title, subtitle, content, image, position, is_active`,
    [
      homepageId,
      input.type,
      input.title ?? null,
      input.content ?? null,
      input.content ?? null,
      input.image ?? null,
      position,
      {},
      position,
      input.is_active ?? true
    ]
  );

  return result.rows[0];
};

export const updateHomepageSection = async (sectionId: string, input: HomepageSectionInput) => {
  const existing = await db.query("SELECT id FROM homepage_sections WHERE id = $1", [sectionId]);
  if (!existing.rows[0]) {
    throw new AppError("Homepage section not found.", 404);
  }

  const updates: string[] = [];
  const values: Array<string | number | boolean | null> = [];
  let index = 1;

  const setValue = (column: string, value: string | number | boolean | null | undefined) => {
    if (value === undefined) return;
    updates.push(`${column} = $${index++}`);
    values.push(value);
  };

  if (input.type) {
    if (!SECTION_TYPES.includes(input.type)) {
      throw new AppError("Invalid homepage section type.", 400);
    }
    setValue("type", input.type);
  }

  setValue("title", input.title ?? null);
  setValue("subtitle", input.content ?? null);
  setValue("content", input.content ?? null);
  setValue("image", input.image ?? null);
  setValue("position", input.position ?? null);
  setValue("sort_order", input.position ?? null);
  setValue("is_active", input.is_active ?? undefined);

  if (!updates.length) {
    const current = await db.query(
      "SELECT id, type, title, subtitle, content, image, position, is_active FROM homepage_sections WHERE id = $1",
      [sectionId]
    );
    return current.rows[0];
  }

  updates.push("updated_at = NOW()");
  values.push(sectionId);

  await db.query(`UPDATE homepage_sections SET ${updates.join(", ")} WHERE id = $${index}`, values);

  const updated = await db.query(
    "SELECT id, type, title, subtitle, content, image, position, is_active FROM homepage_sections WHERE id = $1",
    [sectionId]
  );

  return updated.rows[0];
};

export const deleteHomepageSection = async (sectionId: string) => {
  const removed = await db.query(
    "DELETE FROM homepage_sections WHERE id = $1 RETURNING id",
    [sectionId]
  );

  if (!removed.rows[0]) {
    throw new AppError("Homepage section not found.", 404);
  }

  return { id: removed.rows[0].id };
};
