"use client";

import { useState } from "react";
import type { LearningModule } from "@/types/studydeck";
import CardRenderer from "@/components/CardRenderer";
import ModeToggle from "@/components/ModeToggle";

type DeckViewerProps = {
  module: LearningModule;
};

export default function DeckViewer({ module }: DeckViewerProps) {
  const [mode, setMode] = useState<"notes" | "focus">("notes");
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = module.cards[currentIndex];
  const progressPercentage =
    module.cards.length > 0
      ? Math.round(((currentIndex + 1) / module.cards.length) * 100)
      : 0;

  return (
    <section className="mt-8">
      <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-50">{module.title}</h2>
          <p className="mt-1 text-sm text-zinc-400">{module.courseContext}</p>
        </div>

        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      <section className="mb-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
          Central mental model
        </p>
        <p className="mt-2 text-sm leading-6 text-cyan-50">
          {module.centralMentalModel}
        </p>
      </section>

      {mode === "notes" ? (
        <div className="space-y-6">
          {module.cards.map((card) => (
            <CardRenderer key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>
                Card {currentIndex + 1} of {module.cards.length}
              </span>
              <span>{progressPercentage}% complete</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <CardRenderer card={currentCard} />

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentIndex((index) =>
                  Math.min(module.cards.length - 1, index + 1),
                )
              }
              disabled={currentIndex === module.cards.length - 1}
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}