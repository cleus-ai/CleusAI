import useSWR from "swr";
const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(r => r.json());
export function useCredits() {
  const { data, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, fetcher, { refreshInterval: 30000 });
  return { credits: data?.credits ?? 0, plan: data?.plan ?? "FREE", refresh: mutate };
}
