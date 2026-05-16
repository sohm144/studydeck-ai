import type {
    LearningCard,
    TaxonomyNode,
    ComparisonTableCard,
    ConceptCard,
    IntroCard,
    RelationshipCard,
    ProcessVisualCard,
    ExampleCard,
    CommonConfusionCard,
    RetrievalCheckCard,
    SkimCard,
    RecapCard,
    GlossaryCard,
  } from "@/types/studydeck";
  import CollapsibleBlock from "@/components/CollapsibleBlock";
  import QuizCard from "@/components/QuizCard";
  import TutorBubble from "@/components/TutorBubble";
  
  type CardRendererProps = {
    card: LearningCard;
  };
  
  function CardShell({
    card,
    children,
  }: {
    card: LearningCard;
    children: React.ReactNode;
  }) {
    return (
      <article className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
              {card.type.replaceAll("_", " ")}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-50">
              {card.title}
            </h2>
          </div>
  
          <div className="flex gap-2">
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              {card.importance}
            </span>
  
            {card.estimatedMinutes && (
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                {card.estimatedMinutes} min
              </span>
            )}
          </div>
        </div>
  
        {children}
  
        {card.technicalTerms && card.technicalTerms.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {card.technicalTerms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300"
              >
                {term}
              </span>
            ))}
          </div>
        )}
  
        <TutorBubble note={card.tutorNote} />
      </article>
    );
  }
  
  function renderTaxonomyNodes(nodes: TaxonomyNode[], depth = 0) {
    return (
      <ul className={depth === 0 ? "space-y-3" : "mt-3 space-y-2 pl-5"}>
        {nodes.map((node) => (
          <li key={`${node.label}-${depth}`}>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  node.status === "current"
                    ? "bg-cyan-300"
                    : node.status === "covered"
                      ? "bg-emerald-300"
                      : node.status === "next"
                        ? "bg-amber-300"
                        : "bg-zinc-600"
                }`}
              />
              <span className="text-sm font-medium text-zinc-100">
                {node.label}
              </span>
              {node.status && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
                  {node.status}
                </span>
              )}
            </div>
  
            {node.children && renderTaxonomyNodes(node.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }
  
  function IntroView({ card }: { card: IntroCard }) {
    return (
      <CardShell card={card}>
        <p className="text-base leading-7 text-zinc-300">{card.overview}</p>
  
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl bg-zinc-950/70 p-4">
            <h3 className="font-semibold text-zinc-100">Learning goals</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {card.learningGoals.map((goal) => (
                <li key={goal}>• {goal}</li>
              ))}
            </ul>
          </section>
  
          <section className="rounded-2xl bg-zinc-950/70 p-4">
            <h3 className="font-semibold text-zinc-100">Pay attention to</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {card.whatToPayAttentionTo.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
        </div>
      </CardShell>
    );
  }
  
  function ConceptView({ card }: { card: ConceptCard }) {
    return (
      <CardShell card={card}>
        <p className="rounded-2xl bg-zinc-950/70 p-4 text-base leading-7 text-zinc-200">
          {card.coreIdea}
        </p>
  
        {card.miniExplanation && (
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            {card.miniExplanation}
          </p>
        )}
  
        <ul className="mt-5 space-y-3">
          {card.keyPoints.map((point) => (
            <li
              key={point.text}
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm leading-6 text-zinc-300"
            >
              <span className="mr-2 rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-cyan-200">
                {point.importance}
              </span>
              {point.text}
            </li>
          ))}
        </ul>
  
        {card.skimDetails && <CollapsibleBlock block={card.skimDetails} />}
      </CardShell>
    );
  }
  
  function RelationshipView({ card }: { card: RelationshipCard }) {
    return (
      <CardShell card={card}>
        <div className="space-y-3">
          {card.relationships.map((relationship) => (
            <div
              key={`${relationship.from}-${relationship.to}`}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-zinc-100">
                  {relationship.from}
                </span>
                <span className="text-cyan-300">→</span>
                <span className="font-semibold text-zinc-100">
                  {relationship.to}
                </span>
                <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-200">
                  {relationship.relationType}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {relationship.explanation}
              </p>
            </div>
          ))}
        </div>
  
        <p className="mt-5 rounded-2xl bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
          {card.takeaway}
        </p>
      </CardShell>
    );
  }
  
  function ProcessVisualView({ card }: { card: ProcessVisualCard }) {
    return (
      <CardShell card={card}>
        <p className="text-sm leading-6 text-zinc-400">{card.visualConcept}</p>
  
        {card.diagramIntent && (
          <section className="mt-4 rounded-2xl bg-zinc-950/60 p-4">
            <h3 className="font-semibold text-zinc-100">Diagram intent</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {card.diagramIntent.teaches}
            </p>
          </section>
        )}
  
        <ol className="mt-5 space-y-4">
          {card.steps.map((step, index) => (
            <li key={step.label} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-sm font-bold text-zinc-950">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-zinc-100">{step.label}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  {step.explanation}
                </p>
                {step.highlightTarget && (
                  <p className="mt-2 text-xs text-cyan-200">
                    Highlight: {step.highlightTarget}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
  
        <p className="mt-5 rounded-2xl bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-300">
          {card.takeaway}
        </p>
      </CardShell>
    );
  }
  
  function TaxonomyView({ card }: { card: LearningCard }) {
    if (card.type !== "taxonomy") {
      return null;
    }
  
    return (
      <CardShell card={card}>
        <p className="text-sm leading-6 text-zinc-400">{card.explanation}</p>
  
        <section className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-zinc-100">{card.root}</h3>
            {card.currentFocus && (
              <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                Focus: {card.currentFocus}
              </span>
            )}
          </div>
  
          {renderTaxonomyNodes(card.nodes)}
        </section>
      </CardShell>
    );
  }
  
  function ExampleView({ card }: { card: ExampleCard }) {
    return (
      <CardShell card={card}>
        <p className="rounded-2xl bg-zinc-950/70 p-4 text-sm leading-6 text-zinc-300">
          {card.scenario}
        </p>
  
        <ol className="mt-5 space-y-3">
          {card.walkthrough.map((step, index) => (
            <li key={step} className="text-sm leading-6 text-zinc-300">
              <span className="mr-2 font-semibold text-cyan-300">
                {index + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
  
        <p className="mt-5 rounded-2xl bg-cyan-400/10 p-4 text-sm text-cyan-50">
          {card.takeaway}
        </p>
      </CardShell>
    );
  }
  
  function CommonConfusionView({ card }: { card: CommonConfusionCard }) {
    return (
      <CardShell card={card}>
        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl bg-rose-400/10 p-4">
            <h3 className="font-semibold text-rose-100">Misconception</h3>
            <p className="mt-2 text-sm leading-6 text-rose-50/85">
              {card.misconception}
            </p>
          </section>
  
          <section className="rounded-2xl bg-emerald-400/10 p-4">
            <h3 className="font-semibold text-emerald-100">Correction</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-50/85">
              {card.correction}
            </p>
          </section>
  
          <section className="rounded-2xl bg-cyan-400/10 p-4">
            <h3 className="font-semibold text-cyan-100">Why it matters</h3>
            <p className="mt-2 text-sm leading-6 text-cyan-50/85">
              {card.whyItMatters}
            </p>
          </section>
        </div>
      </CardShell>
    );
  }
  
  function RetrievalCheckView({ card }: { card: RetrievalCheckCard }) {
    const block = {
      title: "Reveal expected answer",
      items: [
        card.expectedAnswer,
        card.hint ? `Hint: ${card.hint}` : "",
        `Explanation: ${card.explanation}`,
      ].filter(Boolean),
      defaultCollapsed: true,
      visualStyle: "extra_context" as const,
    };
  
    return (
      <CardShell card={card}>
        <p className="rounded-2xl bg-zinc-950/70 p-5 text-lg font-medium leading-8 text-zinc-100">
          {card.prompt}
        </p>
  
        <CollapsibleBlock block={block} />
      </CardShell>
    );
  }
  
  function ComparisonTableView({ card }: { card: ComparisonTableCard }) {
    return (
      <CardShell card={card}>
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800 text-sm">
            <thead className="bg-zinc-950">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                  Item
                </th>
                {card.columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left font-semibold text-zinc-200"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
  
            <tbody className="divide-y divide-zinc-800 bg-zinc-900">
              {card.rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-4 py-3 font-semibold text-cyan-200">
                    {row.label}
                  </td>
                  {row.values.map((value, index) => (
                    <td
                      key={`${row.label}-${index}`}
                      className="px-4 py-3 leading-6 text-zinc-300"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <p className="mt-5 rounded-2xl bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
          {card.takeaway}
        </p>
      </CardShell>
    );
  }
  
  function SkimView({ card }: { card: SkimCard }) {
    return (
      <CardShell card={card}>
        <CollapsibleBlock
          block={{
            title: "Open skim details",
            items: card.skimItems,
            defaultCollapsed: true,
            visualStyle: "skim",
          }}
        />
  
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          {card.reasonTheseAreSkimmable}
        </p>
      </CardShell>
    );
  }
  
  function RecapView({ card }: { card: RecapCard }) {
    return (
      <CardShell card={card}>
        <ul className="space-y-3">
          {card.mustRemember.map((item) => (
            <li
              key={item}
              className="rounded-xl bg-zinc-950/60 p-4 text-sm leading-6 text-zinc-300"
            >
              {item}
            </li>
          ))}
        </ul>
  
        <p className="mt-5 rounded-2xl bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
          {card.finalMentalModel}
        </p>
  
        {card.nextSteps && (
          <section className="mt-5">
            <h3 className="font-semibold text-zinc-100">Next steps</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {card.nextSteps.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
          </section>
        )}
      </CardShell>
    );
  }
  
  function GlossaryView({ card }: { card: GlossaryCard }) {
    return (
      <CardShell card={card}>
        <CollapsibleBlock
          block={{
            title: "Open glossary",
            items: card.terms.map((term) =>
              term.whyItMatters
                ? `${term.term}: ${term.definition} Why it matters: ${term.whyItMatters}`
                : `${term.term}: ${term.definition}`,
            ),
            defaultCollapsed: true,
            visualStyle: "glossary",
          }}
        />
      </CardShell>
    );
  }
  
  export default function CardRenderer({ card }: CardRendererProps) {
    switch (card.type) {
      case "intro":
        return <IntroView card={card} />;
      case "concept":
        return <ConceptView card={card} />;
      case "relationship":
        return <RelationshipView card={card} />;
      case "process_visual":
        return <ProcessVisualView card={card} />;
      case "taxonomy":
        return <TaxonomyView card={card} />;
      case "example":
        return <ExampleView card={card} />;
      case "common_confusion":
        return <CommonConfusionView card={card} />;
      case "retrieval_check":
        return <RetrievalCheckView card={card} />;
      case "comparison_table":
        return <ComparisonTableView card={card} />;
      case "skim":
        return <SkimView card={card} />;
      case "main_quiz":
        return (
          <CardShell card={card}>
            <QuizCard card={card} />
          </CardShell>
        );
      case "recap":
        return <RecapView card={card} />;
      case "glossary":
        return <GlossaryView card={card} />;
      default:
        return null;
    }
  }