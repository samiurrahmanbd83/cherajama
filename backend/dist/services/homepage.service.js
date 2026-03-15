"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSections = exports.deleteSection = exports.updateSection = exports.createSection = exports.listSections = exports.deleteHomepage = exports.updateHomepage = exports.createHomepage = exports.getHomepageById = exports.getHomepageBySlug = exports.getActiveHomepage = exports.listHomepages = void 0;
const pool_1 = require("../database/pool");
const AppError_1 = require("../utils/AppError");
const slugify_1 = require("../utils/slugify");
const settings_service_1 = require("./settings.service");
const SECTION_TYPES = [
    "hero",
    "featured_products",
    "categories",
    "flash_sale",
    "promo_banners",
    "customer_reviews",
    "newsletter",
    "footer"
];
const DEFAULT_SECTIONS = [
    {
        type: "hero",
        title: "New Season Essentials",
        subtitle: "Elevated staples crafted for everyday comfort.",
        config: {
            eyebrow: "New arrivals",
            heading: "Layers that move with you",
            subheading: "Tailored silhouettes, effortless textures, and calm neutrals.",
            cta_label: "Shop collection",
            cta_url: "/",
            tagline: "Sustainable staples"
        }
    },
    {
        type: "featured_products",
        title: "Featured Picks",
        subtitle: "Handpicked styles with effortless tailoring.",
        config: {
            product_ids: []
        }
    },
    {
        type: "categories",
        title: "Shop by Category",
        subtitle: "Curated wardrobes for every mood and moment.",
        config: {
            category_ids: []
        }
    },
    {
        type: "flash_sale",
        title: "Flash Sale",
        subtitle: "Limited-time drops. Move fast.",
        config: {}
    },
    {
        type: "promo_banners",
        title: "Promotions",
        subtitle: "Seasonal edits and limited releases.",
        config: {
            banners: []
        }
    },
    {
        type: "customer_reviews",
        title: "Customer Reviews",
        subtitle: "Honest notes from the community.",
        config: {
            limit: 6
        }
    },
    {
        type: "newsletter",
        title: "Newsletter",
        subtitle: "Get first access to releases and private sales.",
        config: {}
    },
    {
        type: "footer",
        config: {
            brand: "Cherajama",
            tagline: "Designed for presence, crafted for comfort.",
            columns: [
                { title: "Company", links: ["About", "Sustainability", "Careers"] },
                { title: "Support", links: ["Contact", "Shipping", "Returns"] },
                { title: "Explore", links: ["Lookbook", "Stores", "Gift cards"] }
            ]
        }
    }
];
const ensureDefaultHomepage = async () => {
    const active = await pool_1.db.query(`SELECT id
     FROM homepages
     WHERE is_active = TRUE
     LIMIT 1`);
    if (active.rows[0]) {
        return active.rows[0].id;
    }
    const baseSlug = (0, slugify_1.slugify)("Default Homepage");
    let slug = baseSlug;
    let counter = 1;
    while (true) {
        const exists = await pool_1.db.query("SELECT id FROM homepages WHERE slug = $1", [slug]);
        if (!exists.rows[0])
            break;
        slug = `${baseSlug}-${counter++}`;
    }
    const pool = (0, pool_1.getPool)();
    await pool.query("BEGIN");
    try {
        await pool_1.db.query("UPDATE homepages SET is_active = FALSE");
        const homepageResult = await pool_1.db.query(`INSERT INTO homepages (name, slug, is_active)
       VALUES ($1, $2, TRUE)
       RETURNING id`, ["Default Homepage", slug]);
        const homepageId = homepageResult.rows[0].id;
        for (let index = 0; index < DEFAULT_SECTIONS.length; index += 1) {
            const section = DEFAULT_SECTIONS[index];
            await pool_1.db.query(`INSERT INTO homepage_sections (homepage_id, type, title, subtitle, config, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)`, [
                homepageId,
                section.type,
                section.title ?? null,
                section.subtitle ?? null,
                section.config ?? {},
                index + 1
            ]);
        }
        await pool.query("COMMIT");
        return homepageId;
    }
    catch (error) {
        await pool.query("ROLLBACK");
        throw error;
    }
};
const ensureDefaultSections = async (homepageId) => {
    const existing = await pool_1.db.query("SELECT COUNT(*)::int AS count FROM homepage_sections WHERE homepage_id = $1", [homepageId]);
    const count = Number(existing.rows[0]?.count ?? 0);
    if (count > 0) {
        return;
    }
    const pool = (0, pool_1.getPool)();
    await pool.query("BEGIN");
    try {
        for (let index = 0; index < DEFAULT_SECTIONS.length; index += 1) {
            const section = DEFAULT_SECTIONS[index];
            await pool_1.db.query(`INSERT INTO homepage_sections (homepage_id, type, title, subtitle, config, sort_order, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)`, [
                homepageId,
                section.type,
                section.title ?? null,
                section.subtitle ?? null,
                section.config ?? {},
                index + 1
            ]);
        }
        await pool.query("COMMIT");
    }
    catch (error) {
        await pool.query("ROLLBACK");
        throw error;
    }
};
const fetchProductsByIds = async (ids) => {
    if (!ids.length)
        return [];
    const result = await pool_1.db.query(`SELECT id, name, slug, description, price, sale_price, stock, rating
     FROM products
     WHERE id = ANY($1::uuid[])
     ORDER BY array_position($1::uuid[], id)`, [ids]);
    return result.rows;
};
const fetchCategoriesByIds = async (ids) => {
    if (!ids.length)
        return [];
    const result = await pool_1.db.query(`SELECT id, name, slug, description, image
     FROM categories
     WHERE id = ANY($1::uuid[])
     ORDER BY array_position($1::uuid[], id)`, [ids]);
    return result.rows;
};
const fetchReviews = async (input) => {
    const limit = input.limit ?? 6;
    const values = [limit];
    let whereClause = "WHERE r.is_approved = TRUE";
    if (input.product_id) {
        whereClause += " AND r.product_id = $2";
        values.push(input.product_id);
    }
    const result = await pool_1.db.query(`SELECT r.id, r.rating, r.body, r.created_at,
            p.name AS product_name,
            u.first_name, u.last_name
     FROM reviews r
     JOIN products p ON p.id = r.product_id
     LEFT JOIN users u ON u.id = r.user_id
     ${whereClause}
     ORDER BY r.created_at DESC
     LIMIT $1`, values);
    return result.rows.map((row) => ({
        id: row.id,
        rating: row.rating,
        comment: row.body,
        review_date: row.created_at,
        product_name: row.product_name,
        user_name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || "Customer"
    }));
};
const hydrateSection = async (section) => {
    const config = section.config ?? {};
    const data = {};
    if (section.type === "featured_products" || section.type === "flash_sale") {
        const productIds = Array.isArray(config.product_ids) ? config.product_ids : [];
        data.products = await fetchProductsByIds(productIds);
    }
    if (section.type === "categories") {
        const categoryIds = Array.isArray(config.category_ids) ? config.category_ids : [];
        data.categories = await fetchCategoriesByIds(categoryIds);
    }
    if (section.type === "customer_reviews") {
        data.reviews = await fetchReviews({
            product_id: config.product_id,
            limit: config.limit
        });
    }
    if (section.type === "footer") {
        data.settings = await (0, settings_service_1.getSettings)();
    }
    return { ...section, config, data };
};
const listSectionsByHomepage = async (homepageId, includeInactive = true) => {
    const whereStatus = includeInactive ? "" : "AND is_active = TRUE";
    const result = await pool_1.db.query(`SELECT id, homepage_id, type, title, subtitle, content, image, position,
            config, sort_order, is_active, created_at, updated_at
     FROM homepage_sections
     WHERE homepage_id = $1 ${whereStatus}
     ORDER BY sort_order ASC, created_at ASC`, [homepageId]);
    return result.rows;
};
// List all homepages (admin)
const listHomepages = async () => {
    const result = await pool_1.db.query(`SELECT id, name, slug, is_active, created_at, updated_at
     FROM homepages
     ORDER BY created_at DESC`);
    return result.rows;
};
exports.listHomepages = listHomepages;
// Get active homepage with hydrated sections (public)
const getActiveHomepage = async () => {
    const active = await pool_1.db.query(`SELECT id, name, slug, is_active, created_at, updated_at
     FROM homepages
     WHERE is_active = TRUE
     ORDER BY updated_at DESC
     LIMIT 1`);
    if (!active.rows[0]) {
        const homepageId = await ensureDefaultHomepage();
        return (0, exports.getHomepageById)(homepageId, false);
    }
    await ensureDefaultSections(active.rows[0].id);
    return (0, exports.getHomepageById)(active.rows[0].id, false);
};
exports.getActiveHomepage = getActiveHomepage;
// Get homepage by slug with hydrated sections (public)
const getHomepageBySlug = async (slug) => {
    const result = await pool_1.db.query(`SELECT id, name, slug, is_active, created_at, updated_at
     FROM homepages
     WHERE slug = $1`, [slug]);
    if (!result.rows[0]) {
        throw new AppError_1.AppError("Homepage not found.", 404);
    }
    return (0, exports.getHomepageById)(result.rows[0].id, false);
};
exports.getHomepageBySlug = getHomepageBySlug;
// Get homepage by id (admin/public helper)
const getHomepageById = async (homepageId, includeInactive = true) => {
    const result = await pool_1.db.query(`SELECT id, name, slug, is_active, created_at, updated_at
     FROM homepages
     WHERE id = $1`, [homepageId]);
    const homepage = result.rows[0];
    if (!homepage) {
        throw new AppError_1.AppError("Homepage not found.", 404);
    }
    const sections = await listSectionsByHomepage(homepageId, includeInactive);
    const hydratedSections = await Promise.all(sections.map((section) => hydrateSection(section)));
    return { ...homepage, sections: hydratedSections };
};
exports.getHomepageById = getHomepageById;
// Create homepage (admin)
const createHomepage = async (input) => {
    const slug = (0, slugify_1.slugify)(input.name);
    const existing = await pool_1.db.query("SELECT id FROM homepages WHERE slug = $1", [slug]);
    if (existing.rows.length) {
        throw new AppError_1.AppError("Homepage already exists.", 409);
    }
    const isActive = input.is_active ?? true;
    if (isActive) {
        await pool_1.db.query("UPDATE homepages SET is_active = FALSE");
    }
    const result = await pool_1.db.query(`INSERT INTO homepages (name, slug, is_active)
     VALUES ($1, $2, $3)
     RETURNING id, name, slug, is_active, created_at, updated_at`, [input.name, slug, isActive]);
    return result.rows[0];
};
exports.createHomepage = createHomepage;
// Update homepage (admin)
const updateHomepage = async (homepageId, input) => {
    const existing = await pool_1.db.query("SELECT id FROM homepages WHERE id = $1", [homepageId]);
    if (!existing.rows[0]) {
        throw new AppError_1.AppError("Homepage not found.", 404);
    }
    const updates = [];
    const values = [];
    let index = 1;
    const setValue = (column, value) => {
        if (value === undefined)
            return;
        updates.push(`${column} = $${index++}`);
        values.push(value);
    };
    if (input.name) {
        const slug = (0, slugify_1.slugify)(input.name);
        const slugCheck = await pool_1.db.query("SELECT id FROM homepages WHERE slug = $1 AND id <> $2", [slug, homepageId]);
        if (slugCheck.rows.length) {
            throw new AppError_1.AppError("Homepage slug already exists.", 409);
        }
        setValue("name", input.name);
        setValue("slug", slug);
    }
    if (input.is_active === true) {
        await pool_1.db.query("UPDATE homepages SET is_active = FALSE WHERE id <> $1", [homepageId]);
    }
    setValue("is_active", input.is_active);
    if (!updates.length) {
        const result = await pool_1.db.query(`SELECT id, name, slug, is_active, created_at, updated_at
       FROM homepages WHERE id = $1`, [homepageId]);
        return result.rows[0];
    }
    updates.push("updated_at = NOW()");
    values.push(homepageId);
    await pool_1.db.query(`UPDATE homepages SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const result = await pool_1.db.query(`SELECT id, name, slug, is_active, created_at, updated_at
     FROM homepages WHERE id = $1`, [homepageId]);
    return result.rows[0];
};
exports.updateHomepage = updateHomepage;
// Delete homepage (admin)
const deleteHomepage = async (homepageId) => {
    const result = await pool_1.db.query("DELETE FROM homepages WHERE id = $1 RETURNING id", [homepageId]);
    if (!result.rows[0]) {
        throw new AppError_1.AppError("Homepage not found.", 404);
    }
    return { id: result.rows[0].id };
};
exports.deleteHomepage = deleteHomepage;
// List sections for a homepage (admin)
const listSections = async (homepageId) => {
    const homepage = await pool_1.db.query("SELECT id FROM homepages WHERE id = $1", [homepageId]);
    if (!homepage.rows[0]) {
        throw new AppError_1.AppError("Homepage not found.", 404);
    }
    const sections = await listSectionsByHomepage(homepageId, true);
    return sections.map((section) => ({
        ...section,
        config: section.config ?? {}
    }));
};
exports.listSections = listSections;
// Create section (admin)
const createSection = async (homepageId, input) => {
    const homepage = await pool_1.db.query("SELECT id FROM homepages WHERE id = $1", [homepageId]);
    if (!homepage.rows[0]) {
        throw new AppError_1.AppError("Homepage not found.", 404);
    }
    if (!SECTION_TYPES.includes(input.type)) {
        throw new AppError_1.AppError("Invalid homepage section type.", 400);
    }
    let sortOrder = input.sort_order;
    if (sortOrder === undefined) {
        const maxOrder = await pool_1.db.query("SELECT COALESCE(MAX(sort_order), 0) AS max FROM homepage_sections WHERE homepage_id = $1", [homepageId]);
        sortOrder = Number(maxOrder.rows[0].max) + 1;
    }
    const result = await pool_1.db.query(`INSERT INTO homepage_sections (homepage_id, type, title, subtitle, config, sort_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, homepage_id, type, title, subtitle, config, sort_order, is_active, created_at, updated_at`, [
        homepageId,
        input.type,
        input.title ?? null,
        input.subtitle ?? null,
        input.config ?? {},
        sortOrder,
        input.is_active ?? true
    ]);
    return result.rows[0];
};
exports.createSection = createSection;
// Update section (admin)
const updateSection = async (sectionId, input) => {
    const existing = await pool_1.db.query("SELECT id FROM homepage_sections WHERE id = $1", [sectionId]);
    if (!existing.rows[0]) {
        throw new AppError_1.AppError("Homepage section not found.", 404);
    }
    const updates = [];
    const values = [];
    let index = 1;
    const setValue = (column, value) => {
        if (value === undefined)
            return;
        updates.push(`${column} = $${index++}`);
        values.push(value);
    };
    if (input.type) {
        if (!SECTION_TYPES.includes(input.type)) {
            throw new AppError_1.AppError("Invalid homepage section type.", 400);
        }
        setValue("type", input.type);
    }
    setValue("title", input.title);
    setValue("subtitle", input.subtitle);
    setValue("config", input.config ?? undefined);
    setValue("sort_order", input.sort_order ?? undefined);
    setValue("is_active", input.is_active ?? undefined);
    if (!updates.length) {
        const result = await pool_1.db.query(`SELECT id, homepage_id, type, title, subtitle, config, sort_order, is_active, created_at, updated_at
       FROM homepage_sections WHERE id = $1`, [sectionId]);
        return result.rows[0];
    }
    updates.push("updated_at = NOW()");
    values.push(sectionId);
    await pool_1.db.query(`UPDATE homepage_sections SET ${updates.join(", ")} WHERE id = $${index}`, values);
    const result = await pool_1.db.query(`SELECT id, homepage_id, type, title, subtitle, config, sort_order, is_active, created_at, updated_at
     FROM homepage_sections WHERE id = $1`, [sectionId]);
    return result.rows[0];
};
exports.updateSection = updateSection;
// Delete section (admin)
const deleteSection = async (sectionId) => {
    const result = await pool_1.db.query("DELETE FROM homepage_sections WHERE id = $1 RETURNING id", [sectionId]);
    if (!result.rows[0]) {
        throw new AppError_1.AppError("Homepage section not found.", 404);
    }
    return { id: result.rows[0].id };
};
exports.deleteSection = deleteSection;
// Reorder sections (drag & drop)
const reorderSections = async (homepageId, items) => {
    const ids = items.map((item) => item.id);
    const existing = await pool_1.db.query("SELECT id FROM homepage_sections WHERE homepage_id = $1 AND id = ANY($2::uuid[])", [homepageId, ids]);
    if (existing.rows.length !== items.length) {
        throw new AppError_1.AppError("One or more homepage sections are invalid.", 400);
    }
    const pool = (0, pool_1.getPool)();
    await pool.query("BEGIN");
    try {
        for (const item of items) {
            await pool_1.db.query(`UPDATE homepage_sections
         SET sort_order = $1, updated_at = NOW()
         WHERE id = $2`, [item.sort_order, item.id]);
        }
        await pool.query("COMMIT");
    }
    catch (error) {
        await pool.query("ROLLBACK");
        throw error;
    }
    return { updated: items.length };
};
exports.reorderSections = reorderSections;
