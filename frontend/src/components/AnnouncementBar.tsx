import { useEffect, useMemo, useState } from "react";
import { getApiBase } from "../lib/api";

type Announcement = {
  message?: string;
  link_url?: string | null;
  background_color?: string;
  text_color?: string;
  is_active?: boolean;
};

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const apiBase = useMemo(() => getApiBase(), []);

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const res = await fetch(`${apiBase}/api/announcement`);
        const data = await res.json();
        if (res.ok) {
          setAnnouncement(data.data.announcement);
        }
      } catch {
        // ignore
      }
    };

    loadAnnouncement();
  }, []);

  if (!announcement?.is_active || !announcement?.message) return null;

  const content = (
    <span className="text-sm">
      {announcement.message}
    </span>
  );

  return (
    <div
      className="sticky top-0 z-50 w-full px-4 py-2 text-center"
      style={{
        background: announcement.background_color || "#111827",
        color: announcement.text_color || "#ffffff"
      }}
    >
      {announcement.link_url ? (
        <a
          href={announcement.link_url}
          className="underline underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default AnnouncementBar;
