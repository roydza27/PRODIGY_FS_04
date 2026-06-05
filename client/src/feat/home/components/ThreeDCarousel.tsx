// components/ThreeDCarousel.tsx
"use client";

import React, { useRef, useEffect, useState, TouchEvent } from "react";
import { ArrowRight, Loader2, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export interface ThreeDCarouselItem {
  id: string;
  title: string;
  brand?: string;
  description?: string;
  price: string;
  oldPrice?: string;
  imageUrl: string;
  link: string;
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  isLoading?: boolean;
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
}

const ThreeDCarousel = ({
  items = [],
  isLoading = false,
  autoRotate = true,
  rotateInterval = 4500,
  cardHeight = 460,
}: ThreeDCarouselProps) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering && items.length > 1) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const currentRef = carouselRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd || items.length === 0) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  if (isLoading) {
    return (
      <div 
        className="w-full flex items-center justify-center rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-md"
        style={{ height: cardHeight }}
      >
        <div className="flex flex-col items-center gap-3 text-sm text-zinc-400">
          <Loader2 className="h-6 w-6 animate-spin text-[#DB4444]" />
          <span className="tracking-wide">Loading premium arrivals...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div 
        className="w-full flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-black/20 px-6 text-center"
        style={{ height: cardHeight }}
      >
        <p className="text-sm text-zinc-400">No active featured items found</p>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className="relative w-full overflow-visible select-none flex items-center justify-center"
      style={{ 
        height: cardHeight,
        perspective: "1200px", 
        transformStyle: "preserve-3d"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-visible" style={{ transformStyle: "preserve-3d" }}>
        {items.map((item, index) => {
          let offset = index - active;
          
          if (offset < -1 && active === items.length - 1) offset = 1;
          if (offset > 1 && active === 0) offset = -1;
          
          const isCurrentActive = index === active;
          const isVisible = Math.abs(offset) <= 1 || (active === 0 && index === items.length - 1) || (active === items.length - 1 && index === 0);

          if (!isVisible) return null;

          const xTranslation = offset === 0 ? "0%" : offset > 0 ? "38%" : "-38%";
          const zTranslation = offset === 0 ? 40 : -140; 
          const rotateYAngle = offset === 0 ? 0 : offset > 0 ? -38 : 38; 
          const opacityLayer = offset === 0 ? 1 : 0.28;
          const scaleLayer = offset === 0 ? 1.02 : 0.82;

          return (
            <motion.div
              key={item.id}
              style={{ 
                transformStyle: "preserve-3d",
                zIndex: isCurrentActive ? 30 : 10 
              }}
              animate={{
                x: xTranslation,
                z: zTranslation,
                scale: scaleLayer,
                opacity: opacityLayer,
                rotateY: rotateYAngle,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
              }}
              // FIXED WIDTH CONSTRAINTS TO FIT THE ENTIRE PANELS CORRECTLY
              className="absolute w-full max-w-[360px] sm:max-w-md h-[94%]"
            >
              {/* Premium Glow Accent Outer Ring */}
              <div className={`w-full h-full rounded-[24px] p-[1px] transition-all duration-500 ${
                isCurrentActive 
                  ? "bg-gradient-to-b from-white/15 via-[#DB4444]/20 to-white/5 shadow-2xl shadow-black/80" 
                  : "bg-white/5 shadow-md shadow-black/40"
              }`}>
                
                {/* Main Card Body Surface */}
                <div className="w-full h-full overflow-hidden rounded-[23px] bg-[#141416]/95 p-4 flex flex-col justify-between text-left backdrop-blur-xl">
                  
                  {/* Image Frame Container */}
                  <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-black/40 border border-white/5 shadow-inner group">
                    {item.imageUrl ? (
                      <motion.img
                        src={item.imageUrl}
                        alt={item.title}
                        animate={{ scale: isCurrentActive && isHovering ? 1.08 : 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full w-full object-cover filter brightness-[0.92] contrast-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600 text-xs">
                        No Product Image
                      </div>
                    )}
                    
                    {/* Modern Dynamic Badge Placement */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-200">
                      <Star className="h-2.5 w-2.5 text-[#DB4444] fill-[#DB4444]" />
                      <span>Trending</span>
                    </div>

                    {isCurrentActive && (
                      <div className="absolute top-2.5 right-2.5 z-10 rounded-full bg-[#DB4444]/90 p-1 border border-white/10 shadow-lg shadow-[#DB4444]/20">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Descriptions Content Matrix */}
                  <div className="mt-4 flex-grow flex flex-col justify-between">
                    <div>
                      {item.brand && (
                        <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[#DB4444]/80 mb-0.5">
                          {item.brand}
                        </p>
                      )}
                      <h3 className="text-base font-medium text-white tracking-tight line-clamp-1 group-hover:text-[#DB4444] transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-light">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Integrated Platform Pricing Row */}
                    <div className="mt-4 flex items-center justify-between gap-2 pt-2.5 border-t border-white/5">
                      <div className="space-y-0.5">
                        {item.oldPrice && (
                          <p className="text-[11px] text-zinc-500 line-through leading-none">
                            {item.oldPrice}
                          </p>
                        )}
                        <p className="text-xl font-semibold text-white tracking-tight leading-none">
                          {item.price}
                        </p>
                      </div>

                      <Link 
                        to={isCurrentActive ? item.link : "#"} 
                        onClick={(e) => !isCurrentActive && e.preventDefault()}
                      >
                        <button
                          disabled={!isCurrentActive}
                          className="inline-flex h-8 items-center justify-center gap-1 rounded-xl bg-white/10 px-3.5 text-xs font-medium text-white transition-all duration-200 hover:bg-[#DB4444] hover:text-white active:scale-95 disabled:opacity-0 disabled:pointer-events-none shadow-md"
                        >
                          <span>Explore</span>
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Discrete Premium Linear Track Indicators */}
      <div className="absolute -bottom-1 left-0 right-0 flex justify-center items-center space-x-2 z-40">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              active === idx 
                ? "bg-[#DB4444] w-5 shadow-sm shadow-[#DB4444]/50" 
                : "bg-white/10 hover:bg-white/20 w-1.5"
            }`}
            onClick={() => setActive(idx)}
            aria-label={`Go to deck frame ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreeDCarousel;