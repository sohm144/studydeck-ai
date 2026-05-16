import type { TutorNote } from "@/types/studydeck";

type TutorBubbleProps = {
  note?: TutorNote;
};

const roleLabels: Record<TutorNote["role"], string> = {
  explain: "Senior note",
  warning: "Watch out",
  memory_trick: "Memory trick",
  analogy: "Analogy",
  question: "Think check",
  common_mistake: "Common mistake",
};

export default function TutorBubble({ note }: TutorBubbleProps) {
  if (!note) {
    return null;
  }

  return (
    <aside className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300 text-sm font-bold text-zinc-950">
          TA
        </div>

        <div>
          <p className="text-sm font-semibold text-cyan-200">
            {roleLabels[note.role]}
          </p>
          <p className="text-xs text-cyan-100/70">calm senior student mode</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-cyan-50">{note.message}</p>

      {note.analogyQuality?.isAnalogy && (
        <div className="mt-3 rounded-xl bg-zinc-950/40 p-3 text-xs text-cyan-100/80">
          <p>
            Mapping strength:{" "}
            <span className="font-semibold">
              {note.analogyQuality.mappingStrength ?? "not specified"}
            </span>
          </p>

          {note.analogyQuality.limitation && (
            <p className="mt-1">
              Limitation: {note.analogyQuality.limitation}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}