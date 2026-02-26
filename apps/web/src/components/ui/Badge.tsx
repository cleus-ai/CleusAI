import { clsx } from "clsx";
const variants = { default: "bg-zinc-800 text-zinc-300", violet: "bg-violet-900/50 text-violet-300 border border-violet-700", green: "bg-green-900/50 text-green-300 border border-green-700", red: "bg-red-900/50 text-red-300 border border-red-700", yellow: "bg-yellow-900/50 text-yellow-300 border border-yellow-700" };
export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: keyof typeof variants; className?: string }) {
  return <span className={clsx("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>{children}</span>;
}
