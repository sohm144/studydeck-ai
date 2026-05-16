import type { LearningModule } from "@/types/studydeck";

export const sampleModule: LearningModule = {
  id: "memory-management-gc-sample",
  title: "Garbage Collection StudyDeck",
  topic: "Memory Management: Garbage Collection",
  courseContext: "CMPSC 461 - Programming Language Concepts",
  audience: "college_cs_students",

  sourceSummary:
    "This module reorganizes lecture material on heap management, garbage collection, reference counting, tracing collectors, mark-and-sweep, mark-and-compact, stop-and-copy, short-pause collection, and generational collection.",

  centralMentalModel:
    "Garbage collection is mainly a reachability problem: heap objects that can still be reached from active program references are live, and unreachable heap objects are garbage.",

  estimatedStudentContext: {
    assumedKnowledge: [
      "Basic variables and references",
      "Stack vs heap at a high level",
      "Objects can point to other objects",
      "Memory allocation creates objects dynamically",
    ],
    likelyGaps: [
      "Why accessibility matters more than ownership",
      "Why reference counting fails with cycles",
      "How tracing treats the heap like a directed graph",
      "Why different garbage collection algorithms have different pause-time and space tradeoffs",
    ],
  },

  lessonFlow: {
    teachingStrategy:
      "Start with why heap memory needs management, define garbage through accessibility, introduce reference counting as the simplest algorithm, show its failure case, then shift to tracing collectors and compare the major algorithm families.",
    sections: [
      {
        title: "Why memory needs management",
        purpose:
          "Explain heap allocation, garbage, and why automatic collection exists.",
        cardIds: ["intro", "heap-basics", "what-is-garbage"],
      },
      {
        title: "The central idea",
        purpose:
          "Make reachability/accessibility the core mental model for the rest of the module.",
        cardIds: ["reachability", "manual-vs-automatic"],
      },
      {
        title: "First algorithm: reference counting",
        purpose:
          "Show how a simple algorithm tracks ownership and why that is not enough.",
        cardIds: ["reference-counting", "rc-process", "ownership-accessibility"],
      },
      {
        title: "The taxonomy",
        purpose:
          "Show where each collector family fits before diving into tracing collectors.",
        cardIds: ["taxonomy", "mid-check"],
      },
      {
        title: "Trace-based collectors",
        purpose:
          "Explain mark-and-sweep, mark-and-compact, stop-and-copy, and generational collection through their tradeoffs.",
        cardIds: [
          "trace-based",
          "mark-sweep",
          "mark-compact",
          "stop-copy",
          "generational",
          "comparison",
        ],
      },
      {
        title: "Review",
        purpose:
          "Separate skim details from core knowledge, test understanding, and summarize the final mental model.",
        cardIds: ["skim-details", "main-quiz", "recap", "glossary"],
      },
    ],
  },

  learningGoals: [
    "Explain why heap memory needs allocation and deallocation.",
    "Define garbage as inaccessible heap objects.",
    "Explain why reachability is the core idea behind garbage collection.",
    "Describe how reference counting works and why cycles are a problem.",
    "Compare reference counting with trace-based collection.",
    "Explain the basic tradeoffs between mark-and-sweep, mark-and-compact, stop-and-copy, and generational collection.",
  ],

  cards: [
    {
      id: "intro",
      type: "intro",
      title: "What this module is really about",
      estimatedMinutes: 2,
      importance: "core",
      overview:
        "Garbage collection is the runtime system's way of finding heap objects your program can no longer use and reclaiming their memory safely.",
      learningGoals: [
        "Understand what counts as garbage",
        "Understand why accessibility matters",
        "Compare major garbage collection algorithms",
      ],
      whatToPayAttentionTo: [
        "The difference between ownership and accessibility",
        "The heap as a graph of objects and references",
        "The tradeoff between time overhead, pause time, and memory usage",
      ],
      tutorNote: {
        role: "explain",
        message:
          "Think of this module as one big question: can the running program still reach this heap object? If yes, keep it. If no, it is probably garbage.",
      },
      technicalTerms: ["garbage collection", "heap", "runtime system"],
    },

    {
      id: "heap-basics",
      type: "concept",
      title: "Heap memory is flexible, but messy",
      estimatedMinutes: 3,
      importance: "core",
      coreIdea:
        "The heap stores dynamically allocated objects whose lifetimes are not tied neatly to a single function call.",
      keyPoints: [
        {
          text: "An allocator searches for free heap space when the program requests memory.",
          importance: "core",
        },
        {
          text: "A deallocator reclaims free space and may merge adjacent free blocks.",
          importance: "core",
        },
        {
          text: "Heap compaction moves used blocks together to reduce scattered free space.",
          importance: "supporting",
        },
        {
          text: "Heap blocks may be larger than requested, which can cause internal fragmentation.",
          importance: "supporting",
        },
      ],
      miniExplanation:
        "Stack memory naturally disappears when a function returns. Heap memory does not. Something has to decide when heap objects are no longer needed.",
      skimDetails: {
        title: "Skim: fragmentation terms",
        items: [
          "Internal fragmentation: the assigned block is larger than the allocation request.",
          "External fragmentation: free space exists, but it is scattered so no single free block is large enough.",
        ],
        defaultCollapsed: true,
        visualStyle: "skim",
      },
      tutorNote: {
        role: "warning",
        message:
          "Heap management is where bugs like memory leaks and dangling pointers come from. Garbage collection is one attempt to reduce those bugs.",
      },
      technicalTerms: [
        "allocator",
        "deallocator",
        "heap compaction",
        "internal fragmentation",
        "external fragmentation",
      ],
    },

    {
      id: "what-is-garbage",
      type: "concept",
      title: "What counts as garbage?",
      estimatedMinutes: 3,
      importance: "core",
      coreIdea:
        "Garbage is a heap object that the program can no longer access.",
      keyPoints: [
        {
          text: "Ideally, garbage means any heap block that will not be used in the future.",
          importance: "core",
        },
        {
          text: "In practice, garbage collectors usually detect heap blocks that are inaccessible from the running program.",
          importance: "core",
        },
        {
          text: "Collecting too aggressively can create dangling pointers.",
          importance: "core",
        },
        {
          text: "Collecting too conservatively can create memory leaks.",
          importance: "core",
        },
      ],
      miniExplanation:
        "The runtime cannot perfectly predict the future, so it usually uses accessibility as a practical test: if the program has no path to the object, the object can be reclaimed.",
      tutorNote: {
        role: "common_mistake",
        message:
          "Do not define garbage as 'old memory.' Garbage is about whether the program can still reach the object, not how long the object has existed.",
      },
      technicalTerms: ["garbage", "inaccessible", "dangling pointer", "memory leak"],
    },

    {
      id: "reachability",
      type: "relationship",
      title: "The core relationship: roots reach live objects",
      estimatedMinutes: 3,
      importance: "core",
      relationships: [
        {
          from: "Roots",
          to: "Reachable heap objects",
          relationType: "enables",
          explanation:
            "Roots are active references in places like the stack, registers, or static area. Starting from roots, the collector follows pointers to discover live objects.",
        },
        {
          from: "Reachable objects",
          to: "Live objects",
          relationType: "maps_to",
          explanation:
            "If an object can be reached from roots, the collector treats it as still usable by the program.",
        },
        {
          from: "Unreachable objects",
          to: "Garbage",
          relationType: "maps_to",
          explanation:
            "If no chain of references from the roots reaches an object, the collector treats it as reclaimable garbage.",
        },
      ],
      takeaway:
        "Garbage collection is not mainly about object age. It is about whether a path exists from active program references to a heap object.",
      tutorNote: {
        role: "memory_trick",
        message:
          "Roots are the starting points. Pointers are roads. Reachable objects are places still on the map.",
        analogyQuality: {
          isAnalogy: true,
          mappingStrength: "strong",
          limitation:
            "Real garbage collectors deal with memory addresses and runtime metadata, not literal roads.",
        },
      },
      technicalTerms: ["root set", "reachable object", "live object", "heap graph"],
    },

    {
      id: "manual-vs-automatic",
      type: "comparison_table",
      title: "Manual vs automatic heap management",
      estimatedMinutes: 3,
      importance: "core",
      columns: ["Approach", "Main benefit", "Main cost", "Typical languages"],
      rows: [
        {
          label: "Programmer management",
          values: [
            "The programmer explicitly allocates and frees memory.",
            "Simple runtime implementation and high performance.",
            "Error-prone: dangling pointers and memory leaks.",
            "C, C++",
          ],
        },
        {
          label: "Automatic management",
          values: [
            "The runtime reclaims inaccessible objects automatically.",
            "Avoids many dangling-pointer and leak bugs.",
            "Usually slower than manual management.",
            "Java, Scheme",
          ],
        },
      ],
      takeaway:
        "Automatic management trades some performance overhead for safer memory behavior.",
      tutorNote: {
        role: "explain",
        message:
          "Manual memory management gives the programmer control. Garbage collection gives the runtime responsibility.",
      },
      technicalTerms: ["manual memory management", "automatic memory management"],
    },

    {
      id: "reference-counting",
      type: "concept",
      title: "Reference counting: collect when ownership drops to zero",
      estimatedMinutes: 4,
      importance: "core",
      coreIdea:
        "Reference counting stores a count with each heap object and collects the object when the count becomes zero.",
      keyPoints: [
        {
          text: "When an object is created, its reference count is initialized.",
          importance: "core",
        },
        {
          text: "When a new reference to the object is created, the count increments.",
          importance: "core",
        },
        {
          text: "When a reference is deleted or overwritten, the count decrements.",
          importance: "core",
        },
        {
          text: "When the count reaches zero, the object can be collected.",
          importance: "core",
        },
      ],
      miniExplanation:
        "Reference counting is local and immediate: each object keeps track of how many owners currently point to it.",
      tutorNote: {
        role: "explain",
        message:
          "This algorithm feels intuitive because it asks: how many references currently claim this object?",
      },
      technicalTerms: ["reference count", "increment", "decrement", "ownership"],
    },

    {
      id: "rc-process",
      type: "process_visual",
      title: "Reference counting as a step-by-step process",
      estimatedMinutes: 4,
      importance: "core",
      visualConcept: "Stack references pointing into heap objects",
      diagramIntent: {
        teaches:
          "How assignments and deleted references change reference counts over time.",
        entities: ["stack variable", "heap object", "reference count", "pointer"],
        relationships: [
          "Stack variables point to heap objects",
          "Heap objects can point to other heap objects",
          "Creating a reference increments a count",
          "Removing a reference decrements a count",
        ],
      },
      steps: [
        {
          label: "Create object",
          explanation:
            "A new heap object is allocated and starts with a reference count.",
          highlightTarget: "new heap object",
        },
        {
          label: "Assign reference",
          explanation:
            "When a variable or object field points to it, the object's reference count increases.",
          highlightTarget: "incoming pointer",
        },
        {
          label: "Delete or overwrite reference",
          explanation:
            "When that pointer disappears, the object's reference count decreases.",
          highlightTarget: "removed pointer",
        },
        {
          label: "Collect at zero",
          explanation:
            "If the count becomes zero, the object has no owners and can be reclaimed.",
          highlightTarget: "object with RC = 0",
        },
      ],
      takeaway:
        "Reference counting is easy to understand, but it only sees ownership counts, not full program accessibility.",
      technicalTerms: ["stack reference", "heap object", "RC = 0"],
    },

    {
      id: "ownership-accessibility",
      type: "common_confusion",
      title: "Common confusion: ownership is not accessibility",
      estimatedMinutes: 3,
      importance: "core",
      misconception:
        "If an object has a nonzero reference count, the program must still be able to use it.",
      correction:
        "A group of heap objects can reference each other in a cycle even after the program has lost access to the whole group.",
      whyItMatters:
        "Reference counting can fail on cycles because every object in the cycle may have RC > 0, even though no root can reach them.",
      tutorNote: {
        role: "warning",
        message:
          "This is the big weakness of reference counting. It tracks owners, but it can be fooled by objects owning each other.",
      },
      technicalTerms: ["cycle", "ownership", "accessibility", "root"],
    },

    {
      id: "taxonomy",
      type: "taxonomy",
      title: "The garbage collection taxonomy",
      estimatedMinutes: 3,
      importance: "core",
      root: "Garbage Collection",
      currentFocus: "Trace-Based",
      nodes: [
        {
          label: "Reference Counting",
          status: "covered",
        },
        {
          label: "Trace-Based",
          status: "current",
          children: [
            {
              label: "Stop-the-World",
              status: "current",
              children: [
                {
                  label: "Mark-and-Sweep",
                  status: "next",
                },
                {
                  label: "Mark-and-Compact",
                  status: "later",
                },
                {
                  label: "Stop-and-Copy",
                  status: "later",
                },
              ],
            },
            {
              label: "Short-Pause",
              status: "later",
              children: [
                {
                  label: "Partial",
                  status: "later",
                  children: [
                    {
                      label: "Generational",
                      status: "later",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      explanation:
        "Reference counting tracks local ownership. Trace-based collectors instead start from roots and traverse the heap graph to find what is accessible.",
      tutorNote: {
        role: "explain",
        message:
          "Use the taxonomy as a map. You do not need to master every collector at once; just know which family each one belongs to.",
      },
      technicalTerms: ["taxonomy", "trace-based collection", "stop-the-world"],
    },

    {
      id: "mid-check",
      type: "retrieval_check",
      title: "Quick retrieval check",
      estimatedMinutes: 2,
      importance: "core",
      prompt:
        "In one sentence: why is reachability more important than object age in garbage collection?",
      expectedAnswer:
        "Because an object is considered live if the program can still reach it from active references; unreachable objects are garbage even if they were created recently.",
      hint: "Start from roots, then follow pointers.",
      explanation:
        "Garbage collection is about whether the running program can access an object, not whether the object is old or new.",
      tutorNote: {
        role: "question",
        message:
          "Pause here. If this answer makes sense, the rest of the algorithms become much easier.",
      },
      technicalTerms: ["reachability", "roots", "live object"],
    },

    {
      id: "trace-based",
      type: "concept",
      title: "Trace-based collection: follow the graph",
      estimatedMinutes: 3,
      importance: "core",
      coreIdea:
        "Trace-based collectors identify live objects by starting from roots and traversing references through the heap.",
      keyPoints: [
        {
          text: "The root set includes references in registers, the stack, and static areas.",
          importance: "core",
        },
        {
          text: "The heap can be modeled as a directed graph: objects are nodes, references are edges.",
          importance: "core",
        },
        {
          text: "Accessible set means objects reachable from the root set.",
          importance: "core",
        },
        {
          text: "Unreachable blocks can be removed or reclaimed.",
          importance: "core",
        },
      ],
      miniExplanation:
        "Tracing asks a global question: starting from everything the program can currently touch, what heap objects can we reach?",
      tutorNote: {
        role: "explain",
        message:
          "This is why tracing solves the cycle problem. A cycle with no path from roots is still unreachable.",
      },
      technicalTerms: ["root set", "directed graph", "accessible set", "tracing"],
    },

    {
      id: "mark-sweep",
      type: "process_visual",
      title: "Mark-and-sweep: mark live, sweep dead",
      estimatedMinutes: 4,
      importance: "core",
      visualConcept: "Heap objects with mark bits",
      diagramIntent: {
        teaches:
          "How a collector marks reachable objects and sweeps through the heap to reclaim unmarked ones.",
        entities: ["root", "heap object", "mark bit", "free space"],
        relationships: [
          "Roots lead to reachable objects",
          "Visited objects get mark bit 1",
          "Unmarked objects are collected during sweep",
        ],
      },
      steps: [
        {
          label: "Trigger collection",
          explanation:
            "Collection commonly starts when the heap is full or the runtime decides collection is needed.",
        },
        {
          label: "Mark phase",
          explanation:
            "Traverse from roots and set the mark bit to 1 for each visited object.",
        },
        {
          label: "Sweep phase",
          explanation:
            "Traverse all objects in the heap. Collect objects whose mark bit is still 0.",
        },
        {
          label: "Reset for next collection",
          explanation:
            "For objects that survive, reset mark bits so the next collection can repeat the process.",
        },
      ],
      takeaway:
        "Mark-and-sweep is conceptually simple but must scan the heap during sweeping and can leave fragmented free space.",
      tutorNote: {
        role: "memory_trick",
        message:
          "Mark means 'I found it from the roots.' Sweep means 'everything I did not find gets cleaned up.'",
      },
      technicalTerms: ["mark bit", "mark phase", "sweep phase", "fragmentation"],
    },

    {
      id: "mark-compact",
      type: "concept",
      title: "Mark-and-compact: clean up fragmentation",
      estimatedMinutes: 3,
      importance: "supporting",
      coreIdea:
        "Mark-and-compact finds live objects and then moves them together to reduce fragmentation.",
      keyPoints: [
        {
          text: "It starts like tracing: identify reachable/live objects.",
          importance: "core",
        },
        {
          text: "Instead of leaving live objects scattered, it compacts them toward one end of the heap.",
          importance: "core",
        },
        {
          text: "Compaction helps create larger contiguous free space.",
          importance: "supporting",
        },
        {
          text: "The tradeoff is extra work because object locations and references may need updating.",
          importance: "supporting",
        },
      ],
      miniExplanation:
        "Mark-and-sweep reclaims dead objects but can leave holes. Mark-and-compact tries to remove the holes by moving live objects together.",
      tutorNote: {
        role: "analogy",
        message:
          "It is like cleaning a messy bookshelf by removing trash and sliding the remaining books together so the empty space is one clean block.",
        analogyQuality: {
          isAnalogy: true,
          mappingStrength: "medium",
          limitation:
            "Real compaction must also update references that pointed to moved objects.",
        },
      },
      technicalTerms: ["compaction", "contiguous free space", "fragmentation"],
    },

    {
      id: "stop-copy",
      type: "concept",
      title: "Stop-and-copy: copy live objects, ignore the rest",
      estimatedMinutes: 3,
      importance: "supporting",
      coreIdea:
        "Stop-and-copy divides memory into spaces and copies only live objects into the target space.",
      keyPoints: [
        {
          text: "The program pauses while collection happens.",
          importance: "core",
        },
        {
          text: "The collector traverses reachable objects and copies them to another space.",
          importance: "core",
        },
        {
          text: "Garbage is left behind and does not need to be individually swept.",
          importance: "supporting",
        },
        {
          text: "Its cost depends more on live data than total heap size.",
          importance: "core",
        },
      ],
      miniExplanation:
        "Instead of scanning every dead object to reclaim it, stop-and-copy focuses on preserving the live objects and then treats the old space as reusable.",
      tutorNote: {
        role: "explain",
        message:
          "This is why stop-and-copy is often described as O(L): the work is tied to the amount of live data, not every heap block.",
      },
      technicalTerms: ["copying collector", "live data", "pause time"],
    },

    {
      id: "generational",
      type: "concept",
      title: "Generational collection: most objects die young",
      estimatedMinutes: 3,
      importance: "supporting",
      coreIdea:
        "Generational collectors split objects by age and collect younger objects more frequently.",
      keyPoints: [
        {
          text: "Many allocated objects become unreachable quickly.",
          importance: "core",
        },
        {
          text: "The young generation is collected often.",
          importance: "core",
        },
        {
          text: "Objects that survive long enough can be promoted to an old generation.",
          importance: "supporting",
        },
        {
          text: "This can reduce pause time by collecting only part of the heap at a time.",
          importance: "supporting",
        },
      ],
      miniExplanation:
        "Generational collection is a practical optimization based on object lifetime patterns.",
      tutorNote: {
        role: "memory_trick",
        message:
          "The runtime bets that new objects are more likely to become garbage soon, so it checks the young area more often.",
      },
      technicalTerms: ["young generation", "old generation", "promotion"],
    },

    {
      id: "comparison",
      type: "comparison_table",
      title: "Collector comparison: what changes between algorithms?",
      estimatedMinutes: 5,
      importance: "core",
      columns: [
        "Main idea",
        "Strength",
        "Weakness",
        "Cost mental model",
      ],
      rows: [
        {
          label: "Reference Counting",
          values: [
            "Count incoming references for each object.",
            "Immediate reclamation when RC reaches 0.",
            "Fails on cycles because ownership is not accessibility.",
            "Cost is spread across pointer updates.",
          ],
        },
        {
          label: "Mark-and-Sweep",
          values: [
            "Mark reachable objects, sweep unmarked objects.",
            "Handles cycles using reachability.",
            "Can leave fragmented free space.",
            "Often tied to scanning the heap.",
          ],
        },
        {
          label: "Mark-and-Compact",
          values: [
            "Mark live objects, then move them together.",
            "Reduces fragmentation.",
            "Moving objects requires updating references.",
            "Extra compaction work after marking.",
          ],
        },
        {
          label: "Stop-and-Copy",
          values: [
            "Copy live objects to another space.",
            "Avoids sweeping dead objects one by one.",
            "Needs extra memory space and pauses the program.",
            "Cost tracks live data more than total heap size.",
          ],
        },
        {
          label: "Generational",
          values: [
            "Collect young objects more often than old objects.",
            "Matches the fact that many objects die young.",
            "More complex runtime bookkeeping.",
            "Cost reduced by collecting only part of the heap.",
          ],
        },
      ],
      takeaway:
        "Every collector is a tradeoff between safety, speed, pause behavior, memory overhead, and fragmentation.",
      tutorNote: {
        role: "explain",
        message:
          "For exams, compare algorithms by what they track, what they scan or copy, and what tradeoff they accept.",
      },
      technicalTerms: ["pause time", "time overhead", "space overhead"],
    },

    {
      id: "skim-details",
      type: "skim",
      title: "Skim-only details",
      estimatedMinutes: 2,
      importance: "scan",
      skimItems: [
        "First-fit selects the first free block large enough for an allocation request.",
        "Best-fit selects the smallest free block that can satisfy the request.",
        "Buddy systems maintain pools of block sizes based on powers of 2.",
        "Fibonacci heap allocation variants use pools based on Fibonacci-number sizes.",
      ],
      reasonTheseAreSkimmable:
        "These heap allocation strategies are useful context, but this module focuses mainly on garbage collection algorithms.",
      tutorNote: {
        role: "explain",
        message:
          "Skim this section unless your instructor specifically emphasizes allocator strategies.",
      },
      technicalTerms: ["first-fit", "best-fit", "buddy system"],
    },

    {
      id: "main-quiz",
      type: "main_quiz",
      title: "Main quiz: garbage collection",
      estimatedMinutes: 6,
      importance: "core",
      questions: [
        {
          question:
            "Why can reference counting fail to collect garbage in a cycle?",
          difficulty: "exam_style",
          testedConcept: "Reference counting vs reachability",
          choices: [
            {
              text: "Because every object in the cycle may still have a nonzero reference count even when no root can reach the cycle.",
              isCorrect: true,
              explanation:
                "Correct. The objects own each other, but the program cannot access the cycle from roots.",
            },
            {
              text: "Because reference counting never decrements counts.",
              isCorrect: false,
              explanation:
                "Incorrect. Reference counting does decrement counts, but cycles can keep counts above zero.",
            },
            {
              text: "Because cycles are always stored on the stack.",
              isCorrect: false,
              explanation:
                "Incorrect. The cycle problem is about heap objects referencing each other.",
            },
            {
              text: "Because tracing collectors cannot follow pointers.",
              isCorrect: false,
              explanation:
                "Incorrect. Tracing collectors are specifically designed to follow pointers from roots.",
            },
          ],
        },
        {
          question:
            "What is the best description of mark-and-sweep?",
          difficulty: "medium",
          testedConcept: "Mark-and-sweep",
          choices: [
            {
              text: "It marks reachable objects, then sweeps through the heap and collects unmarked objects.",
              isCorrect: true,
              explanation:
                "Correct. Mark finds live objects; sweep reclaims the rest.",
            },
            {
              text: "It copies every object to a new heap space.",
              isCorrect: false,
              explanation:
                "Incorrect. That better describes stop-and-copy.",
            },
            {
              text: "It collects objects only when their reference count reaches zero.",
              isCorrect: false,
              explanation:
                "Incorrect. That describes reference counting.",
            },
            {
              text: "It only collects objects in the young generation.",
              isCorrect: false,
              explanation:
                "Incorrect. That is related to generational collection.",
            },
          ],
        },
        {
          question:
            "Why can stop-and-copy be thought of as depending on live data?",
          difficulty: "exam_style",
          testedConcept: "Stop-and-copy complexity",
          choices: [
            {
              text: "Because it copies reachable objects and leaves unreachable objects behind.",
              isCorrect: true,
              explanation:
                "Correct. The collector's main work is preserving live objects, not sweeping every dead object individually.",
            },
            {
              text: "Because it only increments reference counts.",
              isCorrect: false,
              explanation:
                "Incorrect. Stop-and-copy is not reference counting.",
            },
            {
              text: "Because it never pauses the program.",
              isCorrect: false,
              explanation:
                "Incorrect. It is a stop-the-world style collector.",
            },
            {
              text: "Because all heap objects are always live.",
              isCorrect: false,
              explanation:
                "Incorrect. If all objects were live, there would be no garbage to reclaim.",
            },
          ],
        },
      ],
      tutorNote: {
        role: "question",
        message:
          "Treat this like an exam check: can you explain the tradeoff, not just name the algorithm?",
      },
      technicalTerms: ["cycle", "mark-and-sweep", "stop-and-copy"],
    },

    {
      id: "recap",
      type: "recap",
      title: "Final recap",
      estimatedMinutes: 3,
      importance: "core",
      mustRemember: [
        "Garbage means inaccessible heap objects.",
        "Reachability from roots is the central idea behind tracing collectors.",
        "Reference counting is simple, but cycles expose the gap between ownership and accessibility.",
        "Mark-and-sweep marks reachable objects and reclaims unmarked objects.",
        "Mark-and-compact reduces fragmentation by moving live objects together.",
        "Stop-and-copy copies live objects and leaves garbage behind.",
        "Generational collection uses the fact that many objects die young.",
      ],
      finalMentalModel:
        "Start from roots, follow references, keep what is reachable, reclaim what is unreachable. Every garbage collection algorithm is a different strategy for doing that with different costs.",
      nextSteps: [
        "Practice drawing roots, heap nodes, and pointer edges.",
        "Compare collectors by time overhead, pause time, and space overhead.",
        "Explain why cycles break reference counting in your own words.",
      ],
      tutorNote: {
        role: "memory_trick",
        message:
          "If you remember one thing: garbage collection is not magic cleanup. It is a reachability test plus a reclamation strategy.",
      },
      technicalTerms: ["reachability", "roots", "reclamation strategy"],
    },

    {
      id: "glossary",
      type: "glossary",
      title: "Glossary",
      estimatedMinutes: 4,
      importance: "supporting",
      collapsedByDefault: true,
      terms: [
        {
          term: "Heap",
          definition:
            "A memory region used for dynamically allocated objects whose lifetimes are not tied to one function call.",
          whyItMatters:
            "Garbage collection mainly manages heap memory.",
        },
        {
          term: "Garbage",
          definition:
            "A heap object that the running program can no longer access.",
          whyItMatters:
            "The collector's job is to reclaim garbage safely.",
        },
        {
          term: "Root set",
          definition:
            "Active references in registers, the stack, or static areas that serve as starting points for tracing.",
          whyItMatters:
            "Reachability starts from the root set.",
        },
        {
          term: "Reference counting",
          definition:
            "A garbage collection strategy that tracks how many references point to each object.",
          whyItMatters:
            "It is simple but fails on cycles.",
        },
        {
          term: "Mark-and-sweep",
          definition:
            "A tracing strategy that marks reachable objects and sweeps unmarked objects.",
          whyItMatters:
            "It is a classic example of trace-based collection.",
        },
        {
          term: "Compaction",
          definition:
            "Moving live objects together to reduce fragmented free space.",
          whyItMatters:
            "It helps create larger contiguous free regions.",
        },
        {
          term: "Generational collection",
          definition:
            "A strategy that groups objects by age and collects younger objects more frequently.",
          whyItMatters:
            "It improves efficiency by exploiting object lifetime patterns.",
        },
      ],
      tutorNote: {
        role: "explain",
        message:
          "Use this glossary at the end. Do not memorize first; understand the flow, then use terms to tighten your language.",
      },
      technicalTerms: ["heap", "garbage", "root set", "compaction"],
    },
  ],

  glossary: [
    {
      term: "Heap",
      definition:
        "A memory region used for dynamically allocated objects whose lifetimes are not tied to one function call.",
      whyItMatters: "Garbage collection mainly manages heap memory.",
    },
    {
      term: "Garbage",
      definition:
        "A heap object that the running program can no longer access.",
      whyItMatters: "The collector's job is to reclaim garbage safely.",
    },
    {
      term: "Root set",
      definition:
        "Active references in registers, the stack, or static areas that serve as starting points for tracing.",
      whyItMatters: "Reachability starts from the root set.",
    },
    {
      term: "Reference counting",
      definition:
        "A garbage collection strategy that tracks how many references point to each object.",
      whyItMatters: "It is simple but fails on cycles.",
    },
    {
      term: "Mark-and-sweep",
      definition:
        "A tracing strategy that marks reachable objects and sweeps unmarked objects.",
      whyItMatters: "It is a classic example of trace-based collection.",
    },
    {
      term: "Compaction",
      definition:
        "Moving live objects together to reduce fragmented free space.",
      whyItMatters: "It helps create larger contiguous free regions.",
    },
    {
      term: "Generational collection",
      definition:
        "A strategy that groups objects by age and collects younger objects more frequently.",
      whyItMatters:
        "It improves efficiency by exploiting object lifetime patterns.",
    },
  ],

  metadata: {
    generatedAt: "2026-05-15T00:00:00.000Z",
    moduleLength: "normal",
    sourceType: "raw_notes",
  },
};