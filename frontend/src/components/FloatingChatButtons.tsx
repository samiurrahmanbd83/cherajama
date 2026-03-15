import { useEffect, useMemo, useState } from "react";
import { getApiBase } from "../lib/api";

type ChatSettings = {
  whatsapp_number?: string;
  whatsapp_message?: string;
  messenger_username?: string;
  is_enabled?: boolean;
};

const FloatingChatButtons = () => {
  const [settings, setSettings] = useState<ChatSettings | null>(null);

  const apiBase = useMemo(() => getApiBase(), []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(`${apiBase}/api/chat`);
        const data = await res.json();
        if (res.ok) {
          setSettings(data.data.settings);
        }
      } catch {
        // ignore
      }
    };

    loadSettings();
  }, []);

  if (!settings?.is_enabled) return null;

  const whatsappNumber = settings.whatsapp_number || "";
  const whatsappMessage = encodeURIComponent(settings.whatsapp_message || "Hello! I need help.");
  const messengerUsername = settings.messenger_username || "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : null;
  const messengerUrl = messengerUsername ? `https://m.me/${messengerUsername}` : null;

  if (!whatsappUrl && !messengerUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
          aria-label="Chat on WhatsApp"
        >
          WA
        </a>
      )}
      {messengerUrl && (
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg"
          aria-label="Chat on Messenger"
        >
          FB
        </a>
      )}
    </div>
  );
};

export default FloatingChatButtons;
