"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Image, Video, BookOpen, Users, Newspaper, Users2, Settings } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/image-gen", icon: Image, label: "Images" },
  { href: "/video-gen", icon: Video, label: "Video" },
  { href: "/story", icon: BookOpen, label: "Story" },
  { href: "/characters", icon: Users, label: "Characters" },
  { href: "/news", icon: Newspaper, label: "News" },
  { href: "/group-discuss", icon: Users2, label: "Group" },
];

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="w-16 flex flex-col items-center py-4 bg-zinc-950 border-r border-zinc-800 gap-1">
      <Link href="/" className="mb-4 w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">C</span>
      </Link>
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href}
          className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", pathname.startsWith(href) ? "bg-violet-600/20 text-violet-400" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800")}>
          <Icon className="w-5 h-5" />
          <span className="sr-only">{label}</span>
        </Link>
      ))}
      <div className="mt-auto">
        <Link href="/settings" className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
}
