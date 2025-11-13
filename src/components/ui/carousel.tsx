"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface CarouselProps {
  children: React.ReactNode[];
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  itemsPerSlide?: number; // Number of items to show at once
}

export function Carousel({
  children,
  autoplay = true,
  interval = 5000,
  showDots = true,
  itemsPerSlide = 1,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate total slides based on items per slide
  const totalSlides = Math.ceil(children.length / itemsPerSlide);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? totalSlides - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === totalSlides - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, totalSlides, goToSlide]);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, goToNext]);

  if (!children || children.length === 0) return null;

  // Group children into slides
  const slides = [];
  for (let i = 0; i < children.length; i += itemsPerSlide) {
    slides.push(children.slice(i, i + itemsPerSlide));
  }

  return (
    <div className="relative w-full">
      {/* Slides */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slideItems, slideIndex) => (
            <div key={slideIndex} className="min-w-full">
              <div className={`grid gap-4 ${itemsPerSlide === 3 ? "grid-cols-1 md:grid-cols-3" : itemsPerSlide === 2 ? "grid-cols-1 md:grid-cols-2" : ""}`}>
                {slideItems.map((child, itemIndex) => (
                  <div key={itemIndex}>
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {children.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Dots */}
      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
