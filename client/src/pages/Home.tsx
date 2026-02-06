import { useState, useEffect } from "react";
import { useStyles, useCreateAvatar } from "@/hooks/use-avatars";
import { AvatarCanvas } from "@/components/AvatarCanvas";
import { StyleSelector } from "@/components/StyleSelector";
import { GamingInput } from "@/components/GamingInput";
import { Button } from "@/components/ui/button";
import { ChevronDown, Dices, Download, History, Layout, Layers, Palette, RefreshCcw, Share2, Sparkles, Wand2, Type, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const PRESETS_CONFIG = {
  HELLFIRE: {
    gradientStart: "#ff0000",
    gradientEnd: "#660000",
    textTexture: "lava" as const,
    icon: "fire",
    activeEffect: "particles" as const,
    overlay: "blood" as const,
    shape: "square" as const,
    glowIntensity: 2,
    outlineColor: "#ff4400"
  },
  CYBERSPACE: {
    gradientStart: "#00ffff",
    gradientEnd: "#ff00ff",
    textTexture: "carbon" as const,
    icon: "lightning",
    activeEffect: "glitch" as const,
    overlay: "none" as const,
    shape: "hexagon" as const,
    glowIntensity: 1.5,
    outlineColor: "#00ffff"
  },
  FROZEN: {
    gradientStart: "#ffffff",
    gradientEnd: "#0088ff",
    textTexture: "ice" as const,
    icon: "shield",
    activeEffect: "rain" as const,
    overlay: "lens_flare" as const,
    shape: "circle" as const,
    glowIntensity: 1.2,
    outlineColor: "#ffffff"
  },
  TOXIC: {
    gradientStart: "#aaff00",
    gradientEnd: "#004400",
    textTexture: "stone" as const,
    icon: "lightning",
    activeEffect: "vhs" as const,
    overlay: "smoke" as const,
    shape: "square" as const,
    glowIntensity: 1.8,
    outlineColor: "#44ff00"
  },
  GOLDEN: {
    gradientStart: "#ffee00",
    gradientEnd: "#aa8800",
    textTexture: "gold" as const,
    icon: "star",
    activeEffect: "particles" as const,
    overlay: "lens_flare" as const,
    shape: "shield" as const,
    glowIntensity: 2.2,
    outlineColor: "#ffffff"
  },
  NOIR: {
    gradientStart: "#aaaaaa",
    gradientEnd: "#222222",
    textTexture: "metal" as const,
    icon: "shield",
    activeEffect: "vignette" as const,
    overlay: "smoke" as const,
    shape: "square" as const,
    glowIntensity: 0.5,
    outlineColor: "#444444",
    isGrayscale: true
  }
};

export default function Home() {
  const { data: styles = [], isLoading: stylesLoading } = useStyles();
  const { mutate: logCreation } = useCreateAvatar();
  const { toast } = useToast();

  const [nickname, setNickname] = useState("");
  // Default to first style if available, or a fallback
  const [selectedStyle, setSelectedStyle] = useState<string>("/images/styles/1style.png");
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [textPosition, setTextPosition] = useState<"bottom" | "circle">("bottom"); // For style 3

  // Text Customization States
  const [fontFamily, setFontFamily] = useState("Russo One");
  const [gradientStart, setGradientStart] = useState("");
  const [gradientEnd, setGradientEnd] = useState("");
  const [fontSizeScale, setFontSizeScale] = useState(1);

  // Advanced States
  const [glowIntensity, setGlowIntensity] = useState(1);
  const [outlineThickness, setOutlineThickness] = useState(1);
  const [letterSpacing, setLetterSpacing] = useState(5);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState("none");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textTexture, setTextTexture] = useState<"none" | "metal" | "stone" | "carbon" | "gold" | "ice" | "lava">("none");
  const [activeEffect, setActiveEffect] = useState<"none" | "particles" | "scanlines" | "vignette" | "glitch" | "sniper" | "rain" | "vhs">("none");
  const [showOutline, setShowOutline] = useState(true);
  const [outlineColor, setOutlineColor] = useState("#ffffff");
  const [isGrayscale, setIsGrayscale] = useState(false);

  // Advanced Transformation
  const [skewX, setSkewX] = useState(0);
  const [stretchX, setStretchX] = useState(1);
  const [isMirrored, setIsMirrored] = useState(false);

  // Independent Icon Controls
  const [iconPosition, setIconPosition] = useState<"before" | "after">("before");
  const [iconOffsetX, setIconOffsetX] = useState(0);
  const [iconOffsetY, setIconOffsetY] = useState(0);
  const [iconScale, setIconScale] = useState(1);

  // New Features: Shapes & Overlays
  const [shape, setShape] = useState<"square" | "circle" | "hexagon" | "shield">("square");
  const [overlay, setOverlay] = useState<"none" | "glass" | "blood" | "smoke" | "lens_flare">("none");
  const [overlaySeed, setOverlaySeed] = useState(Math.random());

  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("avatar_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleRandomize = () => {
    const fonts = ["Russo One", "Orbitron", "Bebas Neue", "Montserrat", "Oswald", "Inter"];
    const icons = ["none", "lightning", "star", "shield", "fire"];
    const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    setFontFamily(fonts[Math.floor(Math.random() * fonts.length)]);
    setGradientStart(randomHex());
    setGradientEnd(randomHex());
    setFontSizeScale(0.8 + Math.random() * 0.5); // 0.8 to 1.3

    setGlowIntensity(0.5 + Math.random() * 1.5); // 0.5 to 2.0
    setOutlineThickness(0.5 + Math.random() * 1.5); // 0.5 to 2.0
    setLetterSpacing(Math.floor(Math.random() * 20));

    setRotation(Math.floor(Math.random() * 40) - 20); // -20 to 20
    setSelectedIcon(icons[Math.floor(Math.random() * icons.length)]);

    setIsBold(Math.random() > 0.5);
    setIsItalic(Math.random() > 0.5);

    const textures = ["none", "metal", "stone", "carbon", "gold", "ice", "lava"];
    setTextTexture(textures[Math.floor(Math.random() * textures.length)] as any);

    const effects = ["none", "particles", "scanlines", "vignette", "glitch", "sniper", "rain", "vhs"];
    setActiveEffect(effects[Math.floor(Math.random() * effects.length)] as any);

    setShowOutline(Math.random() > 0.2);
    setOutlineColor(randomHex());
    setIsGrayscale(Math.random() > 0.9); // Low chance for B&W in random

    // Reset advanced transformation and icon tweaks on randomize for a fresh look
    setSkewX(0);
    setStretchX(1);
    setIsMirrored(false);
    setIconScale(1);
    setIconOffsetX(0);
    setIconOffsetY(0);

    const shapes: ("square" | "circle" | "hexagon" | "shield")[] = ["square", "circle", "hexagon", "shield"];
    setShape(shapes[Math.floor(Math.random() * shapes.length)]);

    const overlays: ("none" | "glass" | "blood" | "smoke" | "lens_flare")[] = ["none", "glass", "blood", "smoke", "lens_flare"];
    setOverlay(overlays[Math.floor(Math.random() * overlays.length)]);
    setOverlaySeed(Math.random());

    toast({
      title: "Стиль рандомизирован!",
      description: "Мы подобрали для вас уникальное сочетание параметров.",
    });
  };

  const handleApplyPreset = (name: keyof typeof PRESETS_CONFIG) => {
    const config = PRESETS_CONFIG[name];
    setGradientStart(config.gradientStart);
    setGradientEnd(config.gradientEnd);
    setTextTexture(config.textTexture);
    setSelectedIcon(config.icon);
    setActiveEffect(config.activeEffect);
    setOverlay(config.overlay);
    setShape(config.shape);
    setOverlaySeed(Math.random());
    setGlowIntensity(config.glowIntensity);
    setOutlineColor(config.outlineColor);

    if ("isGrayscale" in config) {
      setIsGrayscale(config.isGrayscale as boolean);
    } else {
      setIsGrayscale(false);
    }

    toast({
      title: `Стиль ${name} применен!`,
      description: "Все настройки были оптимизированы под этот шаблон.",
      className: "border-primary text-foreground bg-background",
    });
  };

  const handleResetAdvanced = () => {
    setGlowIntensity(1);
    setOutlineThickness(1);
    setLetterSpacing(5);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setSelectedIcon("none");
    setIsBold(false);
    setIsItalic(false);
    setTextTexture("none");
    setActiveEffect("none");
    setShowOutline(true);
    setOutlineColor("#ffffff");
    setIsGrayscale(false);

    // Reset new properties
    setSkewX(0);
    setStretchX(1);
    setIsMirrored(false);
    setIconPosition("before");
    setIconOffsetX(0);
    setIconOffsetY(0);
    setIconScale(1);
    setShape("square");
    setOverlay("none");
    setOverlaySeed(Math.random());

    toast({
      title: "Настройки сброшены!",
      description: "Продвинутые параметры текста возвращены к стандарту.",
    });
  };

  // Update selected style when data loads
  if (styles.length > 0 && selectedStyle === "/images/styles/1style.png" && !styles.find(s => s.url === selectedStyle)) {
    setSelectedStyle(styles[0].url);
  }

  const handleDownload = () => {
    if (!canvasRef) return;

    try {
      // 1. Convert canvas to data URL
      const dataUrl = canvasRef.toDataURL("image/png");

      // 2. Create invisible link and trigger download
      const link = document.createElement("a");
      link.download = `rage-russia-${nickname || "avatar"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 3. Log the creation (fire & forget)
      logCreation({
        style: selectedStyle,
        nickname: nickname || "Anonymous",
      });

      toast({
        title: "Аватар скачан!",
        description: "Ваш игровой аватар готов к бою.",
        className: "border-primary text-foreground bg-background",
      });

      // 4. Update History
      const newHistory = [dataUrl, ...history.filter(h => h !== dataUrl)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("avatar_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error(e);
      toast({
        title: "Ошибка загрузки",
        description: "Что-то пошло не так при создании изображения.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header */}
        <header className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400">Rage</span>
              <span className="text-primary ml-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">Russia</span>
            </h1>
            <p className="text-muted-foreground font-gaming tracking-widest uppercase text-sm md:text-base max-w-2xl mx-auto border-y border-white/5 py-4">
              Официальный генератор аватаров
            </p>
          </motion.div>

          {/* Mobile Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="lg:hidden flex flex-col items-center gap-2 mt-8 text-primary/60"
          >
            <span className="text-[10px] font-gaming uppercase tracking-[0.2em]">Листайте вниз</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* LEFT: Controls */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-10"
            >
              {/* 1. Input Section */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Wand2 className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display uppercase">Текст</h2>
                </div>

                <GamingInput
                  label="Введите текст"
                  placeholder="Пример: FERNANDO"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={15}
                />
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  * Оставьте пустым для версии без текста
                </p>
              </div>

              {/* 2. Style Section */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-display uppercase">Выбор стиля</h2>
                </div>

                {stylesLoading ? (
                  <div className="grid grid-cols-4 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-square bg-white/5 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <StyleSelector
                    styles={styles}
                    selectedStyle={selectedStyle}
                    onSelect={setSelectedStyle}
                  />
                )}

                {/* Text Position Toggle - Selective for Style 3 */}
                {selectedStyle.includes("3style.png") && (
                  <div className="mt-8 p-6 bg-card/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Расположение текста:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setTextPosition("bottom")}
                        className={`px-4 py-3 rounded-xl font-gaming text-xs uppercase tracking-widest transition-all ${textPosition === "bottom"
                          ? "bg-primary text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] border-primary"
                          : "bg-background/40 text-muted-foreground border-white/5 hover:border-white/20"
                          } border`}
                      >
                        Внизу
                      </button>
                      <button
                        onClick={() => setTextPosition("circle")}
                        className={`px-4 py-3 rounded-xl font-gaming text-xs uppercase tracking-widest transition-all ${textPosition === "circle"
                          ? "bg-primary text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] border-primary"
                          : "bg-background/40 text-muted-foreground border-white/5 hover:border-white/20"
                          } border`}
                      >
                        В круге ⭕
                      </button>
                    </div>
                  </div>
                )}

                {/* Info about styles */}
                <p className="text-xs text-muted-foreground/60 mt-4 italic">
                  Стили периодически добавляются. Для некоторых стилей доступны дополнительные настройки.
                </p>
              </div>

              {/* 2.5 Presets Section */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Layout className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-display uppercase italic tracking-tighter">Шаблоны стилей</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "HELLFIRE", label: "HELLFIRE", color: "from-red-600 to-orange-600", emoji: "🔥" },
                    { id: "CYBERSPACE", label: "CYBER", color: "from-cyan-400 to-purple-600", emoji: "⚡" },
                    { id: "FROZEN", label: "FROZEN", color: "from-blue-100 to-blue-400", emoji: "❄️" },
                    { id: "TOXIC", label: "TOXIC", color: "from-green-400 to-lime-600", emoji: "🧪" },
                    { id: "GOLDEN", label: "GOLDEN", color: "from-yellow-400 to-yellow-700", emoji: "👑" },
                    { id: "NOIR", label: "NOIR", color: "from-gray-400 to-black", emoji: "🕵️" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleApplyPreset(p.id as any)}
                      className={`group relative overflow-hidden rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95 hover:border-white/30`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                      <div className="relative py-4 px-2 flex flex-col items-center gap-1">
                        <span className="text-lg">{p.emoji}</span>
                        <span className="text-[9px] font-gaming tracking-[0.2em] font-bold text-white/80 group-hover:text-white">{p.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Text Customization Section */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <Wand2 className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-display uppercase tracking-wider">Настройки текста</h3>
                  </div>
                  <button
                    onClick={handleRandomize}
                    title="Рандомизировать настройки"
                    className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors border border-primary/20 group"
                  >
                    <Dices className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>

                {/* Font Family */}
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground font-mono uppercase">Шрифт:</p>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-sm font-gaming uppercase outline-none focus:border-primary/50 transition-all cursor-pointer"
                  >
                    <option value="Russo One">Russo One (Default)</option>
                    <option value="Orbitron">Orbitron</option>
                    <option value="Bebas Neue">Bebas Neue</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Oswald">Oswald</option>
                    <option value="Inter">Inter</option>
                  </select>
                </div>

                {/* Gradient Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase">Цвет 1:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientStart || "#ffffff"}
                        onChange={(e) => setGradientStart(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                      />
                      <button
                        onClick={() => setGradientStart("")}
                        className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors"
                      >
                        Сброс
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase">Цвет 2:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={gradientEnd || "#000000"}
                        onChange={(e) => setGradientEnd(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
                      />
                      <button
                        onClick={() => setGradientEnd("")}
                        className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors"
                      >
                        Сброс
                      </button>
                    </div>
                  </div>
                </div>

                {/* Font Style & Texture */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase">Начертание:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsBold(!isBold)}
                        className={`w-10 h-10 rounded-lg border font-bold transition-all ${isBold ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"}`}
                      >
                        B
                      </button>
                      <button
                        onClick={() => setIsItalic(!isItalic)}
                        className={`w-10 h-10 rounded-lg border italic transition-all ${isItalic ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"}`}
                      >
                        I
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-mono uppercase">Текстура:</p>
                    <select
                      value={textTexture}
                      onChange={(e) => setTextTexture(e.target.value as any)}
                      className="w-full h-10 bg-background/50 border border-white/10 rounded-lg px-3 py-1 text-xs font-gaming uppercase outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                      <option value="none">Без текстуры</option>
                      <option value="metal">Металл</option>
                      <option value="stone">Камень</option>
                      <option value="carbon">Карбон</option>
                      <option value="gold">Золото</option>
                      <option value="ice">Лёд</option>
                      <option value="lava">Лава</option>
                    </select>
                  </div>
                </div>

                {/* Font Size Scale */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-muted-foreground font-mono uppercase">Размер текста:</p>
                    <input
                      type="number"
                      value={Math.round(fontSizeScale * 100)}
                      onChange={(e) => setFontSizeScale((parseInt(e.target.value) || 50) / 100)}
                      className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={fontSizeScale}
                    onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-white/10 h-1 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Advanced Customization Section */}
              <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-8">
                <div className="flex items-center justify-between gap-3 mb-2 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-display uppercase tracking-wider">Продвинутые настройки</h3>
                  </div>
                  <button
                    onClick={handleResetAdvanced}
                    title="Сбросить продвинутые настройки"
                    className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground transition-colors border border-white/5 group"
                  >
                    <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </div>

                {/* Global Effects Selection */}
                <div className="space-y-4">
                  <p className="text-[10px] font-gaming text-muted-foreground uppercase tracking-widest text-center">Визуальные эффекты</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "none", label: "Нет" },
                      { id: "particles", label: "Искры" },
                      { id: "scanlines", label: "ТВ-линии" },
                      { id: "vignette", label: "Виньетка" },
                      { id: "glitch", label: "Глитч" },
                      { id: "sniper", label: "Прицел" },
                      { id: "rain", label: "Дождь" },
                      { id: "vhs", label: "Ретро" },
                    ].map((fx) => (
                      <button
                        key={fx.id}
                        onClick={() => setActiveEffect(fx.id as any)}
                        className={`py-2 px-1 border rounded-lg transition-all text-[10px] font-gaming uppercase ${activeEffect === fx.id ? "border-primary bg-primary/20 text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"}`}
                      >
                        {fx.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Layout for FX and Position */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* FX Side */}
                  <div className="space-y-6">
                    {/* Grayscale Toggle */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-primary" />
                        <p className="text-xs text-muted-foreground font-mono uppercase">Черно-белое фото:</p>
                      </div>
                      <button
                        onClick={() => setIsGrayscale(!isGrayscale)}
                        className={`px-3 py-1 rounded text-[10px] font-gaming uppercase transition-all ${isGrayscale ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
                      >
                        {isGrayscale ? "Вкл" : "Выкл"}
                      </button>
                    </div>

                    <p className="text-[10px] font-gaming text-primary/60 uppercase tracking-widest pt-2">Настройки текста</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">Свечение:</p>
                        <input
                          type="number"
                          value={glowIntensity}
                          step="0.1"
                          onChange={(e) => setGlowIntensity(parseFloat(e.target.value) || 0)}
                          className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <input type="range" min="0" max="2" step="0.1" value={glowIntensity} onChange={(e) => setGlowIntensity(parseFloat(e.target.value))} className="w-full h-1 accent-primary" />
                    </div>

                    {/* Outline Control Section */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">Цвет обводки:</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={outlineColor}
                              onChange={(e) => setOutlineColor(e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                            />
                            <button
                              onClick={() => setOutlineColor("#ffffff")}
                              className="text-[9px] uppercase text-muted-foreground hover:text-primary transition-colors border border-white/10 px-2 py-1 rounded"
                            >
                              Сброс
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] text-muted-foreground font-mono uppercase">Толщина линии:</p>
                            <input
                              type="number"
                              value={outlineThickness}
                              step="0.1"
                              onChange={(e) => setOutlineThickness(parseFloat(e.target.value) || 0)}
                              className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                            />
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="2.5"
                            step="0.1"
                            value={outlineThickness}
                            onChange={(e) => setOutlineThickness(parseFloat(e.target.value))}
                            className="w-full h-1 accent-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground font-mono uppercase">Интервал:</p>
                        <input
                          type="number"
                          value={letterSpacing}
                          onChange={(e) => setLetterSpacing(parseInt(e.target.value) || 0)}
                          className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <input type="range" min="-10" max="40" step="1" value={letterSpacing} onChange={(e) => setLetterSpacing(parseInt(e.target.value))} className="w-full h-1 accent-primary" />
                    </div>
                  </div>

                  {/* Position Side */}
                  <div className="space-y-6">
                    <p className="text-[10px] font-gaming text-accent/60 uppercase tracking-widest mb-4">Трансформация</p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground font-mono uppercase">Смещение X:</p>
                        <input
                          type="number"
                          value={offsetX}
                          onChange={(e) => setOffsetX(parseInt(e.target.value) || 0)}
                          className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-accent text-center font-mono focus:outline-none focus:border-accent/50"
                        />
                      </div>
                      <input type="range" min="-200" max="200" step="1" value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))} className="w-full h-1 accent-accent" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground font-mono uppercase">Смещение Y:</p>
                        <input
                          type="number"
                          value={offsetY}
                          onChange={(e) => setOffsetY(parseInt(e.target.value) || 0)}
                          className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-accent text-center font-mono focus:outline-none focus:border-accent/50"
                        />
                      </div>
                      <input type="range" min="-200" max="200" step="1" value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} className="w-full h-1 accent-accent" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground font-mono uppercase">Наклон:</p>
                        <input
                          type="number"
                          value={rotation}
                          onChange={(e) => setRotation(parseInt(e.target.value) || 0)}
                          className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-accent text-center font-mono focus:outline-none focus:border-accent/50"
                        />
                      </div>
                      <input type="range" min="-45" max="45" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full h-1 accent-accent" />
                    </div>

                    {/* New Advanced Transformations */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-muted-foreground font-mono uppercase">Наклон текста (Skew):</p>
                          <input
                            type="number"
                            value={skewX}
                            onChange={(e) => setSkewX(parseInt(e.target.value) || 0)}
                            className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-accent text-center font-mono focus:outline-none focus:border-accent/50"
                          />
                        </div>
                        <input type="range" min="-45" max="45" step="1" value={skewX} onChange={(e) => setSkewX(parseInt(e.target.value))} className="w-full h-1 accent-accent" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-muted-foreground font-mono uppercase">Растяжение (Stretch):</p>
                          <input
                            type="number"
                            value={stretchX}
                            step="0.1"
                            onChange={(e) => setStretchX(parseFloat(e.target.value) || 0.1)}
                            className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-accent text-center font-mono focus:outline-none focus:border-accent/50"
                          />
                        </div>
                        <input type="range" min="0.1" max="3" step="0.1" value={stretchX} onChange={(e) => setStretchX(parseFloat(e.target.value))} className="w-full h-1 accent-accent" />
                      </div>

                      <button
                        onClick={() => setIsMirrored(!isMirrored)}
                        className={`w-full py-2 border rounded-xl font-gaming text-[10px] tracking-widest transition-all ${isMirrored ? "bg-accent/20 border-accent text-accent" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}
                      >
                        ЗЕРКАЛЬНО (MIRROR): {isMirrored ? "ВКЛ" : "ВЫКЛ"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Full-width Shape & Overlay Section */}
                <div className="space-y-8 pt-8 border-t border-white/5 bg-white/2 p-6 rounded-2xl">
                  <div className="space-y-4">
                    <p className="text-[10px] font-gaming text-accent uppercase tracking-[0.2em] text-center mb-6">Геометрия и Атмосфера</p>

                    <div className="space-y-4">
                      <p className="text-[10px] font-gaming text-muted-foreground uppercase tracking-widest text-center">Форма аватара</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { id: "square", label: "Квадрат" },
                          { id: "circle", label: "Круг" },
                          { id: "hexagon", label: "Гексагон" },
                          { id: "shield", label: "Щит" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setShape(s.id as any)}
                            className={`py-3 px-2 border rounded-xl transition-all text-[10px] font-gaming uppercase tracking-widest ${shape === s.id ? "border-accent bg-accent/20 text-white shadow-[0_0_15px_rgba(255,0,255,0.2)]" : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"}`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <p className="text-[10px] font-gaming text-muted-foreground uppercase tracking-widest text-center">Оверлеи (Спецэффекты)</p>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                          { id: "none", label: "Нет" },
                          { id: "glass", label: "Стекло" },
                          { id: "blood", label: "Кровь" },
                          { id: "smoke", label: "Дым" },
                          { id: "lens_flare", label: "Блик" },
                        ].map((o) => (
                          <button
                            key={o.id}
                            onClick={() => {
                              setOverlay(o.id as any);
                              setOverlaySeed(Math.random());
                            }}
                            className={`py-3 px-2 border rounded-xl transition-all text-[10px] font-gaming uppercase tracking-widest ${overlay === o.id ? "border-accent bg-accent/20 text-white shadow-[0_0_15px_rgba(255,0,255,0.2)]" : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"}`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Icons Section */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-gaming text-muted-foreground uppercase tracking-widest mb-4 text-center">Выберите иконку</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["none", "lightning", "star", "shield", "fire"].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`h-12 w-12 flex items-center justify-center border rounded-xl transition-all ${selectedIcon === icon ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(255,0,0,0.3)] scale-110" : "border-white/10 hover:border-white/20 bg-background/50"
                        }`}
                    >
                      {icon === "none" ? <span className="text-[8px] uppercase font-gaming opacity-50">No</span> :
                        icon === "lightning" ? <span className="text-xl">⚡</span> :
                          icon === "star" ? <span className="text-xl">⭐</span> :
                            icon === "shield" ? <span className="text-xl">🛡️</span> : <span className="text-xl">🔥</span>}
                    </button>
                  ))}
                </div>

                {/* Independent Icon Controls */}
                {selectedIcon !== "none" && (
                  <div className="mt-6 space-y-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-mono uppercase">Позиция иконки:</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setIconPosition("before")}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-gaming tracking-wider transition-all ${iconPosition === "before" ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                              } border`}
                          >
                            ДО ТЕКСТА
                          </button>
                          <button
                            onClick={() => setIconPosition("after")}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-gaming tracking-wider transition-all ${iconPosition === "after" ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                              } border`}
                          >
                            ПОСЛЕ ТЕКСТА
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] text-muted-foreground font-mono uppercase">Смещение X:</p>
                            <input
                              type="number"
                              value={iconOffsetX}
                              onChange={(e) => setIconOffsetX(parseInt(e.target.value) || 0)}
                              className="w-10 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                            />
                          </div>
                          <input type="range" min="-100" max="100" step="1" value={iconOffsetX} onChange={(e) => setIconOffsetX(parseInt(e.target.value))} className="w-full h-1 accent-primary" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] text-muted-foreground font-mono uppercase">Смещение Y:</p>
                            <input
                              type="number"
                              value={iconOffsetY}
                              onChange={(e) => setIconOffsetY(parseInt(e.target.value) || 0)}
                              className="w-10 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                            />
                          </div>
                          <input type="range" min="-100" max="100" step="1" value={iconOffsetY} onChange={(e) => setIconOffsetY(parseInt(e.target.value))} className="w-full h-1 accent-primary" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">Масштаб:</p>
                          <input
                            type="number"
                            value={iconScale}
                            step="0.1"
                            onChange={(e) => setIconScale(parseFloat(e.target.value) || 0.1)}
                            className="w-12 bg-white/5 border border-white/10 rounded px-1 py-0.5 text-[9px] text-primary text-center font-mono focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <input type="range" min="0.5" max="3" step="0.1" value={iconScale} onChange={(e) => setIconScale(parseFloat(e.target.value))} className="w-full h-1 accent-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Preview (Sticky on desktop) */}
          <div className="lg:col-span-12 xl:col-span-7 lg:sticky lg:top-8 self-start">
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full"
              >
                <div className="relative group">
                  {/* Glow Effect behind canvas */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition duration-1000 animate-pulse" />

                  {/* Canvas Component */}
                  <AvatarCanvas
                    styleUrl={selectedStyle}
                    nickname={nickname}
                    textPosition={textPosition}
                    fontFamily={fontFamily}
                    gradientStart={gradientStart}
                    gradientEnd={gradientEnd}
                    fontSizeScale={fontSizeScale}
                    glowIntensity={glowIntensity}
                    outlineThickness={outlineThickness}
                    letterSpacing={letterSpacing}
                    offsetX={offsetX}
                    offsetY={offsetY}
                    rotation={rotation}
                    icon={selectedIcon}
                    isBold={isBold}
                    isItalic={isItalic}
                    isGrayscale={isGrayscale}
                    showOutline={showOutline}
                    outlineColor={outlineColor}
                    textTexture={textTexture}
                    activeEffect={activeEffect}
                    skewX={skewX}
                    stretchX={stretchX}
                    isMirrored={isMirrored}
                    iconPosition={iconPosition}
                    iconOffsetX={iconOffsetX}
                    iconOffsetY={iconOffsetY}
                    iconScale={iconScale}
                    shape={shape}
                    overlay={overlay}
                    overlaySeed={overlaySeed}
                    onCanvasReady={setCanvasRef}
                  />

                  {/* Desktop Download Action */}
                  <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 hidden lg:flex gap-4">
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="h-16 px-10 text-xl font-display uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] clip-gaming transition-transform hover:scale-105 active:scale-95 border-2 border-white/10"
                    >
                      <Download className="mr-3 w-6 h-6" /> Скачать
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-16 w-16 bg-background border-white/10 hover:bg-white/5 hover:border-white/20"
                      onClick={() => {
                        toast({ description: "Ссылка скопирована в буфер обмена!" });
                        navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      <Share2 className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* 5. History Section */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-20 pt-12 border-t border-white/5"
            >
              <div className="flex items-center gap-3 mb-8 justify-center">
                <History className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display uppercase tracking-wider">История генераций</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {history.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.download = `rage-history-${i + 1}.png`;
                      link.href = img;
                      link.click();
                    }}
                  >
                    <img src={img} alt={`History ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-muted-foreground/40 text-[10px] font-mono mt-8 uppercase tracking-[0.3em]">
                История сохраняется только в вашем браузере
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div >
    </div >
  );
}
