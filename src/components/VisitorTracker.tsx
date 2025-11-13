"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface VisitorTrackerProps {
  pageType?: "page" | "product";
}

export function VisitorTracker({ pageType = "page" }: VisitorTrackerProps) {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Track only once per page load
    if (!hasTracked.current) {
      hasTracked.current = true;

      // Use requestIdleCallback for better performance
      // Falls back to setTimeout if not available
      const trackVisitor = () => {
        fetch("/api/visitor/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pageType }),
        }).catch((error) => {
          // Silently fail - don't block user experience
          console.debug("Visitor tracking failed:", error);
        });
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(trackVisitor);
      } else {
        setTimeout(trackVisitor, 0);
      }
    }

    // Reset tracking when pathname changes
    return () => {
      hasTracked.current = false;
    };
  }, [pathname, pageType]);

  // This component renders nothing
  return null;
}
