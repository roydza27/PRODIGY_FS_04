import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "😮", "😢", "🙏"];

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 5 }}
      className="absolute right-0 top-full z-40 mt-1 flex gap-1 rounded-xl border border-border/50 bg-card/95 p-1 shadow-2xl backdrop-blur-xl"
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all hover:bg-muted hover:scale-110 active:scale-95"
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
}
