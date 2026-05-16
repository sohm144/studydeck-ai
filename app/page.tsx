import DeckViewer from "@/components/DeckViewer";
import { sampleModule } from "@/lib/sampleModule";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-8 text-zinc-100 md:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
            StudyDeck AI
          </p>

          <div className="mt-4 grid gap-6 md:grid-cols-[1.4fr_0.8fr] md:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
                Turn dense CS notes into study cards.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                V1 renders a structured browser-based learning module with
                notes mode, focus mode, tutor explanations, retrieval checks,
                comparison tables, skim sections, quizzes, and glossary support.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                Current prototype
              </p>

              <div className="mt-4 space-y-3 text-sm text-zinc-300">
                <p>Input: hardcoded garbage collection module</p>
                <p>Output: interactive StudyDeck cards</p>
                <p>Status: static V1 renderer</p>
              </div>
            </div>
          </div>
        </header>

        <DeckViewer module={sampleModule} />
      </section>
    </main>
  );
}