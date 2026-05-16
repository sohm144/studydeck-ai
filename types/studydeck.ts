export type Importance = "core" | "supporting" | "scan";

export type ModuleLength = "short" | "normal" | "deep";

export type SourceType =
  | "raw_notes"
  | "lecture_transcript"
  | "youtube_transcript"
  | "other";

export type TutorRole =
  | "explain"
  | "warning"
  | "memory_trick"
  | "analogy"
  | "question"
  | "common_mistake";

export type TutorNote = {
  role: TutorRole;
  message: string;
  analogyQuality?: {
    isAnalogy: boolean;
    mappingStrength?: "weak" | "medium" | "strong";
    limitation?: string;
  };
};

export type GlossaryItem = {
  term: string;
  definition: string;
  whyItMatters?: string;
};

export type CollapsibleBlock = {
  title: string;
  items: string[];
  defaultCollapsed: boolean;
  visualStyle: "skim" | "glossary" | "extra_context";
};

export type LessonFlow = {
  teachingStrategy: string;
  sections: {
    title: string;
    purpose: string;
    cardIds: string[];
  }[];
};

export type BaseCard = {
  id: string;
  type: string;
  title: string;
  estimatedMinutes?: number;
  importance: Importance;
  tutorNote?: TutorNote;
  technicalTerms?: string[];
};

export type IntroCard = BaseCard & {
  type: "intro";
  overview: string;
  learningGoals: string[];
  whatToPayAttentionTo: string[];
};

export type ConceptCard = BaseCard & {
  type: "concept";
  coreIdea: string;
  keyPoints: {
    text: string;
    importance: Importance;
  }[];
  miniExplanation?: string;
  skimDetails?: CollapsibleBlock;
};

export type RelationshipCard = BaseCard & {
  type: "relationship";
  relationships: {
    from: string;
    to: string;
    relationType:
      | "causes"
      | "requires"
      | "maps_to"
      | "updates"
      | "contrasts_with"
      | "bidirectional"
      | "prevents"
      | "enables";
    explanation: string;
  }[];
  takeaway: string;
};

export type ProcessVisualCard = BaseCard & {
  type: "process_visual";
  visualConcept: string;
  diagramIntent?: {
    teaches: string;
    entities: string[];
    relationships: string[];
  };
  steps: {
    label: string;
    explanation: string;
    highlightTarget?: string;
  }[];
  takeaway: string;
};

export type TaxonomyNode = {
  label: string;
  children?: TaxonomyNode[];
  status?: "covered" | "current" | "next" | "later" | "skim";
};

export type TaxonomyCard = BaseCard & {
  type: "taxonomy";
  root: string;
  nodes: TaxonomyNode[];
  currentFocus?: string;
  explanation: string;
};

export type ExampleCard = BaseCard & {
  type: "example";
  scenario: string;
  walkthrough: string[];
  takeaway: string;
};

export type CommonConfusionCard = BaseCard & {
  type: "common_confusion";
  misconception: string;
  correction: string;
  whyItMatters: string;
};

export type RetrievalCheckCard = BaseCard & {
  type: "retrieval_check";
  prompt: string;
  expectedAnswer: string;
  hint?: string;
  explanation: string;
};

export type ComparisonTableCard = BaseCard & {
  type: "comparison_table";
  columns: string[];
  rows: {
    label: string;
    values: string[];
  }[];
  takeaway: string;
};

export type SkimCard = BaseCard & {
  type: "skim";
  skimItems: string[];
  reasonTheseAreSkimmable: string;
};

export type QuizQuestion = {
  question: string;
  choices: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  difficulty: "medium" | "exam_style";
  testedConcept: string;
};

export type MainQuizCard = BaseCard & {
  type: "main_quiz";
  questions: QuizQuestion[];
};

export type RecapCard = BaseCard & {
  type: "recap";
  mustRemember: string[];
  finalMentalModel: string;
  nextSteps?: string[];
};

export type GlossaryCard = BaseCard & {
  type: "glossary";
  terms: GlossaryItem[];
  collapsedByDefault: true;
};

export type LearningCard =
  | IntroCard
  | ConceptCard
  | RelationshipCard
  | ProcessVisualCard
  | TaxonomyCard
  | ExampleCard
  | CommonConfusionCard
  | RetrievalCheckCard
  | ComparisonTableCard
  | SkimCard
  | MainQuizCard
  | RecapCard
  | GlossaryCard;

export type LearningModule = {
  id: string;
  title: string;
  topic: string;
  courseContext?: string;
  audience: "college_cs_students";
  sourceSummary: string;
  centralMentalModel: string;
  estimatedStudentContext: {
    assumedKnowledge: string[];
    likelyGaps: string[];
  };
  lessonFlow: LessonFlow;
  learningGoals: string[];
  cards: LearningCard[];
  glossary: GlossaryItem[];
  metadata: {
    generatedAt: string;
    moduleLength: ModuleLength;
    sourceType: SourceType;
  };
};