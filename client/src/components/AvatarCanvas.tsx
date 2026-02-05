import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface AvatarCanvasProps {
  styleUrl: string;
  nickname: string;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export function AvatarCanvas({ styleUrl, nickname, onCanvasReady }: AvatarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions (Square format is typical for avatars)
    const size = 1000; // High resolution
    canvas.width = size;
    canvas.height = size;

    const render = async () => {
      setLoading(true);
      
      try {
        // 1. Clear Canvas
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, size, size);

        // 2. Load and Draw Background Style
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.src = styleUrl;
        await new Promise((resolve, reject) => {
          bgImg.onload = resolve;
          bgImg.onerror = reject;
        });

        // Maintain aspect ratio cover logic
        const aspect = bgImg.width / bgImg.height;
        let drawWidth = size;
        let drawHeight = size;
        if (aspect > 1) {
          drawWidth = size * aspect;
        } else {
          drawHeight = size / aspect;
        }
        const x = (size - drawWidth) / 2;
        const y = (size - drawHeight) / 2;
        
        ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);

        // 3. Draw Project Logo (Top Left)
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        // Fallback if logo.jpg doesn't exist yet, we don't want to break the app
        logoImg.src = "/images/logo.jpg";
        
        try {
          await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = () => {
               // Proceed without logo if missing
               resolve(null);
            };
          });
          
          // Draw logo with shadow
          const logoSize = size * 0.2; // 20% width
          const padding = size * 0.05;
          
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          
          // Circular clip for logo if desired, or just draw
          ctx.save();
          ctx.beginPath();
          // Optional: styling the logo placement
          // ctx.arc(padding + logoSize/2, padding + logoSize/2, logoSize/2, 0, Math.PI * 2);
          // ctx.clip();
          ctx.drawImage(logoImg, padding, padding, logoSize, logoSize);
          ctx.restore();
          
          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

        } catch (e) {
          console.warn("Logo failed to load", e);
        }

        // 4. Draw Nickname (Center)
        if (nickname) {
          ctx.save();
          
          // Gaming text effect: Stroke + Glow
          const fontSize = Math.min(150, 800 / nickname.length); // Dynamic sizing
          ctx.font = `900 ${fontSize}px "Orbitron", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          const centerX = size / 2;
          const centerY = size / 2;

          // Shadow/Glow
          ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 8;
          ctx.shadowOffsetY = 8;
          
          // Outline
          ctx.strokeStyle = "rgba(0,0,0,0.8)";
          ctx.lineWidth = 15;
          ctx.strokeText(nickname, centerX, centerY);

          // Inner Text
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 0; // Clear shadow for sharp text
          ctx.shadowColor = "transparent";
          ctx.fillText(nickname, centerX, centerY);
          
          ctx.restore();
        }

        // 5. Draw Watermark "RAGE RUSSIA" (Bottom Center)
        ctx.save();
        ctx.font = `900 80px "Russo One", sans-serif`; // Distinctive watermark font
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.globalAlpha = 0.4; // 40% opacity
        
        // Gradient for watermark
        const gradient = ctx.createLinearGradient(0, size - 120, 0, size - 20);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#cccccc");
        ctx.fillStyle = gradient;
        
        ctx.fillText("RAGE RUSSIA", size / 2, size - 40);
        ctx.restore();

        // Notify parent that canvas is ready
        onCanvasReady(canvas);
        setLoading(false);

      } catch (err) {
        console.error("Canvas rendering failed:", err);
        setLoading(false);
      }
    };

    // Small delay to ensure fonts load
    document.fonts.ready.then(() => {
      render();
    });

  }, [styleUrl, nickname, onCanvasReady]);

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-border shadow-2xl bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
      />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <span className="text-primary font-gaming tracking-widest text-sm animate-pulse">RENDERING...</span>
          </div>
        </div>
      )}
    </div>
  );
}
