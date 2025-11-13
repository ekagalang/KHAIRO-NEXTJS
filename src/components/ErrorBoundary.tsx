"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);

    // Log to external service (e.g., Sentry)
    if (typeof window !== "undefined") {
      // You can add external logging service here
      console.log("Error details:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Oops! Terjadi Kesalahan
                </h2>
                <p className="text-gray-600">
                  Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah
                  diberitahu dan sedang memperbaikinya.
                </p>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="w-full text-left">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                      Detail Error (Development Only)
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                      {this.state.error.message}
                      {"\n\n"}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => window.location.reload()}
                    className="flex-1"
                    variant="outline"
                  >
                    Muat Ulang
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="flex-1"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
