type ModeToggleProps = {
    mode: "notes" | "focus";
    onChange: (mode: "notes" | "focus") => void;
  };
  
  export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
    return (
      <div className="flex rounded-full border border-zinc-700 bg-zinc-900 p-1">
        <button
          type="button"
          onClick={() => onChange("notes")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mode === "notes"
              ? "bg-zinc-100 text-zinc-950"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          Notes mode
        </button>
  
        <button
          type="button"
          onClick={() => onChange("focus")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mode === "focus"
              ? "bg-zinc-100 text-zinc-950"
              : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          Focus mode
        </button>
      </div>
    );
  }