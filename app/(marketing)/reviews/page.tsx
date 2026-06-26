import Link from "next/link";
import { ReviewsSection } from "@/components/marketing/reviews-section";

export const metadata = {
  title: "Reviews — Benjamin Rose Housing",
  description:
    "See what Ohio families say about Benjamin Rose homebuyer education, counseling, and down-payment assistance — and share your own experience.",
};

export default function ReviewsPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-brand-plum via-brand-plum to-brand-rose text-white">
        <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Trusted by Ohio families
          </h1>
          <p className="mt-4 text-lg text-white/90">
            For more than a century, Benjamin Rose has helped neighbors buy, keep, and afford their
            homes. Read their stories — and if we&apos;ve helped you, tell others.
          </p>
        </div>
      </section>

      <ReviewsSection variant="full" />

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-plum">
            Ready to start your own story?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Take the free classes and find out what assistance you may qualify for.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/learn"
              className="rounded-md bg-brand-rose px-6 py-3 text-sm font-semibold text-white hover:bg-brand-plum"
            >
              Start the free classes →
            </Link>
            <Link
              href="/assistance"
              className="rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-brand-rose hover:text-brand-rose"
            >
              See assistance programs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
