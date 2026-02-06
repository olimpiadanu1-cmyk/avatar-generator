import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertAvatar } from "@shared/schema";

export function useAvatars() {
  // Although not strictly needed for the canvas generator if it's purely client-side,
  // we might want to save generated avatars or fetch history later.
  return {
    // Placeholder for future history feature
  };
}

export function useCreateAvatar() {
  return useMutation({
    mutationFn: async (data: InsertAvatar) => {
      const res = await fetch(api.avatars.create.path, {
        method: api.avatars.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to save avatar generation stats");
      }

      return api.avatars.create.responses[201].parse(await res.json());
    }
  });
}

export function useStyles() {
  return useQuery({
    queryKey: [api.avatars.listStyles.path],
    queryFn: async () => {
      // In a real app with dynamic assets, this would fetch from API.
      // For now, we mock the styles based on requirements to ensure the UI works immediately
      // without needing the backend file system scanned perfectly first.
      return [
        { id: "style_1", name: "Style 1", url: "/images/styles/1style.png", color: "hsl(0 100% 50%)" },
        { id: "style_2", name: "Style 2", url: "/images/styles/2style.png", color: "hsl(210 100% 50%)" },
        { id: "style_3", name: "Style 3", url: "/images/styles/3style.png", color: "hsl(300 100% 50%)" },
      ];
    },
  });
}
