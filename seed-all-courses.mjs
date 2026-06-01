import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const TRAINER_ID = 1; // Dr. Vicki Bealman

const COURSES = [
  // ── Already seeded (will be skipped if slug exists) ──────────────────────
  {
    trainerId: TRAINER_ID,
    title: "AI Literacy for Leaders",
    slug: "ai-literacy-for-leaders",
    shortDescription:
      "The definitive executive education program for leaders who need to lead confidently in the age of AI — without becoming data scientists.",
    description: `The definitive course for executives who need to lead confidently in the age of artificial intelligence — without becoming data scientists.

This five-module program covers everything from demystifying AI fundamentals to building enterprise AI strategy, data governance, ethical leadership, and managing organizational change. Every module translates AI concepts into actionable leadership frameworks you can apply immediately.

Modules:
1. Demystifying AI – Establish a clear, non-technical understanding of what AI is, how it works, and its current capabilities and limitations.
2. Strategic AI Integration – Identify high-impact AI use cases, build a coherent AI roadmap, and transition from isolated experiments to scalable enterprise-wide deployment.
3. Data Strategy & Governance – Understand why data quality is the decisive factor in AI outcomes and establish robust governance frameworks.
4. Ethical AI – Navigate the ethical dilemmas of AI deployment, understand algorithmic bias, and establish accountability frameworks.
5. Leading the AI-Powered Organization – Drive AI adoption, build and retain AI talent, manage organizational change, and position your organization to thrive.`,
    category: "Leadership",
    level: "intermediate",
    tags: JSON.stringify(["AI", "Leadership", "Strategy", "Executive Education", "Data Governance", "Ethics"]),
    price: "497.00",
    comparePrice: "697.00",
    isFree: false,
    isPublished: true,
    isFeatured: true,
    totalDuration: 240,
    totalModules: 5,
    totalLessons: 18,
    rating: "4.90",
    ratingCount: 3,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "AI Fluency for Leaders",
    slug: "ai-fluency-for-leaders",
    shortDescription:
      "Move beyond AI literacy to practical mastery — prompt engineering, workflow automation, autonomous agents, and enterprise-scale transformation.",
    description: `The next step for leaders who understand AI. Move beyond literacy to practical mastery — prompt engineering, workflow automation, autonomous agents, and enterprise-scale transformation.

This advanced six-module program builds directly on AI Literacy for Leaders and takes executives from understanding AI to commanding it. Prerequisite: AI Literacy for Leaders.

Modules:
1. Advanced Prompting & AI Interaction – Master the art of communicating with AI. Learn advanced techniques to extract maximum value from large language models for strategic decision-making.
2. Executive Workflow Automation – Transform your daily operations. Integrate AI tools into your personal workflow for data analysis, communication drafting, and complex research.
3. From Copilots to Autonomous Agents – Explore the frontier of AI capabilities. Understand the shift from AI as an assistant to AI as an autonomous agent solving complex business challenges.
4. Building Proprietary AI Solutions – Leverage your unique data advantage. Learn the strategic principles behind fine-tuning models and creating custom internal tools securely.
5. Scaling Enterprise AI Adoption – Bridge the gap between pilot and production. Develop robust frameworks for evaluating vendors and driving widespread user adoption.
6. The Future of AI Strategy – Prepare for what's next. Analyze the trajectory of AI development and build an adaptable organization that thrives in a rapidly evolving landscape.`,
    category: "Leadership",
    level: "advanced",
    tags: JSON.stringify(["AI", "Leadership", "Prompt Engineering", "Automation", "AI Agents", "Executive Education", "Advanced"]),
    price: "697.00",
    comparePrice: "897.00",
    isFree: false,
    isPublished: true,
    isFeatured: true,
    totalDuration: 360,
    totalModules: 6,
    totalLessons: 24,
    rating: "5.00",
    ratingCount: 3,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
  // ── New courses ──────────────────────────────────────────────────────────
  {
    trainerId: TRAINER_ID,
    title: "Amazon: From Garage to Global Empire",
    slug: "amazon-virtual-field-trip",
    shortDescription:
      "An immersive virtual field trip through Amazon's history, business model, logistics network, technology, culture, and innovation — college edition.",
    description: `An immersive virtual field trip through Amazon's rise from a Bellevue garage to the world's largest e-commerce empire. Explore how Amazon built its business model, revolutionized logistics, and became a technology powerhouse — all in one engaging journey.

8 Stops:
1. History – From Jeff Bezos's 1994 garage to the Amazon Spheres, tracing the key milestones that shaped the company.
2. Business Model – The Amazon flywheel: retail, marketplace, AWS, advertising, subscriptions, and physical stores.
3. Logistics – 200+ fulfillment centers, 750,000+ robots, Amazon Air, and Prime Air drone delivery.
4. Technology – AWS cloud computing, Alexa voice AI, cashierless Amazon Go stores, and the $4B Anthropic AI bet.
5. Culture – The 16 Leadership Principles, the 6-page memo culture, two-pizza teams, and Day 1 philosophy.
6. Innovation – Continuous reinvention across every business unit.
7. Quiz – Test your Amazon knowledge.
8. Certificate – Earn your completion certificate.

Key Stats: $717B revenue (2025), 1.58M employees, 200M+ Prime members, 28% cloud market share.`,
    category: "Business",
    level: "beginner",
    tags: JSON.stringify(["Amazon", "Business Model", "E-commerce", "Cloud Computing", "Leadership", "Innovation", "Virtual Field Trip"]),
    price: "97.00",
    comparePrice: "147.00",
    isFree: false,
    isPublished: true,
    isFeatured: false,
    totalDuration: 25,
    totalModules: 8,
    totalLessons: 8,
    rating: "4.80",
    ratingCount: 0,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "Google: Inside the Googleplex",
    slug: "google-virtual-field-trip",
    shortDescription:
      "Step inside the Googleplex — an immersive virtual field trip exploring Google's history, campus, innovation labs, culture, and career paths.",
    description: `Step inside the Googleplex — the campus where billions of people's daily lives are shaped by curiosity, collaboration, and code. This immersive virtual field trip takes you through Google's story from a Stanford dorm room to a global technology empire.

Stops:
1. From a Garage to the World – Stanford beginnings, Backrub search engine, founding, IPO, Gmail, and Alphabet restructure.
2. Explore the Googleplex – Bay View Campus with 50,000 solar panels, campus bikes, and the famous Noogler hat tradition.
3. Where Ideas Become Reality – Google's 20% rule, moonshot thinking (Waymo, Wing, Loon), and key research areas: AI/DeepMind, Search, Hardware, Cloud, Quantum Computing, and Cybersecurity.
4. A Culture Built for Humans – World-class perks, dog-friendly campus, ERGs, sustainability goals, and Google's 10 core principles.
5. Your Future Starts Here – Career paths (Engineering, Business, Marketing, Design, People Ops, Research/AI) and student programs (STEP, SWE Internship, BOLD, APM).
6. Quiz – Test your Google knowledge.

Mission: "Organize the world's information and make it universally accessible and useful."`,
    category: "Technology",
    level: "beginner",
    tags: JSON.stringify(["Google", "Technology", "Career", "Innovation", "Culture", "AI", "Virtual Field Trip"]),
    price: "97.00",
    comparePrice: "147.00",
    isFree: false,
    isPublished: true,
    isFeatured: false,
    totalDuration: 25,
    totalModules: 6,
    totalLessons: 6,
    rating: "4.80",
    ratingCount: 0,
    thumbnailUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/f6b8neio4Hoc9SQ7DiYkDM/bay_view_campus-mE2J7RHo79XykMTYAfYBzw.webp",
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "Figma Code-to-Canvas Workflow Lab",
    slug: "figma-code-to-canvas",
    shortDescription:
      "Learn how AI agents, the Figma MCP server, and purpose-built skills bridge the gap between code and design — with three complete workflows, step-by-step examples, and knowledge checks.",
    description: `Learn how AI agents, the Figma MCP server, and purpose-built skills bridge the gap between code and design. This hands-on workflow lab covers three complete end-to-end workflows with step-by-step examples, knowledge checks, and a completion certificate.

5 Sections / 3 Workflows:
Section 1: Foundations – AI agents, MCP (Model Context Protocol), the Figma MCP server, and Figma Skills.
Section 2: Setup – Connecting the Figma MCP server (Remote vs Desktop) and installing skills.
Workflow 1 (Section 3): Code to Canvas – Use the /prototype-to-figma skill to bring running prototypes into Figma as design frames, review and refine on the canvas, then push changes back to code.
Workflow 2 (Section 4): Design System Sync – Use /figma-generate-design and /figma-generate-library to bring code-based dark/light mode designs and variable tokens into Figma, refine, then sync back to the codebase.
Workflow 3 (Section 5): Canvas Exploration – Use the /figma-use skill to generate alternative design directions directly on the Figma canvas using existing production components, grounded in user research.

Key Skills: /prototype-to-figma, /figma-generate-design, /figma-generate-library, /figma-use.`,
    category: "Design",
    level: "intermediate",
    tags: JSON.stringify(["Figma", "AI Agents", "MCP", "Design Systems", "Workflow", "Code to Design", "UX"]),
    price: "197.00",
    comparePrice: "297.00",
    isFree: false,
    isPublished: true,
    isFeatured: false,
    totalDuration: 60,
    totalModules: 5,
    totalLessons: 5,
    rating: "4.90",
    ratingCount: 0,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "Using AI in Data Analytics",
    slug: "ai-in-data-analytics",
    shortDescription:
      "Master AI-powered analytics — from data cleaning and feature engineering to predictive modeling, NLP, and responsible AI governance.",
    description: `Master AI-powered analytics — from data cleaning and feature engineering to predictive modeling, NLP, and responsible AI governance. This career skills course takes you through the full AI analytics stack with hands-on tools and a capstone project.

5 Modules + Capstone (25 Lessons):
Module 1: Foundations of AI in Data Analytics – Core concepts of AI and how they intersect with modern data analytics workflows. AI fundamentals and the analytics maturity model.
Module 2: Data Preparation & Feature Engineering with AI – AI-assisted techniques for cleaning, transforming, and enriching data at scale. Automated feature engineering with Featuretools.
Module 3: Predictive Analytics & Machine Learning – Build, evaluate, and deploy predictive models. XGBoost/LightGBM, model explainability with SHAP and LIME.
Module 4: NLP & Unstructured Data Analytics – Unlock insights from text, documents, and unstructured data. Sentiment analysis, Text-to-SQL, and LLM-powered analytics.
Module 5: AI Ethics, Governance & the Future – Navigate ethical challenges, bias detection, fairness metrics, and regulatory compliance.
Capstone: Build an AI-powered customer analytics dashboard applying all course concepts (3–5 hours, certificate).`,
    category: "Data Science",
    level: "intermediate",
    tags: JSON.stringify(["AI", "Data Analytics", "Machine Learning", "NLP", "Python", "Data Science", "Ethics"]),
    price: "397.00",
    comparePrice: "597.00",
    isFree: false,
    isPublished: true,
    isFeatured: true,
    totalDuration: 300,
    totalModules: 5,
    totalLessons: 25,
    rating: "4.90",
    ratingCount: 0,
    thumbnailUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/YqEytKwojGaKtCcYDxSSpW/course-hero-6CKUYwq4FgbSBzDwekBmXt.webp",
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "Quantum Computing Escape Room",
    slug: "quantum-computing-escape-room",
    shortDescription:
      "A decoherence cascade has locked the quantum vault. Solve 10 interactive quantum puzzles to restore coherence and escape — earn a Certificate of Quantum Mastery.",
    description: `A decoherence cascade has locked the quantum vault at the Nexus Quantum Research Institute. Your mission: solve 10 interactive quantum puzzles to restore coherence and escape.

This gamified learning experience by Dr. Vicki Bealman tests your quantum computing knowledge through 4 interactive puzzle types:
- Multiple Choice questions
- Drag & Drop quantum gate circuits
- Term Matching challenges
- Step Ordering exercises

Complete all 10 quantum gates in approximately 20 minutes and earn your Certificate of Quantum Mastery. Perfect for students and professionals who want to test and reinforce their quantum computing fundamentals in an engaging, game-based format.`,
    category: "Technology",
    level: "intermediate",
    tags: JSON.stringify(["Quantum Computing", "Gamified Learning", "Escape Room", "Interactive", "Certificate", "STEM"]),
    price: "47.00",
    comparePrice: "97.00",
    isFree: false,
    isPublished: true,
    isFeatured: false,
    totalDuration: 20,
    totalModules: 1,
    totalLessons: 10,
    rating: "4.80",
    ratingCount: 0,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "Quantum Computing for Beginners",
    slug: "quantum-computing-for-beginners",
    shortDescription:
      "Master the principles of quantum mechanics, qubits, quantum gates, and landmark algorithms — from superposition to Shor's algorithm, no physics background required.",
    description: `Master the principles of quantum mechanics, qubits, quantum gates, and landmark algorithms. From superposition to Shor's algorithm — no physics background required.

6 Modules (14 Lessons) + Final Exam + Certificate:
Module 1: Introduction to Quantum Computing – Discover what makes quantum computers fundamentally different from classical computers and why they matter.
Module 2: Core Quantum Phenomena – Master the three core quantum phenomena: superposition, entanglement, and interference.
Module 3: Qubits & Quantum Gates – Learn how qubits are physically realized and how quantum gates manipulate them. Physical implementations and building blocks.
Module 4: Quantum Algorithms – Explore the landmark quantum algorithms that demonstrate quantum advantage: Deutsch-Jozsa, Shor's Algorithm (breaking encryption), and Grover's Algorithm (quantum search).
Module 5: Real Quantum Computers – Explore real quantum computers, error correction, NISQ era, and the path to fault-tolerant quantum computing.
Module 6: Applications & Future – Survey real-world applications of quantum computing and the path forward.

Includes: 14 lessons, interactive visualizations, 15-question final exam, and completion certificate.`,
    category: "Technology",
    level: "beginner",
    tags: JSON.stringify(["Quantum Computing", "Quantum Mechanics", "Qubits", "Algorithms", "STEM", "Beginner", "Certificate"]),
    price: "197.00",
    comparePrice: "297.00",
    isFree: false,
    isPublished: true,
    isFeatured: false,
    totalDuration: 180,
    totalModules: 6,
    totalLessons: 14,
    rating: "4.80",
    ratingCount: 0,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
  {
    trainerId: TRAINER_ID,
    title: "AI in Project Management",
    slug: "ai-in-project-management",
    shortDescription:
      "Become an AI PM and builder with real AI product sense, hands-on tools, and a deployed portfolio — from LLM fundamentals to shipping your capstone.",
    description: `Become an AI PM and builder with real AI product sense, hands-on tools, and a deployed portfolio. From LLM fundamentals to shipping your capstone — this is the complete AI PM curriculum by Dr. Vicki Bealman, EdD.

4 Modules + Capstone (12 Lessons):
Module 1: AI Literacy for PMs (3 lessons) – How LLMs work, failure modes, and technical intuition without engineering background.
Module 2: AI-Powered PM Artifacts (3 lessons) – AI PRDs, system prompts, eval plans, and reusable artifact generators.
Module 3: End-to-End AI Development (3 lessons) – System design, cross-functional teams, and AI in production.
Module 4: AI PM Career & Community (1 lesson) – Portfolio building, LinkedIn positioning, and community access.
Module 5 (Capstone): Ship a Real Product (4 lessons) – Build, launch, and iterate on a real AI product with structured milestones: write a production-ready AI PRD with eval plan, design the complete 7-layer AI system architecture, build and iterate based on real eval results, launch to real users and complete one improvement cycle.

Includes: 12 in-depth lessons, knowledge checks after every lesson, hands-on activities & templates, 4-phase capstone project, progress tracker & notes, certificate upon 100% completion, and AI PM community access.

Instructor: Dr. Vicki Bealman — EdD (Liberty University), MS (Full Sail University, Salutatorian), EdS Educational Leadership, Harvard CS50 Certified, Professor of Software Engineering, Founder of AI Superhuman Agency.`,
    category: "Project Management",
    level: "intermediate",
    tags: JSON.stringify(["AI", "Project Management", "Product Management", "LLM", "AI PM", "Career", "Capstone"]),
    price: "497.00",
    comparePrice: "697.00",
    isFree: false,
    isPublished: true,
    isFeatured: true,
    totalDuration: 360,
    totalModules: 4,
    totalLessons: 12,
    rating: "5.00",
    ratingCount: 0,
    thumbnailUrl: null,
    previewVideoUrl: null,
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  for (const course of COURSES) {
    const [existing] = await conn.execute("SELECT id FROM courses WHERE slug = ?", [course.slug]);
    if (existing.length > 0) {
      console.log(`SKIP  "${course.title}" (slug already exists, id=${existing[0].id})`);
      continue;
    }

    const [result] = await conn.execute(
      `INSERT INTO courses
        (trainerId, title, slug, description, shortDescription, thumbnailUrl, previewVideoUrl,
         category, level, language, tags, price, comparePrice, isFree, isPublished, isFeatured,
         totalDuration, totalModules, enrollmentCount, rating, ratingCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.trainerId, course.title, course.slug,
        course.description, course.shortDescription,
        course.thumbnailUrl ?? null, course.previewVideoUrl ?? null,
        course.category, course.level, "English",
        course.tags, course.price, course.comparePrice ?? null,
        course.isFree ? 1 : 0, course.isPublished ? 1 : 0, course.isFeatured ? 1 : 0,
        course.totalDuration, course.totalModules, 0,
        course.rating, course.ratingCount,
      ]
    );
    console.log(`INSERT "${course.title}" → id=${result.insertId}`);
  }

  await conn.end();
  console.log("\nAll done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
