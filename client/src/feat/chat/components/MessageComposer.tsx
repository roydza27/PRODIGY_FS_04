import { useEffect, useRef, useState } from "react";
import {
  IconBold,
  IconCode,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconMoodSmile,
  IconPlus,
  IconSend,
  IconStrikethrough,
  IconPaperclip,
  IconMicrophone,
  IconPhoto
} from "@tabler/icons-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useSendMessage } from "../hooks/useSendMessage";

import { cn } from "@/lib/utils";

interface MessageComposerProps {
  roomId?: string;
  conversationId?: string;
}

const TOOLBAR_ITEMS = [
  { icon: IconBold, label: "Bold" },
  { icon: IconItalic, label: "Italic" },
  { icon: IconStrikethrough, label: "Strikethrough" },
  { type: "divider" as const },
  { icon: IconLink, label: "Add Link" },
  { icon: IconList, label: "Bullet List" },
  { icon: IconListNumbers, label: "Numbered List" },
  { type: "divider" as const },
  { icon: IconCode, label: "Code" },
];

export default function MessageComposer({
  roomId,
  conversationId,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const { activeWorkspace } =
    useActiveWorkspace();

  const { sendMessage } = useSendMessage(
    activeWorkspace?._id,
    roomId,
    conversationId
  );

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height =
      "auto";

    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    sendMessage(trimmed);

    setText("");
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="px-4 pb-6 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className={cn(
          "relative flex flex-col overflow-hidden rounded-[24px] border border-border/50 bg-card/40 shadow-xl backdrop-blur-xl transition-all duration-300",
          isFocused ? "border-primary/40 ring-4 ring-primary/5 shadow-primary/5 bg-card/60" : "hover:border-border hover:bg-card/50"
        )}>
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 border-b border-border/30 bg-muted/20 px-3 py-2">
            {TOOLBAR_ITEMS.map((item, index) =>
              item.type === "divider" ? (
                <div
                  key={index}
                  className="mx-1.5 h-4 w-[1.5px] bg-border/40"
                />
              ) : (
                <ToolbarButton
                  key={index}
                  icon={
                    <item.icon size={17} stroke={2} />
                  }
                  label={item.label}
                />
              )
            )}
            
            <div className="ml-auto flex items-center gap-1">
              <ToolbarButton icon={<IconPhoto size={18} stroke={2} />} label="Images" />
              <ToolbarButton icon={<IconPaperclip size={18} stroke={2} />} label="Files" />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-3 p-4">
            <div className="flex items-center gap-1.5 pb-0.5">
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary active:scale-90"
              >
                <IconPlus size={24} stroke={2} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={roomId ? "Message channel..." : "Send a message..."}
              className="max-h-[400px] min-h-[48px] flex-1 resize-none bg-transparent py-3 text-[15px] font-medium leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none"
            />

            <div className="flex items-center gap-2 pb-0.5">
              <ToolbarButton
                icon={
                  <IconMoodSmile size={24} stroke={2} />
                }
                label="Emoji"
              />
              
              {!text.trim() && (
                <ToolbarButton
                  icon={
                    <IconMicrophone size={24} stroke={2} />
                  }
                  label="Voice Message"
                />
              )}

              <button
                type="button"
                onClick={handleSend}
                disabled={!text.trim()}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-500",
                  text.trim()
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-100 opacity-100 hover:bg-primary/90 hover:scale-105 active:scale-95"
                    : "bg-muted/50 text-muted-foreground/30 scale-95 opacity-50 cursor-not-allowed"
                )}
              >
                <IconSend 
                  size={22} 
                  stroke={2.5} 
                  className={cn(
                    "transition-all duration-500",
                    text.trim() ? "translate-x-0.5 -translate-y-0.5 rotate-12" : ""
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between px-4">
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground/30">
              <span className="h-1 w-1 rounded-full bg-emerald-500/40" />
              Markdown supported
            </p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
            <span className="text-muted-foreground/50">Return</span> to send • <span className="text-muted-foreground/50">Shift + Return</span> for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground active:scale-90"
    >
      {icon}
    </button>
  );
}