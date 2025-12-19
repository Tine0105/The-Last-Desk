// Helper mapping from card name -> asset image path
import EchoBlade from "../assets/Echo Blade.png";
import MemoryShard from "../assets/Memory Shard.png";
import NeonCutter from "../assets/Neon Cutter.png";
import PhantomStrike from "../assets/Phantom Strike.png";
// Asset file is named "Crystal Resonance 2.png" in src/assets
import CrystalResonance from "../assets/Crystal Resonance 2.png";

const images: Record<string, string> = {
  "Echo Blade": EchoBlade,
  "Memory Shard": MemoryShard,
  "Neon Cutter": NeonCutter,
  "Phantom Strike": PhantomStrike,
  "Crystal Resonance": CrystalResonance,
};

export function getCardImage(name: string): string | null {
  return images[name] ?? null;
}
