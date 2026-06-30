import { LangProvider } from "@/components/i18n/lang-provider";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/marketing-chrome";
import { SkipLink } from "@/components/ui/skip-link";

/** Public marketing shell — no auth, no dashboard nav. Trilingual (EN/ES/AR). */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-screen bg-brand-cream">
        <SkipLink />
        <MarketingHeader />
        <div id="main-content">{children}</div>
        <MarketingFooter />
      </div>
    </LangProvider>
  );
}
