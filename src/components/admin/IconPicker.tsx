"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { ChevronDown } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

// Daftar icon populer untuk travel/tour agency
const POPULAR_ICONS = [
  "CheckCircle",
  "Shield",
  "Award",
  "Star",
  "Users",
  "Plane",
  "MapPin",
  "Calendar",
  "Clock",
  "Heart",
  "ThumbsUp",
  "TrendingUp",
  "Globe",
  "Map",
  "Navigation",
  "Compass",
  "Camera",
  "Image",
  "Phone",
  "Mail",
  "MessageCircle",
  "Send",
  "Briefcase",
  "Building",
  "Home",
  "Hotel",
  "Utensils",
  "Coffee",
  "ShoppingBag",
  "CreditCard",
  "DollarSign",
  "Tag",
  "Gift",
  "Package",
  "Truck",
  "Car",
  "Bus",
  "Train",
  "Ship",
  "Anchor",
  "Umbrella",
  "Sun",
  "Moon",
  "Cloud",
  "Zap",
  "Wifi",
  "Settings",
  "Lock",
];

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected icon component
  const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <SelectedIcon className="w-4 h-4" />
          <span>{value}</span>
        </div>
        <ChevronDown className="w-4 h-4 opacity-50" />
      </Button>

      {isOpen && (
        <Card className="absolute z-50 mt-2 w-full max-h-96 overflow-y-auto p-4 shadow-lg">
          <div className="grid grid-cols-5 gap-2">
            {POPULAR_ICONS.map((iconName) => {
              const IconComponent = (Icons as any)[iconName];
              if (!IconComponent) return null;

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleIconSelect(iconName)}
                  className={`
                    p-3 rounded-lg border-2 transition-all hover:bg-gray-100
                    flex flex-col items-center justify-center gap-1
                    ${value === iconName ? "border-primary bg-primary/10" : "border-gray-200"}
                  `}
                  title={iconName}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-[9px] text-gray-600 text-center leading-tight">
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
