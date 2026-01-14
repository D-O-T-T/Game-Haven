import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertGame } from "@shared/routes";

export function useGames(params?: { search?: string; category?: string }) {
  // Construct query key that includes all active filters
  const queryKey = [api.games.list.path, params?.search, params?.category];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build URL with query params manually since fetch doesn't support a params object directly in the second arg easily
      const url = new URL(api.games.list.path, window.location.origin);
      if (params?.search) url.searchParams.append("search", params.search);
      if (params?.category) url.searchParams.append("category", params.category);
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch games");
      
      // Parse with Zod schema from routes
      return api.games.list.responses[200].parse(await res.json());
    },
  });
}

export function useGame(id: number) {
  return useQuery({
    queryKey: [api.games.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.games.get.path, { id });
      const res = await fetch(url);
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch game");
      
      return api.games.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertGame) => {
      const res = await fetch(api.games.create.path, {
        method: api.games.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Failed to create game");
      return api.games.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.games.list.path] });
    },
  });
}
