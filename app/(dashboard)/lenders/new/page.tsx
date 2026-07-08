import Link from "next/link";
import { LenderForm } from "@/components/lenders/lender-form";

export default function NewLenderPage() {
  return (
    <div className="space-y-4">
      <div>
        <Link href="/lenders" className="text-sm text-muted-foreground hover:underline">← Back to lenders</Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Add a preferred lender</h1>
      </div>
      <LenderForm />
    </div>
  );
}
