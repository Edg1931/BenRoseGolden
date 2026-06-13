import { redirect } from "next/navigation";

// The bare site root shows the public landing page (welcome → classes).
// Staff reach the internal CRM via the "Staff sign in" link in the header.
export default function Home() {
  redirect("/welcome");
}
