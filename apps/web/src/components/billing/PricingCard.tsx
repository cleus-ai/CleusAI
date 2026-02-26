"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PricingCardProps { plan: "FREE" | "PRO" | "ENTERPRISE"; price: string; period?: string; features: string[]; isCurrentPlan?: boolean; onSelect?: () => void; }

export function PricingCard({ plan, price, period, features, isCurrentPlan, onSelect }: PricingCardProps) {
  const isPro = plan === "PRO";
  return (
    <div className={`rounded-2xl p-6 border ${isPro ? "border-violet-600 bg-violet-950/30" : "border-zinc-800 bg-zinc-900"}`}>
      {isPro && <div className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3">Most Popular</div>}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">{plan}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{price}</span>
          {period && <span className="text-zinc-400 text-sm">/{period}</span>}
        </div>
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
            <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />{f}
          </li>
        ))}
      </ul>
      <Button variant={isPro ? "primary" : "outline"} className="w-full" disabled={isCurrentPlan} onClick={onSelect}>
        {isCurrentPlan ? "Current Plan" : `Get ${plan}`}
      </Button>
    </div>
  );
}
