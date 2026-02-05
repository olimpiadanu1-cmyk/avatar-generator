import { useState } from "react";
import { useStyles, useCreateAvatar } from "@/hooks/use-avatars";
import { AvatarCanvas } from "@/components/AvatarCanvas";
import { StyleSelector } from "@/components/StyleSelector";
import { GamingInput } from "@/components/GamingInput";
import { Button } from "@/components/ui/button";
import { Download, Share2, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { data: styles = [], isLoading: stylesLoading } = useStyles();
  const { mutate: logCreation } = useCreateAvatar();
  const { toast } = useToast();

  const [nickname, setNickname] = useState("");
  // Default to first style if available, or a fallback
  const [selectedStyle, setSelectedStyle] = useState<string>("/images/styles/style_red.png");
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  // Update selected style when data loads
  if (styles.length > 0 && selectedStyle === "/images/styles/style_red.png" && !styles.find(s => s.url === selectedStyle)) {
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
        title: "Avatar Downloaded!",
        description: "Your gaming avatar is ready for battle.",
        className: "border-primary text-foreground bg-background",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Download Failed",
        description: "Something went wrong generating the image.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
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
              Official Avatar Generator • Join the Elite
            </p>
          </motion.div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-10"
          >
            {/* 1. Input Section */}
            <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Wand2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-display uppercase">Identity</h2>
              </div>
              
              <GamingInput 
                label="Enter Nickname"
                placeholder="Ex: DEMON_SLAYER"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                * Leave empty for logo-only version
              </p>
            </div>

            {/* 2. Style Section */}
            <div className="bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
               <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-xl font-display uppercase">Select Style</h2>
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
            </div>

            {/* Mobile-only Download Button (visible only on small screens) */}
            <div className="lg:hidden">
              <Button 
                onClick={handleDownload}
                className="w-full h-16 text-lg font-display uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] clip-gaming transition-all hover:translate-y-[-2px]"
              >
                <Download className="mr-3 w-6 h-6" /> Download Avatar
              </Button>
            </div>
          </motion.div>

          {/* RIGHT: Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-7 sticky top-8"
          >
            <div className="relative group">
              {/* Glow Effect behind canvas */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition duration-1000 animate-pulse" />
              
              {/* Canvas Component */}
              <AvatarCanvas 
                styleUrl={selectedStyle}
                nickname={nickname}
                onCanvasReady={setCanvasRef}
              />

              {/* Desktop Download Action */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 translate-y-1/2 hidden lg:flex gap-4">
                <Button 
                  onClick={handleDownload}
                  size="lg"
                  className="h-16 px-10 text-xl font-display uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] clip-gaming transition-transform hover:scale-105 active:scale-95 border-2 border-white/10"
                >
                  <Download className="mr-3 w-6 h-6" /> Download
                </Button>
                
                <Button
                  size="icon"
                  variant="outline"
                  className="h-16 w-16 bg-background border-white/10 hover:bg-white/5 hover:border-white/20"
                  onClick={() => {
                     toast({ description: "Link copied to clipboard!" });
                     navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-white/30 text-sm font-mono uppercase tracking-widest">
                Preview renders in real-time
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
