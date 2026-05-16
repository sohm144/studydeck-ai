"use client";

import { useState } from "react";
import type { CollapsibleBlock as CollapsibleBlockType } from "@/types/studydeck";

type CollapsibleBlockProps = {
  block: CollapsibleBlockType;
};

const styleMap: Record<
  CollapsibleBlockType["visualStyle"],
  {
    wrapper: string;
    button: string;
    body: string;
  }
> = {
  skim: {
    wrapper: "border-amber-300/20 bg-amber-300/10",
    button: "text-amber-100",
    body: "text-amber-50/85",
  },
  glossary: {
    wrapper: "border-violet-300/20 bg-violet-300/10",
    button: "text-violet-100",
    body: "text-violet-50/85",
  },
  extra_context: {
    wrapper: "border-zinc-600/40 bg-zinc-800/60",
    button: "text-zinc-100",
    body: "text-zinc-300",
  },
};

export default function CollapsibleBlock({ block }: CollapsibleBlockProps) {
  const [isOpen, setIsOpen] = useState(!block.defaultCollapsed);
  const styles = styleMap[block.visualStyle];

  return (
    <section className={`mt-5 rounded-2xl border p-4 ${styles.wrapper}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between text-left text-sm font-semibold ${styles.button}`}
      >
        <span>{block.title}</span>
        <span className="text-xs">{isOpen ? "Hide" : "Show"}</span>
      </button>

      {isOpen && (
        <ul className={`mt-3 space-y-2 text-sm leading-6 ${styles.body}`}>
          {block.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}