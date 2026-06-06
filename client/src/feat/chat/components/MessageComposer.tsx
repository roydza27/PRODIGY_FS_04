import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  IconPlus,
  IconMoodSmile,
  IconSend,
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconCode,
  IconLink,
  IconList,
  IconListNumbers,
} from "@tabler/icons-react";

import { useActiveWorkspace } from "@/feat/workspaces/hooks/useActiveWorkspace";
import { useSendMessage } from "../hooks/useSendMessage";
import { cn } from "@/lib/utils";

// Define toolbar items outside the component for cleaner code
const TOOLBAR_ITEMS = [
  { icon: IconBold, label: "Bold" },
  { icon: IconItalic, label: "Italic" },
  { icon: IconStrikethrough, label: "Strikethrough" },
  { type: "divider" },
  { icon: IconLink, label: "Add Link" },
  { icon: IconList, label: "Bullet List" },
  { icon: IconListNumbers, label: "Numbered List" },
  { type: "divider" },
  { icon: IconCode, label: "Code" },
];

export default function MessageComposer() {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { roomId, conversationId } = useParams();
  const { activeWorkspace } = useActiveWorkspace();

  const { sendMessage } = useSendMessage(activeWorkspace?._id, roomId, conversationId);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText("");
  };

  return (
    <div className="p-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-5xl">
        <div className="relative flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
          
          {/* Toolbar */}
          <div className="flex items-center gap-1 border-b border-border/50 bg-muted/20 px-2 py-1.5">
            {TOOLBAR_ITEMS.map((item, idx) => 
              'type' in item ? (
                <div key={idx} className="mx-1 h-4 w-px bg-border" />
              ) : (
                <ToolbarButton key={idx} icon={<item.icon size={16} />} label={item.label} />
              )
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-end gap-2 p-3">
            <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              <IconPlus size={20} />
            </button>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 max-h-[400px] min-h-[44px] py-2.5 resize-none bg-transparent text-[15px] focus:outline-none"
            />

            <div className="flex items-center gap-1 pb-1">
              <ToolbarButton icon={<IconMoodSmile size={20} />} label="Emoji" />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                  text.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground opacity-50"
                )}
              >
                <IconSend size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Hint Text */}
        <div className="mt-2 flex justify-end px-1">
          <p className="text-[11px] font-medium text-muted-foreground/70">
            <kbd className="bg-muted px-1 rounded">Enter</kbd> to send • <kbd className="bg-muted px-1 rounded">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}
    </button>
  );
}