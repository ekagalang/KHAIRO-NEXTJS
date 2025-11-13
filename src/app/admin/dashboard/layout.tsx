"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NextImage from "next/image";
import {
  LayoutDashboard,
  Package,
  Image,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  FolderOpen,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logoAdmin, setLogoAdmin] = useState("");
  const [siteName, setSiteName] = useState("Khairo Tour");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.site_logo_admin) setLogoAdmin(data.site_logo_admin);
      if (data.site_name) setSiteName(data.site_name);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const menuItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/dashboard/homepage", icon: Home, label: "Homepage" },
    { href: "/admin/dashboard/hero-stats", icon: BarChart3, label: "Hero Stats" },
    { href: "/admin/dashboard/products", icon: Package, label: "Produk" },
    { href: "/admin/dashboard/gallery", icon: Image, label: "Galeri" },
    { href: "/admin/dashboard/blog", icon: FileText, label: "Blog" },
    { href: "/admin/dashboard/media", icon: FolderOpen, label: "File Manager" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Pengaturan" },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Mobile */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {logoAdmin ? (
              <div className="relative h-8 w-auto">
                <NextImage
                  src={logoAdmin}
                  alt={siteName}
                  width={120}
                  height={32}
                  className="object-contain h-8 w-auto"
                />
              </div>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-lg">🕌</span>
                </div>
                <span className="font-bold">Admin Panel</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r
            transition-transform duration-300 lg:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b hidden lg:block">
              {logoAdmin ? (
                <div className="relative h-12 w-auto">
                  <NextImage
                    src={logoAdmin}
                    alt={siteName}
                    width={150}
                    height={48}
                    className="object-contain h-12 w-auto"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🕌</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">{siteName}</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname?.startsWith(item.href));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                          ${
                            isActive
                              ? "bg-primary text-gray-800 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t">
              <div className="mb-3 px-2">
                <p className="text-sm font-semibold text-gray-800">
                  {session.user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">{session.user?.email}</p>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay - Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
