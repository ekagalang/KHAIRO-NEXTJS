"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import Image from "next/image";

export function Navbar() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [siteLogo, setSiteLogo] = useState("");
  const [siteName, setSiteName] = useState("Khairo Tour");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.site_logo) setSiteLogo(data.site_logo);
      if (data.site_name) setSiteName(data.site_name);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/products?type=UMROH", label: "Umroh" },
    { href: "/products?type=HAJI", label: "Haji" },
    { href: "/gallery", label: "Galeri" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {siteLogo ? (
                <div className="relative h-12 w-auto">
                  <Image
                    src={siteLogo}
                    alt={siteName}
                    width={150}
                    height={48}
                    className="object-contain h-12 w-auto"
                    priority
                  />
                </div>
              ) : (
                <>
                  <div className="hidden sm:block">
                    <span className="font-bold text-xl text-gray-800">
                      {siteName}
                    </span>
                    <p className="text-xs text-gray-500">Haji & Umroh</p>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-primary"
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Cart Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-primary"
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
