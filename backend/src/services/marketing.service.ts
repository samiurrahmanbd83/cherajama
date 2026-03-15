import { db } from "../database/pool";

export type MarketingProvider = "meta_pixel" | "facebook_capi" | "tiktok_pixel";

const providers: MarketingProvider[] = ["meta_pixel", "facebook_capi", "tiktok_pixel"];

const ensureDefaults = async () => {
  const existing = await db.query<{ provider: MarketingProvider }>(
    "SELECT provider FROM marketing_integrations"
  );
  const existingSet = new Set(existing.rows.map((row) => row.provider));

  const missing = providers.filter((provider) => !existingSet.has(provider));
  if (!missing.length) return;

  for (const provider of missing) {
    await db.query(
      `INSERT INTO marketing_integrations (provider, tracking_id, is_enabled, config)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (provider) DO NOTHING`,
      [provider, null, false, {}]
    );
  }
};

export const listIntegrations = async () => {
  await ensureDefaults();
  const result = await db.query(
    `SELECT id, provider, tracking_id, is_enabled, config, created_at, updated_at
     FROM marketing_integrations
     ORDER BY provider ASC`
  );
  return result.rows;
};

export const getIntegration = async (provider: MarketingProvider) => {
  const result = await db.query(
    `SELECT id, provider, tracking_id, is_enabled, config, created_at, updated_at
     FROM marketing_integrations
     WHERE provider = $1`,
    [provider]
  );
  return result.rows[0] || null;
};

export const upsertIntegration = async (
  provider: MarketingProvider,
  input: { tracking_id?: string; is_enabled?: boolean; config?: Record<string, any> }
) => {
  const existing = await getIntegration(provider);

  const trackingId = input.tracking_id ?? existing?.tracking_id ?? null;
  const isEnabled = input.is_enabled ?? existing?.is_enabled ?? false;
  const config = input.config ?? existing?.config ?? {};

  if (!existing) {
    const inserted = await db.query(
      `INSERT INTO marketing_integrations (provider, tracking_id, is_enabled, config)
       VALUES ($1, $2, $3, $4)
       RETURNING id, provider, tracking_id, is_enabled, config, created_at, updated_at`,
      [provider, trackingId, isEnabled, config]
    );
    return inserted.rows[0];
  }

  const updated = await db.query(
    `UPDATE marketing_integrations
     SET tracking_id = $1,
         is_enabled = $2,
         config = $3,
         updated_at = NOW()
     WHERE provider = $4
     RETURNING id, provider, tracking_id, is_enabled, config, created_at, updated_at`,
    [trackingId, isEnabled, config, provider]
  );

  return updated.rows[0];
};

export const listEnabledIntegrations = async () => {
  const result = await db.query(
    `SELECT provider, tracking_id, config
     FROM marketing_integrations
     WHERE is_enabled = TRUE`
  );
  return result.rows;
};
