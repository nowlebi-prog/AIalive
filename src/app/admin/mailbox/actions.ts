"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { MailboxStatus } from "@/types/database";

export async function updateMailboxEntry(
  id: string,
  data: { status: MailboxStatus; admin_note: string }
) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("clover_mailbox")
    .update({
      status: data.status,
      admin_note: data.admin_note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/mailbox");
  revalidatePath(`/admin/mailbox/${id}`);
}

export async function convertToPublicResult(mailboxId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("clover_mailbox")
    .select("*")
    .eq("id", mailboxId)
    .single();

  if (!entry) throw new Error("우체통 항목을 찾을 수 없어요.");

  const { data: result, error } = await supabase
    .from("public_results")
    .insert({
      title: entry.pain_title ?? "새로운 클로버 이야기",
      summary: entry.desired_outcome ?? "",
      source_mailbox_id: entry.id,
      is_public: false,
    })
    .select()
    .single();

  if (error || !result) throw new Error(error?.message ?? "공개 결과 생성에 실패했어요.");

  await supabase
    .from("clover_mailbox")
    .update({ status: "completed" })
    .eq("id", mailboxId);

  revalidatePath("/admin/mailbox");
  redirect(`/admin/public-results/${result.id}/edit`);
}
