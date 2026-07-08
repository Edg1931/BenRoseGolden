import Link from "next/link";
import { notFound } from "next/navigation";
import { LenderForm } from "@/components/lenders/lender-form";
import { getLender } from "@/lib/lenders/repository";

export const dynamic = "force-dynamic";

export default async function EditLenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lender = await getLender(id);
  if (!lender) notFound();

  return (
    <div className="space-y-4">
      <div>
        <Link href={`/lenders/${id}`} className="text-sm text-muted-foreground hover:underline">← Back to lender</Link>
        <h1 className="mt-1 text-xl font-semibold tracking-tight">Edit {lender.institutionName}</h1>
      </div>
      <LenderForm lender={lender} />
    </div>
  );
}
