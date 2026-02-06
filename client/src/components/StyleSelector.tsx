import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StyleOption {
  id: string;
  name: string;
  url: string;
  color: string;
}

interface StyleSelectorProps {
  styles: StyleOption[];
  selectedStyle: string;
  onSelect: (url: string) => void;
}

export function StyleSelector({ styles, selectedStyle, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {styles.map((style) => {
        const isSelected = selectedStyle === style.url;

        return (
          <motion.button
            key={style.id}
            onClick={() => onSelect(style.url)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "group relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300",
              isSelected
                ? "border-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-background grayscale-0"
                : "border-border/50 hover:border-primary/50 grayscale opacity-70 hover:opacity-100 hover:grayscale-0"
            )}
          >
            {/* Background Image Preview */}
            <img
              src={style.url}
              alt={style.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <span className={cn(
                "text-xs font-gaming tracking-widest uppercase transition-colors",
                isSelected ? "text-primary text-shadow-glow" : "text-white/80"
              )}>
                {style.name}
              </span>
            </div>

            {/* Selection Indicator */}
            {isSelected && !style.url.includes("1style.png") && !style.url.includes("2style.png") && !style.url.includes("3style.png") && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_currentColor] animate-pulse" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
