import { db } from "../database/pool";

// Fetch latest chat button settings
export const getChatButtons = async () => {
  const result = await db.query(
    `SELECT id, whatsapp_number, whatsapp_message, messenger_username, is_enabled,
            created_at, updated_at
     FROM chat_buttons
     ORDER BY created_at DESC
     LIMIT 1`
  );
  return result.rows[0] || null;
};

// Create or update chat button settings
export const upsertChatButtons = async (input: {
  whatsapp_number?: string;
  whatsapp_message?: string;
  messenger_username?: string;
  is_enabled?: boolean;
}) => {
  const existing = await getChatButtons();

  const whatsappNumber = input.whatsapp_number ?? existing?.whatsapp_number ?? null;
  const whatsappMessage = input.whatsapp_message ?? existing?.whatsapp_message ?? null;
  const messengerUsername = input.messenger_username ?? existing?.messenger_username ?? null;
  const isEnabled = input.is_enabled ?? existing?.is_enabled ?? true;

  if (!existing) {
    const inserted = await db.query(
      `INSERT INTO chat_buttons
        (whatsapp_number, whatsapp_message, messenger_username, is_enabled)
       VALUES ($1, $2, $3, $4)
       RETURNING id, whatsapp_number, whatsapp_message, messenger_username, is_enabled,
                 created_at, updated_at`,
      [whatsappNumber, whatsappMessage, messengerUsername, isEnabled]
    );
    return inserted.rows[0];
  }

  const updated = await db.query(
    `UPDATE chat_buttons
     SET whatsapp_number = $1,
         whatsapp_message = $2,
         messenger_username = $3,
         is_enabled = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, whatsapp_number, whatsapp_message, messenger_username, is_enabled,
               created_at, updated_at`,
    [whatsappNumber, whatsappMessage, messengerUsername, isEnabled, existing.id]
  );

  return updated.rows[0];
};
