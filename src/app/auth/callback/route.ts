import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // profiles row is created automatically by the handle_new_user() DB trigger.
      // First-time users (no diagnosis yet) go to the finder; returning users go to their card.
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const { data: diagnoses } = await supabase
        .from("clover_diagnoses")
        .select("id")
        .eq("user_id", data.user.id)
        .limit(1);

      const destination = diagnoses && diagnoses.length > 0 ? "/my-clover-card" : "/clover-finder";
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
