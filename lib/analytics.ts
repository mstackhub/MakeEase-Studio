declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean | undefined | null>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

export const trackProductView = (productId: string, productName: string) => {
  trackEvent("view_product", {
    product_id: productId,
    product_name: productName,
  });
};

export const trackDemoClick = (productId: string, productName: string, demoUrl?: string | null) => {
  trackEvent("click_demo", {
    product_id: productId,
    product_name: productName,
    demo_url: demoUrl || "",
  });
};

export const trackContactClick = (source: string, productId?: string, productName?: string) => {
  trackEvent("click_contact", {
    source,
    product_id: productId || "",
    product_name: productName || "",
  });
};

export const trackLeadSubmit = (productName?: string, budget?: string) => {
  trackEvent("submit_lead", {
    product_name: productName || "",
    budget: budget || "",
  });
};

export const trackFilter = (category: string, filterType?: string) => {
  trackEvent("filter_product", {
    category,
    filter_type: filterType,
  });
};

export const trackSearch = (query: string) => {
  trackEvent("search_product", {
    search_term: query,
  });
};
