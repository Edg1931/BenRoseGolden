import Link from "next/link";
import { Composer } from "@/components/content/composer";

export default function ComposePage() {
  return (
    <div className="space-y-4">
      <div>
        <Link href="/content" className="text-sm text-muted-foreground hover:underline">
          ← Back to content
        </Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Compose with AI</h1>
        <p className="text-sm text-muted-foreground">
          Describe what you want; Claude drafts an on-brand newsletter or flyer you can edit and save.
        </p>
      </div>
      <Composer />
    </div>
  );
}
