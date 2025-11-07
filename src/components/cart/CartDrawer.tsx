"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [whatsappNumber, setWhatsappNumber] = useState("6281234567890");
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch WhatsApp number from settings
    fetch("/api/settings?key=whatsapp_number")
      .then((res) => res.json())
      .then((data) => {
        if (data.value) {
          setWhatsappNumber(data.value);
        }
      })
      .catch((err) => console.error("Error fetching WhatsApp number:", err));
  }, []);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setIsVisible(false);
      const to = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(to);
    }
  }, [open]);

  if (!isMounted) return null;

  const generateWhatsAppMessage = () => {
    let message = "🕌 *PEMESANAN TOUR HAJI & UMROH*\n";
    message += "━━━━━━━━━━━━━━━━━━━━\n\n";
    message += "📋 *Detail Pesanan:*\n\n";

    items.forEach((item, index) => {
      const price = item.product.discountPrice || item.product.price;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   📅 ${item.product.duration}\n`;
      message += `   🛫 Keberangkatan: ${new Date(
        item.product.departure
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}\n`;
      message += `   👥 Jumlah Jamaah: ${item.quantity} orang\n`;
      message += `   💰 Harga: ${formatCurrency(Number(price))}/orang\n`;
      message += `   💵 Subtotal: ${formatCurrency(
        Number(price) * item.quantity
      )}\n\n`;
    });

    message += "━━━━━━━━━━━━━━━━━━━━\n";
    message += `💰 *TOTAL PEMBAYARAN: ${formatCurrency(totalPrice)}*\n`;
    message += "━━━━━━━━━━━━━━━━━━━━\n\n";
    message += "📞 Mohon informasi lebih lanjut mengenai:\n";
    message += "• Ketersediaan paket\n";
    message += "• Cara pembayaran\n";
    message += "• Syarat dan ketentuan\n\n";
    message += "Terima kasih! 🙏";

    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Optional: Clear cart after checkout
    // clearCart()
    // onClose()
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100 bg-black/50" : "opacity-0 bg-black/50 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col transform transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-gray-900">Keranjang Belanja</h2>
            {items.length > 0 && (
              <Badge className="bg-primary text-gray-800">{items.length}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-2 font-semibold">
                Keranjang masih kosong
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Yuk, mulai pilih paket umroh atau haji!
              </p>
              <Button
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-gray-800"
              >
                Lihat Paket Tour
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                if (!item?.product) return null;
                const images = item.product?.images?.split(",") ?? [];
                const mainImage = images[0] || "/placeholder-tour.jpg";
                const price = item.product.discountPrice || item.product.price;
                const numericPrice = Number(price);
                const lineTotal = (Number.isFinite(numericPrice) ? numericPrice : 0) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 border rounded-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={mainImage}
                        alt={item.product?.name || "Gambar produk"}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-1 left-1 text-xs px-1 py-0 h-5 bg-secondary text-white">
                        {item.product.type}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {formatCurrency(Number.isFinite(numericPrice) ? numericPrice : 0)}/orang
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-primary/20 hover:text-primary"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-sm font-bold text-gray-900 mt-2">
                        {formatCurrency(lineTotal)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Clear Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={clearCart}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Kosongkan Keranjang
              </Button>
            </div>
          )}
        </div>

        {/* Footer - Checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3 bg-gray-50">
            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Jamaah:</span>
                <span className="font-semibold">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} orang
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Total Pembayaran:</span>
                <span className="text-gray-900">
                  {formatCurrency(Number.isFinite(totalPrice) ? totalPrice : 0)}
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
              size="lg"
              onClick={handleCheckout}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Pesan via WhatsApp
            </Button>
            <p className="text-xs text-center text-gray-500">
              Anda akan diarahkan ke WhatsApp untuk konfirmasi pemesanan
            </p>
          </div>
        )}
      </div>
    </>
  );
}
