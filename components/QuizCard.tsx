"use client";

import { useState } from "react";
import type { MainQuizCard } from "@/types/studydeck";

type QuizCardProps = {
  card: MainQuizCard;
};

export default function QuizCard({ card }: QuizCardProps) {
  const [selectedChoices, setSelectedChoices] = useState<
    Record<number, number>
  >({});

  return (
    <div className="space-y-5">
      {card.questions.map((question, questionIndex) => {
        const selectedChoice = selectedChoices[questionIndex];

        return (
          <section
            key={question.question}
            className="rounded-2xl border border-zinc-700 bg-zinc-950/60 p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                {question.difficulty}
              </span>
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                {question.testedConcept}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-zinc-50">
              {questionIndex + 1}. {question.question}
            </h3>

            <div className="mt-4 space-y-3">
              {question.choices.map((choice, choiceIndex) => {
                const hasAnswered = selectedChoice !== undefined;
                const isSelected = selectedChoice === choiceIndex;
                const showCorrect = hasAnswered && choice.isCorrect;
                const showWrong = hasAnswered && isSelected && !choice.isCorrect;

                return (
                  <button
                    key={choice.text}
                    type="button"
                    onClick={() =>
                      setSelectedChoices((current) => ({
                        ...current,
                        [questionIndex]: choiceIndex,
                      }))
                    }
                    className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                      showCorrect
                        ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-50"
                        : showWrong
                          ? "border-rose-400/50 bg-rose-400/10 text-rose-50"
                          : isSelected
                            ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-50"
                            : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-500"
                    }`}
                  >
                    <span className="font-semibold">
                      {String.fromCharCode(65 + choiceIndex)}.
                    </span>{" "}
                    {choice.text}
                  </button>
                );
              })}
            </div>

            {selectedChoice !== undefined && (
              <div className="mt-4 rounded-xl bg-zinc-900 p-4 text-sm leading-6 text-zinc-300">
                {
                  question.choices[selectedChoice].explanation
                }
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}