export const GAME_DESIGN_COURSE_SLUG = "professional-certificate-game-design" as const;

export type GameDesignVisualizationKey =
  | "territory-map"
  | "rule-loop"
  | "community-map"
  | "mda"
  | "interaction-loop"
  | "emergence-sandbox"
  | "choice-chance"
  | "ideation-matrix"
  | "prototype-fidelity"
  | "playtest-loop"
  | "usability-check"
  | "responsibility-lens"
  | "accessibility-audit"
  | "team-workflow"
  | "development-cadence"
  | "game-feel"
  | "scope-matrix"
  | "black-box"
  | "pitch-builder"
  | "business-model"
  | "industry-map"
  | "industry-voices"
  | "capstone-plan"
  | "capstone-showcase"
;

export type GameDesignActivity = { title: string; steps: readonly string[]; deliverable: string; };
export type GameDesignKnowledgeQuestion = { question: string; options: readonly string[]; correctIndex: number; explanation: string; };

type GameDesignModuleInteraction = { num: string; title: string; partId: number; visualizationKey: GameDesignVisualizationKey; activity: GameDesignActivity; reflectionPrompt: string; knowledgeCheck: readonly GameDesignKnowledgeQuestion[]; };

export const GAME_DESIGN_MODULE_INTERACTIONS: readonly GameDesignModuleInteraction[] = [
  {
    num: "01", title: "The Territory of Game Design", partId: 1,
    visualizationKey: "territory-map",
    reflectionPrompt: "Think about a game that first made you want to design games. What was it about that game's design — its rules, its world, its feel — that sparked your interest? How does that experience connect to what you learned about the territory of game design today?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to The Territory of Game Design?",
        options: ["Defining Game Design", "Brainstorming Techniques", "Team Roles in Game Development"],
        correctIndex: 0,
        explanation: "This module explicitly develops Defining Game Design as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A one-page field note that separates rules, player action, and experience.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A one-page field note that separates rules, player action, and experience.",
      },
    ],
    activity: {
      title: "Start your Game Design Field Notes",
      steps: [
        "Choose a familiar game and name one player decision worth examining.",
        "Describe the rules, players, and intended experience behind that decision.",
        "Record one question you want to investigate as a designer.",
      ],
      deliverable: "A one-page field note that separates rules, player action, and experience.",
    },
  },
  {
    num: "02", title: "Games, Rules, and Players", partId: 1,
    visualizationKey: "rule-loop",
    reflectionPrompt: "Pick a game you know well and identify one implicit rule — something players follow that is never written down. Where did that rule come from? What would happen to the game if it were made explicit, or if it were removed entirely?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Games, Rules, and Players?",
        options: ["Constitutive, Operational, and Implicit Rules", "What is a Prototype?", "Game Development Pipeline"],
        correctIndex: 0,
        explanation: "This module explicitly develops Constitutive, Operational, and Implicit Rules as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A before-and-after rule card with a short player-impact analysis.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A before-and-after rule card with a short player-impact analysis.",
      },
    ],
    activity: {
      title: "Rewrite a Rule",
      steps: [
        "Select one rule that strongly shapes player agency.",
        "Explain the possibility space the rule creates.",
        "Rewrite the rule twice and predict how player behavior would change.",
      ],
      deliverable: "A before-and-after rule card with a short player-impact analysis.",
    },
  },
  {
    num: "03", title: "Play Communities", partId: 1,
    visualizationKey: "community-map",
    reflectionPrompt: "Describe a play community you have been part of — online or in person. What norms governed how people behaved? Were those norms healthy or harmful? What design decisions in the game itself encouraged or discouraged those norms?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Play Communities?",
        options: ["How Play Communities Form", "Types of Playtesting", "What is Game Feel?"],
        correctIndex: 0,
        explanation: "This module explicitly develops How Play Communities Form as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A community map with one evidence-based design recommendation.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A community map with one evidence-based design recommendation.",
      },
    ],
    activity: {
      title: "Map a Play Community",
      steps: [
        "Choose a game community you can observe respectfully.",
        "Map its roles, rituals, norms, and points of friction.",
        "Identify one design choice that could support healthier participation.",
      ],
      deliverable: "A community map with one evidence-based design recommendation.",
    },
  },
  {
    num: "04", title: "Building Blocks of Game Design", partId: 1,
    visualizationKey: "mda",
    reflectionPrompt: "Choose a game you played recently and apply the MDA framework to it. What are its core mechanics? What dynamics emerge from those mechanics? What aesthetic experience do those dynamics produce? Did the designer achieve what you think they intended?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Building Blocks of Game Design?",
        options: ["Mechanics, Dynamics, Aesthetics (MDA)", "Usability Heuristics for Games", "Scope Creep and Its Causes"],
        correctIndex: 0,
        explanation: "This module explicitly develops Mechanics, Dynamics, Aesthetics (MDA) as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["An MDA canvas with one proposed mechanics-level experiment.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: An MDA canvas with one proposed mechanics-level experiment.",
      },
    ],
    activity: {
      title: "Build an MDA analysis",
      steps: [
        "Pick a game and list three mechanics that drive its core loop.",
        "Describe the dynamics those mechanics produce in play.",
        "Name the aesthetic experience the system appears to target.",
      ],
      deliverable: "An MDA canvas with one proposed mechanics-level experiment.",
    },
  },
  {
    num: "05", title: "Modes of Interaction", partId: 1,
    visualizationKey: "interaction-loop",
    reflectionPrompt: "Think of a game that uses an interaction mode you find particularly compelling. Why does that mode work so well for that game? Now imagine the same game redesigned with a different interaction mode — what would change, and what would be lost?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Modes of Interaction?",
        options: ["Solo, Cooperative, and Competitive Play", "Cultural Representation in Games", "The Game Loop"],
        correctIndex: 0,
        explanation: "This module explicitly develops Solo, Cooperative, and Competitive Play as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["An interaction-loop diagram and a short redesign rationale.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: An interaction-loop diagram and a short redesign rationale.",
      },
    ],
    activity: {
      title: "Trace an Interaction Loop",
      steps: [
        "Choose one player action and trace input, system response, feedback, and next decision.",
        "Mark the point where information or agency is lost.",
        "Propose one change that makes the loop clearer or more expressive.",
      ],
      deliverable: "An interaction-loop diagram and a short redesign rationale.",
    },
  },
  {
    num: "06", title: "Emergent Behavior", partId: 1,
    visualizationKey: "emergence-sandbox",
    reflectionPrompt: "Describe a moment of emergence you have experienced in a game — a situation the designers almost certainly did not script but that arose naturally from the rules. What conditions in the game made that moment possible? How would you design a rule set to encourage more moments like it?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Emergent Behavior?",
        options: ["Emergence vs. Scripted Events", "Inclusive Design Principles", "Pitch Formats: Elevator Pitch, One-Pager, Full Pitch"],
        correctIndex: 0,
        explanation: "This module explicitly develops Emergence vs. Scripted Events as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["An emergence log with rules, observed behavior, and a next experiment.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: An emergence log with rules, observed behavior, and a next experiment.",
      },
    ],
    activity: {
      title: "Prototype for Emergence",
      steps: [
        "Write three simple rules that can interact without scripting outcomes.",
        "Run a short tabletop or paper simulation.",
        "Log an unexpected behavior and the conditions that enabled it.",
      ],
      deliverable: "An emergence log with rules, observed behavior, and a next experiment.",
    },
  },
  {
    num: "07", title: "Choice and Chance", partId: 2,
    visualizationKey: "choice-chance",
    reflectionPrompt: "Think of a game where you felt a decision was truly meaningful — where your choice genuinely mattered. Now think of a game where a decision felt like an illusion. What made the difference? How would you apply that insight to a mechanic you are designing?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Choice and Chance?",
        options: ["Meaningful vs. Illusory Choice", "Team Roles in Game Development", "Games Industry Overview and Market Size"],
        correctIndex: 0,
        explanation: "This module explicitly develops Meaningful vs. Illusory Choice as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A choice architecture or chance mechanism with a fairness note.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A choice architecture or chance mechanism with a fairness note.",
      },
    ],
    activity: {
      title: "Design Choice and Chance",
      steps: [
        "Define one meaningful choice with at least two viable options.",
        "Add a chance mechanism and calculate its rough outcome distribution.",
        "Explain how a player can make an informed risk decision.",
      ],
      deliverable: "A choice architecture or chance mechanism with a fairness note.",
    },
  },
  {
    num: "08", title: "Ideation and Concepts", partId: 2,
    visualizationKey: "ideation-matrix",
    reflectionPrompt: "Using the SCAMPER method, take a game you know well and generate at least three new concept variations by substituting, combining, or reversing one of its core elements. Which variation excites you most, and why? What design brief would you write for it?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Ideation and Concepts?",
        options: ["Brainstorming Techniques", "Game Development Pipeline", "Career Paths in Game Design"],
        correctIndex: 0,
        explanation: "This module explicitly develops Brainstorming Techniques as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A three-concept sheet plus a justified concept decision.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A three-concept sheet plus a justified concept decision.",
      },
    ],
    activity: {
      title: "Generate and Select Concepts",
      steps: [
        "Generate three concepts using a constraint such as one mechanic or one emotion.",
        "Compare them against audience, novelty, and feasibility.",
        "Select one and write the next testable design question.",
      ],
      deliverable: "A three-concept sheet plus a justified concept decision.",
    },
  },
  {
    num: "09", title: "Fundamentals of Prototyping", partId: 2,
    visualizationKey: "prototype-fidelity",
    reflectionPrompt: "Build a paper prototype of a single mechanic from a game concept you have been thinking about. What design question did you set out to answer? What did the prototype reveal that you could not have discovered just by thinking about it?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Fundamentals of Prototyping?",
        options: ["What is a Prototype?", "What is Game Feel?", "Sound Design for Games"],
        correctIndex: 0,
        explanation: "This module explicitly develops What is a Prototype? as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A playable prototype brief with setup, loop, and question.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A playable prototype brief with setup, loop, and question.",
      },
    ],
    activity: {
      title: "Make a Low-Fidelity Prototype",
      steps: [
        "Reduce one mechanic to paper, cards, tokens, or a clickable sketch.",
        "Define the smallest playable loop.",
        "List what the prototype is deliberately not trying to prove.",
      ],
      deliverable: "A playable prototype brief with setup, loop, and question.",
    },
  },
  {
    num: "10", title: "Playtesting and Iteration", partId: 2,
    visualizationKey: "playtest-loop",
    reflectionPrompt: "After your most recent playtest session, what was the single most surprising thing you observed? Did players use a mechanic in a way you did not anticipate? How did that observation change your next design decision?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Playtesting and Iteration?",
        options: ["Types of Playtesting", "Scope Creep and Its Causes", "Capstone Project Brief and Requirements"],
        correctIndex: 0,
        explanation: "This module explicitly develops Types of Playtesting as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A playtest brief containing protocol, evidence, findings, and next iteration.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A playtest brief containing protocol, evidence, findings, and next iteration.",
      },
    ],
    activity: {
      title: "Run a Structured Playtest",
      steps: [
        "Write a test objective and a neutral observation protocol.",
        "Observe at least one player without coaching.",
        "Turn observations into prioritized changes, not just opinions.",
      ],
      deliverable: "A playtest brief containing protocol, evidence, findings, and next iteration.",
    },
  },
  {
    num: "11", title: "Usability", partId: 2,
    visualizationKey: "usability-check",
    reflectionPrompt: "Think about a game that taught you how to play without a tutorial — where the design itself guided you. What specific design choices made that possible? Now think about a game where the onboarding failed you. What would you change?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Usability?",
        options: ["Usability Heuristics for Games", "The Game Loop", "Design Iteration and Prototype Refinement"],
        correctIndex: 0,
        explanation: "This module explicitly develops Usability Heuristics for Games as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A usability audit with one annotated redesign.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A usability audit with one annotated redesign.",
      },
    ],
    activity: {
      title: "Audit Learnability",
      steps: [
        "Choose a game onboarding or first-play experience.",
        "Evaluate signposting, cognitive load, feedback, and rule communication.",
        "Redesign one moment for clearer learning without removing discovery.",
      ],
      deliverable: "A usability audit with one annotated redesign.",
    },
  },
  {
    num: "12", title: "Cultural Responsibility", partId: 2,
    visualizationKey: "responsibility-lens",
    reflectionPrompt: "Identify a game that engages with a culture other than the designer's own. How well does it represent that culture? What research or consultation would have improved it? If you were designing a game that engaged with a culture you are not part of, what steps would you take?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Cultural Responsibility?",
        options: ["Cultural Representation in Games", "Pitch Formats: Elevator Pitch, One-Pager, Full Pitch", "Defining Game Design"],
        correctIndex: 0,
        explanation: "This module explicitly develops Cultural Representation in Games as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A short cultural-responsibility memo with an action decision.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A short cultural-responsibility memo with an action decision.",
      },
    ],
    activity: {
      title: "Write a Responsibility Memo",
      steps: [
        "Identify a representation, cultural, or impact risk in a game concept.",
        "Separate evidence from assumption and consult an affected perspective where possible.",
        "Propose a mitigation or a reasoned decision to change scope.",
      ],
      deliverable: "A short cultural-responsibility memo with an action decision.",
    },
  },
  {
    num: "13", title: "Inclusivity and Accessibility", partId: 3,
    visualizationKey: "accessibility-audit",
    reflectionPrompt: "Choose a game you know well and conduct a quick accessibility audit using the Game Accessibility Guidelines. Which category of accessibility — visual, auditory, motor, or cognitive — is most neglected? What is one concrete change that would make the biggest difference for the most players?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Inclusivity and Accessibility?",
        options: ["Inclusive Design Principles", "Games Industry Overview and Market Size", "Constitutive, Operational, and Implicit Rules"],
        correctIndex: 0,
        explanation: "This module explicitly develops Inclusive Design Principles as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["An accessibility backlog with priorities and acceptance criteria.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: An accessibility backlog with priorities and acceptance criteria.",
      },
    ],
    activity: {
      title: "Run an Accessibility Audit",
      steps: [
        "Review a game across visual, auditory, motor, and cognitive access.",
        "Record barriers and the player impact of each one.",
        "Prioritize changes by reach and implementation effort.",
      ],
      deliverable: "An accessibility backlog with priorities and acceptance criteria.",
    },
  },
  {
    num: "14", title: "Digital Prototyping in Teams", partId: 3,
    visualizationKey: "team-workflow",
    reflectionPrompt: "Reflect on a collaborative project you have worked on — in games or any other field. What was the biggest communication or coordination challenge? How did it affect the outcome? What workflow or tool would have helped most, and why?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Digital Prototyping in Teams?",
        options: ["Team Roles in Game Development", "Career Paths in Game Design", "How Play Communities Form"],
        correctIndex: 0,
        explanation: "This module explicitly develops Team Roles in Game Development as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A team workflow map and one sprint-ready prototype brief.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A team workflow map and one sprint-ready prototype brief.",
      },
    ],
    activity: {
      title: "Plan a Team Prototype",
      steps: [
        "Define a small digital prototype and the roles needed to make it.",
        "Design a handoff between design, art, and engineering.",
        "Choose a shared definition of done for the next build.",
      ],
      deliverable: "A team workflow map and one sprint-ready prototype brief.",
    },
  },
  {
    num: "15", title: "Development Practices", partId: 3,
    visualizationKey: "development-cadence",
    reflectionPrompt: "Write a one-page GDD for a game concept you have been developing. What was hardest to articulate clearly — the mechanics, the tone, the target audience, or the core loop? What does that difficulty tell you about where your design still needs more thinking?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Development Practices?",
        options: ["Game Development Pipeline", "Sound Design for Games", "Mechanics, Dynamics, Aesthetics (MDA)"],
        correctIndex: 0,
        explanation: "This module explicitly develops Game Development Pipeline as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A lightweight development plan with review checkpoints.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A lightweight development plan with review checkpoints.",
      },
    ],
    activity: {
      title: "Create a Development Practice",
      steps: [
        "Choose a versioning, backlog, review, and playtest cadence.",
        "Define how design decisions will be documented.",
        "Identify one risk that the cadence should surface early.",
      ],
      deliverable: "A lightweight development plan with review checkpoints.",
    },
  },
  {
    num: "16", title: "Game Feel", partId: 3,
    visualizationKey: "game-feel",
    reflectionPrompt: "Play a game for 10 minutes with your full attention on game feel rather than strategy. What specific moment felt the most satisfying? Break it down: what combination of input response, animation, sound, and visual feedback created that feeling? How would you recreate it?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Game Feel?",
        options: ["What is Game Feel?", "Capstone Project Brief and Requirements", "Solo, Cooperative, and Competitive Play"],
        correctIndex: 0,
        explanation: "This module explicitly develops What is Game Feel? as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A game-feel scorecard with a focused polish experiment.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A game-feel scorecard with a focused polish experiment.",
      },
    ],
    activity: {
      title: "Score Game Feel",
      steps: [
        "Choose one player action and list its visual, animation, audio, and haptic feedback.",
        "Rate responsiveness and feedback clarity before changes.",
        "Propose a small polish pass and rate the expected improvement.",
      ],
      deliverable: "A game-feel scorecard with a focused polish experiment.",
    },
  },
  {
    num: "17", title: "Project Scoping", partId: 3,
    visualizationKey: "scope-matrix",
    reflectionPrompt: "Take a game concept you are working on and list every feature you want it to have. Now cut the list in half — keep only the features that are essential to the core experience. What did you cut? Was it painful? What does that tell you about what your game is really about?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Project Scoping?",
        options: ["Scope Creep and Its Causes", "Design Iteration and Prototype Refinement", "Emergence vs. Scripted Events"],
        correctIndex: 0,
        explanation: "This module explicitly develops Scope Creep and Its Causes as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A scope sheet with must-have, should-have, and later features.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A scope sheet with must-have, should-have, and later features.",
      },
    ],
    activity: {
      title: "Scope the Smallest Viable Game",
      steps: [
        "Write the player promise in one sentence.",
        "Place features on an impact-versus-effort matrix.",
        "Cut or defer work until the core loop can be tested quickly.",
      ],
      deliverable: "A scope sheet with must-have, should-have, and later features.",
    },
  },
  {
    num: "18", title: "Opening the Black Box", partId: 3,
    visualizationKey: "black-box",
    reflectionPrompt: "Think about a design idea you have had that you were not sure was technically feasible. After this module, do you have a better sense of whether it is possible — and what the trade-offs might be? What would you ask an engineer to help you understand better?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Opening the Black Box?",
        options: ["The Game Loop", "Defining Game Design", "Meaningful vs. Illusory Choice"],
        correctIndex: 0,
        explanation: "This module explicitly develops The Game Loop as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A system brief that makes hidden dependencies visible.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A system brief that makes hidden dependencies visible.",
      },
    ],
    activity: {
      title: "Open the Black Box",
      steps: [
        "Explain one technical system in plain language for a collaborator.",
        "List assumptions, inputs, outputs, and failure cases.",
        "Name the next question that needs an experiment rather than a guess.",
      ],
      deliverable: "A system brief that makes hidden dependencies visible.",
    },
  },
  {
    num: "19", title: "Demonstrating Game Ideas", partId: 4,
    visualizationKey: "pitch-builder",
    reflectionPrompt: "Write a 60-second elevator pitch for your capstone game concept. Read it aloud and time it. What did you have to cut to fit the time? What does that cutting process reveal about what is most essential in your game?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Demonstrating Game Ideas?",
        options: ["Pitch Formats: Elevator Pitch, One-Pager, Full Pitch", "Constitutive, Operational, and Implicit Rules", "Brainstorming Techniques"],
        correctIndex: 0,
        explanation: "This module explicitly develops Pitch Formats: Elevator Pitch, One-Pager, Full Pitch as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A timed pitch outline plus a demonstration checklist.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A timed pitch outline plus a demonstration checklist.",
      },
    ],
    activity: {
      title: "Prepare a Demonstration",
      steps: [
        "Write a 60-second elevator pitch.",
        "Choose the smallest playable or visual slice that proves the idea.",
        "Tailor the demonstration to a player, peer, or decision-maker.",
      ],
      deliverable: "A timed pitch outline plus a demonstration checklist.",
    },
  },
  {
    num: "20", title: "Business of Games", partId: 4,
    visualizationKey: "business-model",
    reflectionPrompt: "Choose a revenue model for your capstone game concept and justify it. Why does that model fit your game's design and target audience? What are the ethical implications of that model — and how would you address them in your design?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Business of Games?",
        options: ["Games Industry Overview and Market Size", "How Play Communities Form", "What is a Prototype?"],
        correctIndex: 0,
        explanation: "This module explicitly develops Games Industry Overview and Market Size as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A one-page business canvas with an ethics check.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A one-page business canvas with an ethics check.",
      },
    ],
    activity: {
      title: "Draft a Business Model",
      steps: [
        "Define audience, value, discovery path, and sustainable revenue options.",
        "Identify one monetization or business risk that could harm player trust.",
        "Choose a model that fits the game’s intended experience.",
      ],
      deliverable: "A one-page business canvas with an ethics check.",
    },
  },
  {
    num: "21", title: "Industry Voices I", partId: 4,
    visualizationKey: "industry-map",
    reflectionPrompt: "After hearing from industry professionals, which career path resonates most with you — and why? What skills or experiences do you still need to develop? What is one concrete step you could take in the next month to move toward that path?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Industry Voices I?",
        options: ["Career Paths in Game Design", "Mechanics, Dynamics, Aesthetics (MDA)", "Types of Playtesting"],
        correctIndex: 0,
        explanation: "This module explicitly develops Career Paths in Game Design as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A role comparison and a 30-day evidence-building plan.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A role comparison and a 30-day evidence-building plan.",
      },
    ],
    activity: {
      title: "Build a Career Map",
      steps: [
        "Compare two industry roles or disciplines represented in the course.",
        "List skills, evidence, and collaborators each role requires.",
        "Choose one skill gap to address in your portfolio next.",
      ],
      deliverable: "A role comparison and a 30-day evidence-building plan.",
    },
  },
  {
    num: "22", title: "Industry Voices II", partId: 4,
    visualizationKey: "industry-voices",
    reflectionPrompt: "Which specialized discipline covered in this module — sound design, narrative design, accessibility, or independent development — most changed how you think about your own design practice? What is one thing you will do differently in your capstone project as a result?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Industry Voices II?",
        options: ["Sound Design for Games", "Solo, Cooperative, and Competitive Play", "Usability Heuristics for Games"],
        correctIndex: 0,
        explanation: "This module explicitly develops Sound Design for Games as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["An industry-voice memo with takeaways and questions.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: An industry-voice memo with takeaways and questions.",
      },
    ],
    activity: {
      title: "Conduct an Industry Voice Study",
      steps: [
        "Choose an industry talk, interview, or postmortem.",
        "Extract two decisions and the constraints behind them.",
        "Draft questions you would ask the practitioner in a follow-up conversation.",
      ],
      deliverable: "An industry-voice memo with takeaways and questions.",
    },
  },
  {
    num: "23", title: "Designing a Game I", partId: 4,
    visualizationKey: "capstone-plan",
    reflectionPrompt: "After your first playtest of your capstone prototype, what is the single most important thing you learned about your game? Was it something you expected, or did it surprise you? How will it change the direction of your design in Module 24?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Designing a Game I?",
        options: ["Capstone Project Brief and Requirements", "Emergence vs. Scripted Events", "Cultural Representation in Games"],
        correctIndex: 0,
        explanation: "This module explicitly develops Capstone Project Brief and Requirements as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A capstone concept brief, prototype link or photos, and first-playtest notes.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A capstone concept brief, prototype link or photos, and first-playtest notes.",
      },
    ],
    activity: {
      title: "Start the Capstone",
      steps: [
        "Write a concise design brief and player promise.",
        "Build the smallest prototype that tests your riskiest assumption.",
        "Run a first playtest and capture evidence in the Diary.",
      ],
      deliverable: "A capstone concept brief, prototype link or photos, and first-playtest notes.",
    },
  },
  {
    num: "24", title: "Designing a Game II", partId: 4,
    visualizationKey: "capstone-showcase",
    reflectionPrompt: "Looking back across the entire certificate, what is the most important thing you have learned about yourself as a game designer? What kind of games do you want to make — and what is the first step you will take after completing this program?",
    knowledgeCheck: [
      {
        question: "Which concept is most directly connected to Designing a Game II?",
        options: ["Design Iteration and Prototype Refinement", "Meaningful vs. Illusory Choice", "Inclusive Design Principles"],
        correctIndex: 0,
        explanation: "This module explicitly develops Design Iteration and Prototype Refinement as one of its source-authored topics.",
      },
      {
        question: "What is the best evidence to keep from this module?",
        options: ["A capstone showcase package and a final Game Diary reflection.", "A design decision with no observation or artifact", "A list of unrelated tools without a testable next step"],
        correctIndex: 0,
        explanation: "The source-grounded activity asks learners to keep: A capstone showcase package and a final Game Diary reflection.",
      },
    ],
    activity: {
      title: "Finish the Capstone",
      steps: [
        "Iterate from structured playtest evidence.",
        "Prepare a presentation with concept, prototype, and design rationale.",
        "Publish the process and final reflection as a portfolio-ready Diary entry.",
      ],
      deliverable: "A capstone showcase package and a final Game Diary reflection.",
    },
  },
];

export function getGameDesignInteractionForModule(courseSlug?: string | null, moduleTitle?: string | null) {
  if (courseSlug !== GAME_DESIGN_COURSE_SLUG || !moduleTitle) return null;
  const normalizedTitle = moduleTitle.toLowerCase();
  return GAME_DESIGN_MODULE_INTERACTIONS.find(module => normalizedTitle.includes(module.title.toLowerCase())) ?? null;
}
