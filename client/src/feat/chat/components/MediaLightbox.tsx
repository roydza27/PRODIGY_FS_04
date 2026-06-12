import { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { IAttachment } from "../types/message.types";

interface MediaLightboxProps {
  images: IAttachment[];
  initialIndex: number;
  onClose: () => void;
}

const ZOOM_LEVELS = [1, 1.5, 2, 3];

export default function MediaLightbox({
  images,
  initialIndex,
  onClose,
}: MediaLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(0); // index into ZOOM_LEVELS
  const [direction, setDirection] = useState<1 | -1>(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  const image = images[current];
  const scale = ZOOM_LEVELS[zoomLevel];
  const canPrev = current > 0;
  const canNext = current < images.length - 1;

  // Reset zoom on image change
  const navigate = useCallback(
    (delta: 1 | -1) => {
      const next = current + delta;
      if (next < 0 || next >= images.length) return;
      setDirection(delta);
      setZoomLevel(0);
      setImgLoaded(false);
      setCurrent(next);
    },
    [current, images.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const cycleZoom = () => {
    setZoomLevel((z) => (z + 1) % ZOOM_LEVELS.length);
  };

  const zoomOut = () => {
    setZoomLevel((z) => Math.max(0, z - 1));
  };

  const portal = (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.92)" }}
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-label="Close lightbox"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
          {/* Counter */}
          <span className="text-[12px] font-black uppercase tracking-widest text-white/60">
            {current + 1} / {images.length}
          </span>

          {/* Filename */}
          <span className="truncate max-w-[50%] text-[13px] font-bold text-white/80 text-center">
            {image?.filename}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Zoom out */}
            <button
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              disabled={zoomLevel === 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white disabled:opacity-30"
              title="Zoom out"
            >
              <IconZoomOut size={18} stroke={2} />
            </button>

            {/* Zoom in */}
            <button
              onClick={(e) => { e.stopPropagation(); cycleZoom(); }}
              disabled={zoomLevel === ZOOM_LEVELS.length - 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white disabled:opacity-30"
              title="Zoom in"
            >
              <IconZoomIn size={18} stroke={2} />
            </button>

            {/* Download */}
            <a
              href={image?.url}
              download={image?.filename}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
              title="Download"
            >
              <IconDownload size={18} stroke={2} />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white"
              title="Close (Esc)"
            >
              <IconX size={18} stroke={2.5} />
            </button>
          </div>
        </div>

        {/* Prev button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(-1); }}
          disabled={!canPrev}
          className={cn(
            "absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95",
            !canPrev && "opacity-0 pointer-events-none"
          )}
          title="Previous (←)"
        >
          <IconChevronLeft size={24} stroke={2.5} />
        </button>

        {/* Image */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-0 flex max-h-[85vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading skeleton */}
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
              </div>
            )}

            <img
              src={image?.url}
              alt={image?.filename}
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl transition-all duration-300",
                !imgLoaded && "opacity-0",
                imgLoaded && "opacity-100"
              )}
              style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate(1); }}
          disabled={!canNext}
          className={cn(
            "absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105 active:scale-95",
            !canNext && "opacity-0 pointer-events-none"
          )}
          title="Next (→)"
        >
          <IconChevronRight size={24} stroke={2.5} />
        </button>

        {/* Bottom thumbnail strip (when multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 pb-6 pt-4 bg-gradient-to-t from-black/60 to-transparent">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(idx > current ? 1 : -1);
                  setZoomLevel(0);
                  setImgLoaded(false);
                  setCurrent(idx);
                }}
                className={cn(
                  "h-10 w-10 overflow-hidden rounded-lg border-2 transition-all hover:scale-110",
                  idx === current
                    ? "border-white shadow-lg shadow-white/20"
                    : "border-white/20 opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={img.url}
                  alt={img.filename}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(portal, document.body);
}
