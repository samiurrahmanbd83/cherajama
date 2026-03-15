import helmet from "helmet";

// Harden common HTTP headers
export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "same-site" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginEmbedderPolicy: false
});
