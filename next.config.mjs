/**
 * Security headers.
 *
 * This app holds financial details for families in vulnerable housing
 * situations, so the defaults are not good enough:
 *
 * - Referrer-Policy is the one that matters most here. A counselor viewing
 *   /contacts/<client-id> who clicks through to a program's website would
 *   otherwise hand that third party the full URL of a client record. Sending
 *   only the origin stops client identifiers leaking off-site.
 * - frame-ancestors / X-Frame-Options stop the CRM being framed and clickjacked
 *   into actions a signed-in staff member didn't intend.
 * - nosniff stops uploaded or generated content being reinterpreted as script.
 * - HSTS keeps sessions off plaintext HTTP once a browser has seen the site.
 *
 * A full script-src CSP is deliberately not set here: Next's inline bootstrap
 * needs nonce plumbing through middleware, and shipping a broken CSP right
 * before a demo is worse than shipping none. frame-ancestors is safe standalone.
 */
const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
