import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../store/authStore";
import useAuthStore from "../store/authStore";

const fetchUserById = async (userId: string): Promise<User> => {
  if (!userId) throw new Error("No user id");
  const base = import.meta.env.VITE_API_BASE ?? import.meta.env.BASE_URL ?? "";
  const res = await fetch(`${base}/users/profile/${userId}`);
  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`Fetch user failed: ${txt}`);
  }
  return (await res.json()) as User;
};

export const useUser = (userId?: string | null) => {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user id");
      return fetchUserById(userId);
    },
    enabled: Boolean(userId),
    // v5: cacheTime -> gcTime (gc = garbage-collection time)
    gcTime: 1000 * 60 * 5, // 5 min before GC when query becomes inactive
    staleTime: 1000 * 60 * 2, // 2 min stale time
    retry: 1,
    // note: onSuccess/onError removed in v5 — useEffect below handles side effects
  });

  // side-effect: синхронизируем authStore при успешном получении
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query; // { data, isLoading, isError, error, refetch, ... }
};
