import useSWR from "swr";
const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(r => r.json());
export function useImageHistory() {
  const { data, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/images/history`, fetcher);
  return { images: data?.images ?? [], isLoading, refresh: mutate };
}
