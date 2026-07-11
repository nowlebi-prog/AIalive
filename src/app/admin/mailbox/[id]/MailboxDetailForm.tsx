"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { updateMailboxEntry, convertToPublicResult } from "../actions";
import { MAILBOX_STATUS_LABELS } from "@/lib/mailbox-data";
import type { CloverMailbox, MailboxStatus } from "@/types/database";
import { Sparkles } from "lucide-react";

export function MailboxDetailForm({ entry }: { entry: CloverMailbox }) {
  const [status, setStatus] = useState<MailboxStatus>(entry.status);
  const [note, setNote] = useState(entry.admin_note ?? "");
  const [pending, startTransition] = useTransition();
  const [convertPending, startConvertTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await updateMailboxEntry(entry.id, { status, admin_note: note });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function handleConvert() {
    if (!confirm("이 고민을 공개 결과 사례로 전환할까요? 비공개 초안이 생성돼요.")) return;
    startConvertTransition(() => {
      convertToPublicResult(entry.id);
    });
  }

  return (
    <Card className="p-6 flex flex-col gap-4">
      <h2 className="text-[14px] font-bold text-text-dark">운영자 처리</h2>

      <div>
        <p className="text-[12px] font-semibold text-text-gray mb-1.5">상태</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MAILBOX_STATUS_LABELS) as MailboxStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`text-[12.5px] px-3 py-1.5 rounded-full border transition-colors ${
                status === s
                  ? "bg-soft-green border-primary text-primary-deep"
                  : "bg-white border-border-soft text-text-gray hover:bg-pale-green"
              }`}
            >
              {MAILBOX_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[12px] font-semibold text-text-gray mb-1.5">내부 메모</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="이 고민을 처리하며 남길 내부 메모 (사용자에게 보이지 않아요)"
          className="w-full px-4 py-2.5 rounded-xl border border-border-soft text-[13.5px] outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleConvert}
          disabled={convertPending}
          icon={<Sparkles size={14} />}
        >
          {convertPending ? "전환 중..." : "공개 결과로 전환"}
        </Button>
        <div className="flex items-center gap-3">
          {saved && <span className="text-[12px] text-primary-deep">저장됐어요!</span>}
          <Button type="button" onClick={handleSave} disabled={pending}>
            {pending ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
