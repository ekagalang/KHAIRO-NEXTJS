import { Navbar } from "@/components/layout/Navbar";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function Loading() {
  return (
    <>
      <Navbar />

      {/* Back Button */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
        </div>
      </div>

      <ProductDetailSkeleton />
    </>
  );
}
