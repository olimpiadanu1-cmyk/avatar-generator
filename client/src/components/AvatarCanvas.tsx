import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface AvatarCanvasProps {
  styleUrl: string;
  nickname: string;
  textPosition?: "bottom" | "circle";
  fontFamily?: string;
  gradientStart?: string;
  gradientEnd?: string;
  fontSizeScale?: number;
  // Advanced FX
  glowIntensity?: number;
  outlineThickness?: number;
  letterSpacing?: number;
  // Positioning
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  icon?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isGrayscale?: boolean;
  showOutline?: boolean;
  outlineColor?: string;
  textTexture?: "none" | "metal" | "stone" | "carbon" | "gold" | "ice" | "lava";
  activeEffect?: "none" | "particles" | "scanlines" | "vignette" | "glitch" | "sniper" | "rain" | "vhs";
  // Advanced Transformation
  skewX?: number;
  stretchX?: number;
  isMirrored?: boolean;
  // Independent Icon Controls
  iconPosition?: "before" | "after";
  iconOffsetX?: number;
  iconOffsetY?: number;
  iconScale?: number;
  // New Features: Shapes & Overlays
  shape?: "square" | "circle" | "hexagon" | "shield";
  overlay?: "none" | "glass" | "blood" | "smoke" | "lens_flare";
  overlaySeed?: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export function AvatarCanvas({
  styleUrl,
  nickname,
  textPosition = "bottom",
  fontFamily = "Russo One",
  gradientStart,
  gradientEnd,
  fontSizeScale = 1,
  glowIntensity = 1,
  outlineThickness = 1,
  letterSpacing = 5,
  offsetX = 0,
  offsetY = 0,
  rotation = 0,
  icon = "none",
  isBold = false,
  isItalic = false,
  isGrayscale = false,
  showOutline = true,
  outlineColor = "#ffffff",
  textTexture = "none",
  activeEffect = "none",
  skewX = 0,
  stretchX = 1,
  isMirrored = false,
  iconPosition = "before",
  iconOffsetX = 0,
  iconOffsetY = 0,
  iconScale = 1,
  shape = "square",
  overlay = "none",
  overlaySeed = 0,
  onCanvasReady
}: AvatarCanvasProps) {
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
        // Helpers for Shapes and Overlays
        const applyShapeMask = (ctx: CanvasRenderingContext2D, size: number, shape: string) => {
          ctx.beginPath();
          if (shape === "circle") {
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          } else if (shape === "hexagon") {
            const r = size / 2;
            for (let i = 0; i < 6; i++) {
              const angle = (i * Math.PI) / 3 - Math.PI / 2;
              ctx.lineTo(size / 2 + r * Math.cos(angle), size / 2 + r * Math.sin(angle));
            }
          } else if (shape === "shield") {
            ctx.moveTo(0, 0);
            ctx.lineTo(size, 0);
            ctx.lineTo(size, size * 0.4);
            ctx.quadraticCurveTo(size, size, size / 2, size);
            ctx.quadraticCurveTo(0, size, 0, size * 0.4);
          } else {
            ctx.rect(0, 0, size, size);
          }
          ctx.closePath();
          ctx.clip();
        };

        const drawOverlay = (ctx: CanvasRenderingContext2D, size: number, overlay: string, seed: number) => {
          if (overlay === "none") return;

          // Simple Seeded Random (LCG)
          let currentSeed = seed || 1;
          const seededRandom = () => {
            currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
            return currentSeed / 4294967296;
          };

          ctx.save();
          if (overlay === "glass") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
              const cx = seededRandom() * size;
              const cy = seededRandom() * size;
              for (let j = 0; j < 6; j++) {
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + (seededRandom() - 0.5) * 400, cy + (seededRandom() - 0.5) * 400);
                ctx.stroke();
              }
            }
          } else if (overlay === "blood") {
            ctx.globalCompositeOperation = "multiply";
            for (let i = 0; i < 15; i++) {
              const bx = seededRandom() * size;
              const by = seededRandom() * size;
              const r = seededRandom() * 80 + 20;

              // Main splatter
              const bloodGrad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
              bloodGrad.addColorStop(0, "rgba(100, 0, 0, 0.8)");
              bloodGrad.addColorStop(0.8, "rgba(139, 0, 0, 0.6)");
              bloodGrad.addColorStop(1, "rgba(139, 0, 0, 0)");

              ctx.fillStyle = bloodGrad;
              ctx.beginPath();
              ctx.ellipse(bx, by, r, r * (0.5 + seededRandom() * 0.5), seededRandom() * Math.PI, 0, Math.PI * 2);
              ctx.fill();

              // Smaller droplets
              for (let j = 0; j < 5; j++) {
                ctx.beginPath();
                const dx = bx + (seededRandom() - 0.5) * r * 2;
                const dy = by + (seededRandom() - 0.5) * r * 2;
                ctx.arc(dx, dy, seededRandom() * 10, 0, Math.PI * 2);
                ctx.fill();
              }

              // Drip effect
              if (seededRandom() > 0.5) {
                const dripW = 2 + seededRandom() * 8;
                const dripL = seededRandom() * 200 + 50;
                ctx.fillRect(bx - dripW / 2, by, dripW, dripL);
                ctx.beginPath();
                ctx.arc(bx, by + dripL, dripW * 1.5, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else if (overlay === "smoke") {
            const smoke = ctx.createRadialGradient(size / 2, size / 2, size * 0.2, size / 2, size / 2, size * 0.6);
            smoke.addColorStop(0, "rgba(50, 50, 50, 0)");
            smoke.addColorStop(1, "rgba(200, 200, 200, 0.4)");
            ctx.fillStyle = smoke;
            ctx.fillRect(0, 0, size, size);
          } else if (overlay === "lens_flare") {
            ctx.globalCompositeOperation = "screen";
            const fx = seededRandom() * size;
            const fy = seededRandom() * size;
            const cx = size / 2;
            const cy = size / 2;

            // 1. Flare center (starburst)
            const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, 400);
            g.addColorStop(0, "rgba(255, 255, 255, 1)");
            g.addColorStop(0.1, "rgba(255, 230, 150, 0.6)");
            g.addColorStop(0.5, "rgba(255, 150, 50, 0.1)");
            g.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, size, size);

            // 2. Diffraction spikes
            ctx.strokeStyle = "rgba(255, 240, 200, 0.2)";
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI) / 4;
              ctx.beginPath();
              ctx.moveTo(fx, fy);
              ctx.lineTo(fx + Math.cos(angle) * 1000, fy + Math.sin(angle) * 1000);
              ctx.stroke();
            }

            // 3. Spectral Ghosts (on the axis through the center)
            const dx = cx - fx;
            const dy = cy - fy;
            const ghostCount = 6;
            for (let i = 1; i <= ghostCount; i++) {
              const ratio = i / ghostCount + 0.5;
              const gx = fx + dx * ratio;
              const gy = fy + dy * ratio;
              const gr = seededRandom() * 100 + 20;

              ctx.beginPath();
              ctx.arc(gx, gy, gr, 0, Math.PI * 2);
              const colorShift = i * 40;
              ctx.fillStyle = `hsla(${colorShift}, 70%, 80%, 0.15)`;
              ctx.fill();
              ctx.strokeStyle = `hsla(${colorShift}, 70%, 80%, 0.1)`;
              ctx.stroke();
            }
          }
          ctx.restore();
        };

        // 1. Clear Canvas (Transparent for shapes)
        ctx.clearRect(0, 0, size, size);

        // Apply Shape Masking
        if (shape !== "square") {
          ctx.save();
          applyShapeMask(ctx, size, shape);
        }

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

        if (isGrayscale) {
          ctx.filter = "grayscale(100%)";
        }
        ctx.drawImage(bgImg, x, y, drawWidth, drawHeight);
        ctx.filter = "none";

        // 4. Draw Nickname
        if (nickname) {
          const isStyle3 = styleUrl.includes("3style.png");
          const isStyle2 = styleUrl.includes("2style.png");

          // Size configuration
          const maxFontSize = 180;
          const minFontSize = 100;

          // Draw Icon if selected
          const drawIcon = (ix: number, iy: number, iSize: number, iColor: string) => {
            if (icon === "none") return;
            ctx.save();
            ctx.translate(ix, iy);
            ctx.fillStyle = iColor;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 4;
            ctx.shadowColor = iColor;
            ctx.shadowBlur = 15;

            if (icon === "lightning") {
              ctx.beginPath();
              ctx.moveTo(0, -iSize / 2); ctx.lineTo(-iSize / 4, 0); ctx.lineTo(0, 0); ctx.lineTo(-iSize / 8, iSize / 2);
              ctx.lineTo(iSize / 4, 0); ctx.lineTo(0, 0); ctx.closePath();
              ctx.fill(); ctx.stroke();
            } else if (icon === "star") {
              const points = 5;
              const outerRadius = iSize / 2;
              const innerRadius = iSize / 4;
              ctx.beginPath();
              for (let i = 0; i < points * 2; i++) {
                const r = (i % 2 === 0) ? outerRadius : innerRadius;
                const a = (i * Math.PI) / points - Math.PI / 2;
                ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
              }
              ctx.closePath();
              ctx.fill(); ctx.stroke();
            } else if (icon === "shield") {
              ctx.beginPath();
              ctx.moveTo(-iSize / 2, -iSize / 2); ctx.lineTo(iSize / 2, -iSize / 2); ctx.lineTo(iSize / 2, 0);
              ctx.quadraticCurveTo(iSize / 2, iSize / 2, 0, iSize / 2);
              ctx.quadraticCurveTo(-iSize / 2, iSize / 2, -iSize / 2, 0); ctx.closePath();
              ctx.fill(); ctx.stroke();
            } else if (icon === "fire") {
              ctx.beginPath();
              ctx.moveTo(0, iSize / 2);
              ctx.bezierCurveTo(-iSize / 2, iSize / 4, -iSize / 2, -iSize / 4, 0, -iSize / 2);
              ctx.bezierCurveTo(iSize / 2, -iSize / 4, iSize / 2, iSize / 4, 0, iSize / 2);
              ctx.fill(); ctx.stroke();
            }
            ctx.restore();
          };

          // For Style 3 in circle mode, render text along an arc
          if (isStyle3 && textPosition === "circle") {
            const chars = nickname.toUpperCase().split("");
            const baseRadius = size * 0.12;
            const centerX = size / 2 + offsetX;
            const centerY = (size * 0.53) + offsetY;
            const fontSize = Math.min(100, 360 / nickname.length) * fontSizeScale;
            const fontWeight = isBold ? "900" : "700";
            const fontStyle = isItalic ? "italic" : "normal";

            ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const currentLetterSpacing = letterSpacing * 2;

            // 1. Calculate angles for each character
            const charData = chars.map(char => {
              const metrics = ctx.measureText(char);
              const width = metrics.width + currentLetterSpacing;
              const angleWidth = width / baseRadius;
              return { char, angleWidth, width: metrics.width };
            });

            const totalAngle = charData.reduce((sum, item) => sum + item.angleWidth, 0);
            let currentAngle = (-Math.PI / 2 - totalAngle / 2) + (rotation * Math.PI / 180);

            // Gradient for arc text
            const gradient = ctx.createLinearGradient(centerX - baseRadius, centerY - baseRadius, centerX + baseRadius, centerY + baseRadius);
            const startColor = gradientStart || "#7c3aed";
            const endColor = gradientEnd || "#ec4899";

            gradient.addColorStop(0, startColor);
            gradient.addColorStop(1, endColor);

            // Texture logic
            let fillStyle: string | CanvasGradient | CanvasPattern = gradient;
            if (textTexture !== "none") {
              const texCanvas = document.createElement("canvas");
              texCanvas.width = 40;
              texCanvas.height = 40;
              const texCtx = texCanvas.getContext("2d");
              if (texCtx) {
                if (textTexture === "metal") {
                  texCtx.fillStyle = "#888"; texCtx.fillRect(0, 0, 40, 40);
                  texCtx.strokeStyle = "#fff"; texCtx.lineWidth = 2;
                  texCtx.beginPath(); texCtx.moveTo(0, 0); texCtx.lineTo(40, 40); texCtx.stroke();
                } else if (textTexture === "stone") {
                  texCtx.fillStyle = "#555"; texCtx.fillRect(0, 0, 40, 40);
                  for (let i = 0; i < 100; i++) {
                    texCtx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
                    texCtx.fillRect(Math.random() * 40, Math.random() * 40, 2, 2);
                  }
                } else if (textTexture === "carbon") {
                  texCtx.fillStyle = "#111"; texCtx.fillRect(0, 0, 40, 40);
                  texCtx.strokeStyle = "#333"; texCtx.lineWidth = 1;
                  for (let i = 0; i < 40; i += 4) {
                    texCtx.beginPath(); texCtx.moveTo(i, 0); texCtx.lineTo(i, 40); texCtx.stroke();
                    texCtx.beginPath(); texCtx.moveTo(0, i); texCtx.lineTo(40, i); texCtx.stroke();
                  }
                } else if (textTexture === "gold") {
                  const g = texCtx.createLinearGradient(0, 0, 40, 40);
                  g.addColorStop(0, "#ffd700"); g.addColorStop(0.5, "#fff7cc"); g.addColorStop(1, "#b8860b");
                  texCtx.fillStyle = g; texCtx.fillRect(0, 0, 40, 40);
                } else if (textTexture === "ice") {
                  texCtx.fillStyle = "#e0f7fa"; texCtx.fillRect(0, 0, 40, 40);
                  texCtx.strokeStyle = "#80deea"; texCtx.lineWidth = 1;
                  for (let i = 0; i < 10; i++) {
                    texCtx.beginPath(); texCtx.moveTo(Math.random() * 40, 0); texCtx.lineTo(Math.random() * 40, 40); texCtx.stroke();
                  }
                } else if (textTexture === "lava") {
                  texCtx.fillStyle = "#3e0000"; texCtx.fillRect(0, 0, 40, 40);
                  for (let i = 0; i < 20; i++) {
                    texCtx.fillStyle = `rgba(255, ${Math.random() * 100}, 0, 0.6)`;
                    texCtx.beginPath(); texCtx.arc(Math.random() * 40, Math.random() * 40, Math.random() * 10, 0, Math.PI * 2); texCtx.fill();
                  }
                }
                const pattern = ctx.createPattern(texCanvas, "repeat");
                if (pattern) fillStyle = pattern;
              }
            }

            // Draw icon before text
            const iconSize = fontSize * 0.8;
            if (icon !== "none") {
              const iconAngle = currentAngle - 0.2;
              drawIcon(
                centerX + Math.cos(iconAngle + Math.PI / 2) * baseRadius,
                centerY + Math.sin(iconAngle + Math.PI / 2) * baseRadius,
                iconSize,
                startColor
              );
            }

            charData.forEach(({ char, angleWidth }) => {
              const halfAngle = angleWidth / 2;
              const angle = currentAngle + halfAngle;

              ctx.save();
              ctx.translate(centerX, centerY);
              ctx.rotate(angle);
              ctx.translate(baseRadius, 0);
              ctx.rotate(Math.PI / 2); // Make characters upright along the arc

              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

              // Outer glow
              ctx.shadowColor = "#d946ef";
              ctx.shadowBlur = 30 * glowIntensity;
              ctx.lineWidth = 18 * outlineThickness;
              ctx.strokeStyle = "#d946ef";
              ctx.strokeText(char, 0, 0);

              // White outline (or custom color)
              if (showOutline) {
                ctx.save();
                ctx.shadowBlur = 0;
                ctx.lineWidth = 12 * outlineThickness;
                ctx.strokeStyle = outlineColor;
                ctx.strokeText(char, 0, 0);
                ctx.restore();
              }

              // Fill with gradient or texture
              ctx.fillStyle = fillStyle;
              ctx.fillText(char, 0, 0);

              ctx.restore();
              currentAngle += angleWidth;
            });
          } else {
            // Regular text rendering (bottom or Style 1/2)
            let textBottomY = size * 0.85; // Default bottom position

            if (isStyle3 && textPosition === "bottom") {
              textBottomY = size * 0.82; // Moved higher for Style 3 bottom position
            }

            const centerX = size / 2 + offsetX;
            const centerY = textBottomY + offsetY;

            // 1. Calculate Font Sizes and Total Width
            const chars = nickname.toUpperCase().split("");
            const midIndex = (chars.length - 1) / 2;
            const maxDist = midIndex || 1;

            const maxFontSize = 180;
            const minFontSize = 100;

            const fontWeight = isBold ? "900" : "700";
            const fontStyle = isItalic ? "italic" : "normal";

            const charData = chars.map((char, i) => {
              let fontSize;

              if (isStyle2 || isStyle3) {
                // Style 2 & 3: All letters same size
                fontSize = maxFontSize * fontSizeScale;
              } else {
                // Style 1: V-shape logic
                const dist = Math.abs(i - midIndex);
                const normalizedDist = dist / maxDist;
                fontSize = (minFontSize + (maxFontSize - minFontSize) * normalizedDist) * fontSizeScale;
              }

              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;
              const metrics = ctx.measureText(char);
              return {
                char,
                fontSize,
                width: metrics.width,
              };
            });

            const totalWidth = charData.reduce((sum, item) => sum + item.width, 0) + (chars.length - 1) * letterSpacing;
            let currentX = centerX - totalWidth / 2;

            // 2. Define Gradient
            const gradient = ctx.createLinearGradient(0, centerY - maxFontSize * 0.4, 0, centerY + maxFontSize * 0.4);

            const start = gradientStart || (isStyle2 ? "#3b82f6" : isStyle3 ? "#7c3aed" : "#0f0f0f");
            const end = gradientEnd || (isStyle2 ? "#0ea5e9" : isStyle3 ? "#ec4899" : "#d946ef");
            gradient.addColorStop(0, start);
            gradient.addColorStop(1, end);

            // Texture logic for regular text
            let fillStyle: string | CanvasGradient | CanvasPattern = gradient;
            if (textTexture !== "none") {
              const texCanvas = document.createElement("canvas");
              texCanvas.width = 40;
              texCanvas.height = 40;
              const texCtx = texCanvas.getContext("2d");
              if (texCtx) {
                if (textTexture === "metal") {
                  texCtx.fillStyle = "#888"; texCtx.fillRect(0, 0, 40, 40);
                  texCtx.strokeStyle = "#fff"; texCtx.lineWidth = 2;
                  texCtx.beginPath(); texCtx.moveTo(0, 0); texCtx.lineTo(40, 40); texCtx.stroke();
                } else if (textTexture === "stone") {
                  texCtx.fillStyle = "#555"; texCtx.fillRect(0, 0, 40, 40);
                  for (let i = 0; i < 100; i++) {
                    texCtx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
                    texCtx.fillRect(Math.random() * 40, Math.random() * 40, 2, 2);
                  }
                } else if (textTexture === "carbon") {
                  texCtx.fillStyle = "#111"; texCtx.fillRect(0, 0, 40, 40);
                  texCtx.strokeStyle = "#333"; texCtx.lineWidth = 1;
                  for (let i = 0; i < 40; i += 4) {
                    texCtx.beginPath(); texCtx.moveTo(i, 0); texCtx.lineTo(i, 40); texCtx.stroke();
                    texCtx.beginPath(); texCtx.moveTo(0, i); texCtx.lineTo(40, i); texCtx.stroke();
                  }
                } else if (textTexture === "gold") {
                  const g = texCtx.createLinearGradient(0, 0, 40, 40);
                  g.addColorStop(0, "#ffd700"); g.addColorStop(0.5, "#fff7cc"); g.addColorStop(1, "#b8860b");
                  texCtx.fillStyle = g; texCtx.fillRect(0, 0, 40, 40);
                } else if (textTexture === "ice") {
                  texCtx.fillStyle = "#e0f7fa"; texCtx.fillRect(0, 0, 40, 40);
                  texCtx.strokeStyle = "#80deea"; texCtx.lineWidth = 1;
                  for (let i = 0; i < 10; i++) {
                    texCtx.beginPath(); texCtx.moveTo(Math.random() * 40, 0); texCtx.lineTo(Math.random() * 40, 40); texCtx.stroke();
                  }
                } else if (textTexture === "lava") {
                  texCtx.fillStyle = "#3e0000"; texCtx.fillRect(0, 0, 40, 40);
                  for (let i = 0; i < 20; i++) {
                    texCtx.fillStyle = `rgba(255, ${Math.random() * 100}, 0, 0.6)`;
                    texCtx.beginPath(); texCtx.arc(Math.random() * 40, Math.random() * 40, Math.random() * 10, 0, Math.PI * 2); texCtx.fill();
                  }
                }
                const pattern = ctx.createPattern(texCanvas, "repeat");
                if (pattern) fillStyle = pattern;
              }
            }

            // 3. Render Loop
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation * Math.PI / 180);

            // Apply Advanced Transform: Skew, Stretch, Mirror
            const skewRad = (skewX * Math.PI) / 180;
            const finalStretchX = isMirrored ? -stretchX : stretchX;
            ctx.transform(finalStretchX, 0, Math.tan(skewRad), 1, 0, 0);

            // Independent Icon Drawing (Relative to text center)
            if (icon && icon !== "none") {
              const iconSize = 60 * iconScale;
              const spacing = 15;
              let ix = 0;
              let iy = -10 + iconOffsetY;

              if (iconPosition === "before") {
                ix = -totalWidth / 2 - spacing - iconSize / 2 + iconOffsetX;
              } else {
                ix = totalWidth / 2 + spacing + iconSize / 2 + iconOffsetX;
              }

              ctx.save();
              ctx.translate(ix, iy);
              drawIcon(0, 0, iconSize, start);
              ctx.restore();
            }

            ctx.translate(-centerX, -centerY);

            charData.forEach(({ char, fontSize, width }) => {
              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

              // A. Outer Glow
              ctx.save();
              ctx.shadowColor = "#d946ef";
              ctx.shadowBlur = 40 * glowIntensity;
              ctx.lineWidth = 30 * outlineThickness;
              ctx.strokeStyle = "#d946ef";
              ctx.strokeText(char, currentX, centerY);
              ctx.restore();

              // B. Thick White Outline (or custom color)
              if (showOutline) {
                ctx.save();
                ctx.lineWidth = 20 * outlineThickness;
                ctx.strokeStyle = outlineColor;
                ctx.lineJoin = "round";
                ctx.strokeText(char, currentX, centerY);
                ctx.restore();
              }

              // C. Filled Text
              ctx.fillStyle = fillStyle;
              ctx.fillText(char, currentX, centerY);

              currentX += width + letterSpacing;
            });
            ctx.restore();
          }
        }

        // 6. Draw Post-Processing Effects
        if (activeEffect !== "none") {
          ctx.save();
          if (activeEffect === "scanlines") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            for (let i = 0; i < size; i += 4) {
              ctx.fillRect(0, i, size, 1);
            }
          } else if (activeEffect === "vignette") {
            const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.4, size / 2, size / 2, size * 0.7);
            vignette.addColorStop(0, "rgba(0,0,0,0)");
            vignette.addColorStop(1, "rgba(0,0,0,0.7)");
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, size, size);
          } else if (activeEffect === "particles") {
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            for (let i = 0; i < 50; i++) {
              const px = Math.random() * size;
              const py = Math.random() * size;
              const pSize = Math.random() * 3 + 1;
              ctx.beginPath();
              ctx.arc(px, py, pSize, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (activeEffect === "glitch") {
            ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
            ctx.fillRect(Math.random() * size, 0, Math.random() * 100, size);
            ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
            ctx.fillRect(0, Math.random() * size, size, Math.random() * 20);
          } else if (activeEffect === "sniper") {
            const cx = size / 2; const cy = size / 2;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx - size * 0.45, cy); ctx.lineTo(cx - size * 0.05, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + size * 0.05, cy); ctx.lineTo(cx + size * 0.45, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy - size * 0.45); ctx.lineTo(cx, cy - size * 0.05); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy + size * 0.05); ctx.lineTo(cx, cy + size * 0.45); ctx.stroke();
            ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, size, size * 0.15); ctx.fillRect(0, size * 0.85, size, size * 0.15);
          } else if (activeEffect === "rain") {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 1;
            for (let i = 0; i < 100; i++) {
              const rx = Math.random() * size; const ry = Math.random() * size;
              ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 10, ry + 30); ctx.stroke();
            }
          } else if (activeEffect === "vhs") {
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            for (let i = 0; i < 200; i++) {
              ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
            }
            ctx.fillStyle = "rgba(255, 0, 0, 0.05)"; ctx.fillRect(2, 0, size, size);
            ctx.fillStyle = "rgba(0, 0, 255, 0.05)"; ctx.fillRect(-2, 0, size, size);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; ctx.lineWidth = 10;
            ctx.strokeRect(0, Math.random() * size, size, 2);
          }
          ctx.restore();
        }

        // 5. Draw Watermark for Styles 1, 2, 3
        if (styleUrl.includes("1style.png") || styleUrl.includes("2style.png") || styleUrl.includes("3style.png")) {
          ctx.save();
          ctx.font = `700 25px "Russo One", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          if (styleUrl.includes("3style.png")) {
            ctx.globalAlpha = 0.25; // 35% as requested
            ctx.fillStyle = "#ffffff";
          } else if (styleUrl.includes("2style.png")) {
            ctx.globalAlpha = 0.25; // 35% as requested
            ctx.fillStyle = "#000000";
          } else {
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "#ffffff";
          }

          ctx.fillText("t.me/crmp_rage", size / 2, size - 20);

          ctx.globalAlpha = 1.0;
          ctx.restore();
        }

        // Draw Final Overlay Effect
        drawOverlay(ctx, size, overlay, overlaySeed);

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

  }, [styleUrl, nickname, textPosition, fontFamily, gradientStart, gradientEnd, fontSizeScale, glowIntensity, outlineThickness, letterSpacing, offsetX, offsetY, rotation, icon, isBold, isItalic, isGrayscale, showOutline, outlineColor, textTexture, activeEffect, skewX, stretchX, isMirrored, iconPosition, iconOffsetX, iconOffsetY, iconScale, shape, overlay, overlaySeed, onCanvasReady]);

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
