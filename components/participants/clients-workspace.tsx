"use client";

import { useState } from "react";
import { CrmTable } from "./crm-table";
import { ParticipantBoard } from "./participant-board";
import type { Participant } from "@/lib/participants/schema";

export function ClientsWorkspace({ participants }: { participants: Participant[] }) {
  const [view, setView] = useState<"board" | "table">("board");
  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-md border border-border p-0.5 text-sm">
        <button
          onClick={() => setView("board")}
          className={`rounded px-3 py-1.5 ${view === "board" ? "bg-foreground text-white" : "text-muted-foreground hover:bg-muted"}`}
        >
          Board
        </button>
        <button
          onClick={() => setView("table")}
          className={`rounded px-3 py-1.5 ${view === "table" ? "bg-foreground text-white" : "text-muted-foreground hover:bg-muted"}`}
        >
          Table
        </button>
      </div>

      {view === "board" ? (
        <ParticipantBoard participants={participants} />
      ) : (
        <CrmTable participants={participants} />
      )}
    </div>
  );
}
