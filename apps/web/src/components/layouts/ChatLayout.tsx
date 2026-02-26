"use client";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { MainNav } from "@/components/shared/MainNav";

export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <MainNav />
      <ConversationSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
