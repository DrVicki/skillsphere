import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const sourceCache = "/home/ubuntu/course-source-cache";
const dataCenterSource = JSON.parse(fs.readFileSync(`${sourceCache}/datacenter-curriculum.json`, "utf8"));
const pyforgeLessons = JSON.parse(fs.readFileSync(`${sourceCache}/pyforge-curriculum.json`, "utf8"));

const chatGptTopics = [
  ["Way #1: Content Creation & Marketing", "Create polished first drafts for blog posts, social posts, and newsletters while preserving the expertise, voice, and specific knowledge that make your business distinctive."],
  ["Way #2: Customer Service Automation", "Use ChatGPT to draft useful customer-service responses, organize recurring questions, and create communication templates that reduce repetitive work without removing human judgment."],
  ["Way #3: Brainstorming & Ideation", "Turn a vague starting point into structured options. Use AI to generate angles, names, concepts, and next questions — then evaluate each option against your audience and business goals."],
  ["Way #4: Market Research & Competitor Analysis", "Develop research prompts that help you frame a market question, compare competitors thoughtfully, and identify the evidence you still need before making a decision."],
  ["Way #5: Sales Scripting & Pitching", "Build adaptable sales conversations and pitch outlines that clarify value, address common objections, and give prospects a practical next step."],
  ["Way #6: HR & Recruitment", "Create role descriptions, interview guides, onboarding checklists, and internal communications while keeping final hiring decisions accountable to people."],
  ["Way #7: Business Strategy & Planning", "Use structured prompts to explore goals, assumptions, risks, priorities, and measurable actions for a new initiative or strategic plan."],
  ["Way #8: Data Analysis & Reporting", "Translate a business question into a clear analysis plan, identify useful patterns in available data, and communicate findings in plain language."],
  ["Way #9: Legal & Contract Drafting", "Learn the appropriate role of AI in first-pass plain-language drafting, issue spotting, and questions for qualified legal counsel — not as a substitute for legal advice."],
  ["Way #10: Personal Productivity & Learning", "Build personal systems for planning, prioritizing, learning, and reflection that use AI to reduce friction while leaving the important decisions to you."],
];

function orderByLessonId(a, b) {
  const [aModule, aLesson] = a.id.match(/m(\d+)-(?:l|q)(\d+)/).slice(1).map(Number);
  const [bModule, bLesson] = b.id.match(/m(\d+)-(?:l|q)(\d+)/).slice(1).map(Number);
  return aModule - bModule || aLesson - bLesson || a.id.localeCompare(b.id);
}

const dataCenterModules = [
  ...dataCenterSource.lessons,
  ...dataCenterSource.quizzes,
].sort(orderByLessonId);

const pyforgeModules = pyforgeLessons
  .sort(orderByLessonId)
  .map((lesson) => ({
    title: lesson.title,
    type: "text",
    duration: lesson.duration,
    isPreview: lesson.id.startsWith("m01"),
    content: `# ${lesson.title}\n\n**Focus:** ${lesson.eyebrow}\n\n## Learning objectives\n\n${lesson.objectives.map((objective) => `- ${objective}`).join("\n")}\n\n## Practice prompt\n\nOpen the Python Lab and apply one objective to a small, concrete problem from your own work. Write down what you tried, what surprised you, and one improvement you would make before moving to the next lesson.`,
  }));

const chatGptModules = chatGptTopics.flatMap(([title, summary], index) => [
  {
    title,
    type: "text",
    duration: 6,
    isPreview: index < 2,
    content: `# ${title}\n\n${summary}\n\n## A responsible workflow\n\n1. Start with the real outcome you need, the audience, the context, and any constraints.\n2. Ask ChatGPT for a first pass, examples, or a decision framework — not unquestioned final truth.\n3. Review the result for accuracy, confidential information, bias, and your authentic business voice.\n4. Improve the prompt and document the version you decide to use.\n\n## Try it\n\nWrite a prompt for a real business task in this category. Specify the role, context, tone, desired format, and one quality check you will perform yourself.`,
  },
  {
    title: `Knowledge Check: ${title.replace(/^Way #\d+: /, "")}`,
    type: "text",
    duration: 2,
    isPreview: index < 2,
    content: `# Knowledge Check\n\nReflect on **${title}**. Before using an AI-generated draft in your business, identify:\n\n- One fact you will verify independently.\n- One detail you will personalise for your audience.\n- One decision that must remain with a qualified human professional.\n\nCapture your answers in your notes, then continue to the next business-use case.`,
  },
]);

const coursesToImport = [
  {
    title: "Data Centers: A Virtual Field Trip",
    slug: "data-centers-virtual-field-trip",
    description: "A guided virtual field trip into the physical infrastructure behind cloud computing and AI. Explore the servers, power, cooling, communities, and policy decisions that make digital life possible — and learn how to weigh the trade-offs of responsible data-center development.",
    shortDescription: "Explore the physical infrastructure behind the cloud, AI, power, water, and community decisions.",
    category: "Technology",
    level: "beginner",
    tags: ["Data Centers", "Cloud Computing", "AI Infrastructure", "Sustainability"],
    duration: 85,
    modules: dataCenterModules.map((lesson, index) => ({ ...lesson, isPreview: index < 2 })),
  },
  {
    title: "Python Forge — Learn by Building",
    slug: "python-forge-learn-by-building",
    description: "A project-led Python pathway from your first expression to portfolio-ready work. Build fluency through browser-based coding practice, guided lessons, useful feedback, and practical projects across core Python, automation, web apps, and data science.",
    shortDescription: "Build confident Python skills through 30 guided lessons and practical portfolio projects.",
    category: "Programming",
    level: "beginner",
    tags: ["Python", "Programming", "Automation", "Data Science", "Flask"],
    duration: 2160,
    modules: pyforgeModules,
  },
  {
    title: "10 Ways to Use ChatGPT for Business Owners",
    slug: "10-ways-chatgpt-business-owners",
    description: "A practical, responsible guide to using ChatGPT across ten core business workflows — from content and customer service to strategy, analysis, HR, and productivity. Learn to prompt clearly, review critically, and keep people accountable for important decisions.",
    shortDescription: "Use ChatGPT responsibly across 10 practical business workflows.",
    category: "Business",
    level: "beginner",
    tags: ["ChatGPT", "Business", "AI Literacy", "Productivity", "Marketing"],
    duration: 80,
    modules: chatGptModules,
  },
];

const db = await createConnection(process.env.DATABASE_URL);

for (const course of coursesToImport) {
  const [existingRows] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [course.slug]);
  let courseId;

  if (existingRows.length > 0) {
    courseId = existingRows[0].id;
    console.log(`Skipping existing course: ${course.title} (id ${courseId})`);
    continue;
  }

  const [courseResult] = await db.execute(
    `INSERT INTO courses (
      trainerId, title, slug, description, shortDescription, category, level, language,
      tags, price, isFree, isPublished, isFeatured, totalDuration, totalModules
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'English', ?, 0.00, 1, 1, 0, ?, ?)`,
    [
      1,
      course.title,
      course.slug,
      course.description,
      course.shortDescription,
      course.category,
      course.level,
      JSON.stringify(course.tags),
      course.duration,
      course.modules.length,
    ],
  );
  courseId = courseResult.insertId;

  for (const [sortOrder, module] of course.modules.entries()) {
    await db.execute(
      `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [courseId, module.title, module.type, module.content, module.duration, sortOrder, module.isPreview ? 1 : 0],
    );
  }

  console.log(`Imported ${course.title}: ${course.modules.length} modules (id ${courseId})`);
}

await db.end();
