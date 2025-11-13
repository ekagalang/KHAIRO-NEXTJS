import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Skeleton */}
            <Card className="overflow-hidden">
              <Skeleton className="w-full h-64 sm:h-96 rounded-none" />
              <div className="p-4 flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-20 h-20 flex-shrink-0" />
                ))}
              </div>
            </Card>

            {/* Product Info Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            {/* Features Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card Skeleton */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-10 w-48 mb-6" />

                <div className="mb-6">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                  <Skeleton className="h-3 w-32 mt-2" />
                </div>

                <div className="border-t pt-4 mb-6">
                  <Skeleton className="h-8 w-full" />
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>

                <Skeleton className="h-16 w-full mt-6 rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
