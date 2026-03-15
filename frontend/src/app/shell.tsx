"use client";

import AnnouncementBar from "@/components/AnnouncementBar";
import FloatingChatButtons from "@/components/FloatingChatButtons";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AnnouncementBar />
      {children}
      <FloatingChatButtons />
    </>
  );
};

export default AppShell;
