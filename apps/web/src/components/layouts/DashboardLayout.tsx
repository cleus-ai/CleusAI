"use client";
import { MainNav } from "@/components/shared/MainNav";
import { PageHeader } from "@/components/shared/PageHeader";

interface DashboardLayoutProps { title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode; }

export function DashboardLayout({ title, description, actions, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-950">
      <MainNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title={title} description={description} actions={actions} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
