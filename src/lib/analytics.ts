// Google Analytics 4 Configuration

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Replace with your GA4 Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
    });
  }
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track events
interface EventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export const event = ({ action, category, label, value, ...params }: EventParams) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }
};

// Predefined event trackers for common actions
export const trackAddToCart = (productId: string, productName: string, quantity: number, price: number) => {
  event({
    action: "add_to_cart",
    category: "ecommerce",
    label: productName,
    value: price * quantity,
    items: [
      {
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price,
      },
    ],
  });
};

export const trackViewProduct = (productId: string, productName: string, category: string, price: number) => {
  event({
    action: "view_item",
    category: "ecommerce",
    label: productName,
    value: price,
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category,
        price: price,
      },
    ],
  });
};

export const trackBeginCheckout = (items: any[], totalValue: number) => {
  event({
    action: "begin_checkout",
    category: "ecommerce",
    value: totalValue,
    items: items,
  });
};

export const trackPurchase = (transactionId: string, totalValue: number, items: any[]) => {
  event({
    action: "purchase",
    category: "ecommerce",
    value: totalValue,
    transaction_id: transactionId,
    items: items,
  });
};

export const trackSearch = (searchTerm: string) => {
  event({
    action: "search",
    category: "engagement",
    label: searchTerm,
    search_term: searchTerm,
  });
};

export const trackWhatsAppClick = (productName?: string) => {
  event({
    action: "whatsapp_click",
    category: "engagement",
    label: productName || "general",
  });
};
