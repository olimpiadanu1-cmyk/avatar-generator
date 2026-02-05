import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type InsertAvatar } from "@shared/routes";

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
        { id: "style_red", name: "Crimson Rage", url: "/images/styles/style_red.png", color: "hsl(0 100% 50%)" },
        { id: "style_blue", name: "Cyber Blue", url: "/images/styles/style_blue.png", color: "hsl(210 100% 50%)" },
        { id: "style_green", name: "Toxic Venom", url: "/images/styles/style_green.png", color: "hsl(140 100% 50%)" },
        { id: "style_purple", name: "Void Walker", url: "/images/styles/style_purple.png", color: "hsl(270 100% 50%)" },
      ];
    },
  });
}
