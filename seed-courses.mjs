import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const TRAINER_ID = 1; // Dr. Vicki Bealman (admin user id=1)

const COURSES = [
  {
    trainerId: TRAINER_ID,
    title: "AI Literacy for Leaders",
    slug: "ai-literacy-for-leaders",
    description: `The definitive course for executives who need to lead confidently in the age of artificial intelligence — without becoming data scientists.

This five-module program covers everything from demystifying AI fundamentals to building enterprise AI strategy, data governance, ethical leadership, and managing organizational change. Every module translates AI concepts into actionable leadership frameworks you can apply immediately.

Modules:
1. Demystifying AI – Establish a clear, non-technical understanding of what AI is, how it works, and its current capabilities and limitations.
2. Strategic AI Integration – Identify high-impact AI use cases, build a coherent AI roadmap, and transition from isolated experiments to scalable enterprise-wide deployment.
3. Data Strategy & Governance – Understand why data quality is the decisive factor in AI outcomes and establish robust governance frameworks.
4. Ethical AI – Navigate the ethical dilemmas of AI deployment, understand algorithmic bias, and establish accountability frameworks.
5. Leading the AI-Powered Organization – Drive AI adoption, build and retain AI talent, manage organizational change, and position your organization to thrive.`,
    shortDescription: "The definitive executive education program for leaders who need to lead confidently in the age of AI — without becoming data scientists.",
    thumbnailUrl: "https://ailitleaders-j5tktczv.manus.space/og-image.png",
    previewVideoUrl: null,
    category: "Leadership",
    level: "intermediate",
    language: "English",
    tags: JSON.stringify(["AI", "Leadership", "Strategy", "Executive Education", "Data Governance", "Ethics"]),
    price: "497.00",
    comparePrice: "697.00",
    isFree: false,
    isPublished: true,
    isFeatured: true,
    totalDuration: 240,
    totalModules: 5,
    enrollmentCount: 0,
    rating: "4.90",
    ratingCount: 3,
  },
  {
    trainerId: TRAINER_ID,
    title: "AI Fluency for Leaders",
    slug: "ai-fluency-for-leaders",
    description: `The next step for leaders who understand AI. Move beyond literacy to practical mastery — prompt engineering, workflow automation, autonomous agents, and enterprise-scale transformation.

This advanced six-module program builds directly on AI Literacy for Leaders and takes executives from understanding AI to commanding it. Prerequisite: AI Literacy for Leaders.

Modules:
1. Advanced Prompting & AI Interaction – Master the art of communicating with AI. Learn advanced techniques to extract maximum value from large language models for strategic decision-making.
2. Executive Workflow Automation – Transform your daily operations. Integrate AI tools into your personal workflow for data analysis, communication drafting, and complex research.
3. From Copilots to Autonomous Agents – Explore the frontier of AI capabilities. Understand the shift from AI as an assistant to AI as an autonomous agent solving complex business challenges.
4. Building Proprietary AI Solutions – Leverage your unique data advantage. Learn the strategic principles behind fine-tuning models and creating custom internal tools securely.
5. Scaling Enterprise AI Adoption – Bridge the gap between pilot and production. Develop robust frameworks for evaluating vendors and driving widespread user adoption.
6. The Future of AI Strategy – Prepare for what's next. Analyze the trajectory of AI development and build an adaptable organization that thrives in a rapidly evolving landscape.`,
    shortDescription: "Move beyond AI literacy to practical mastery — prompt engineering, workflow automation, autonomous agents, and enterprise-scale transformation.",
    thumbnailUrl: "https://aifluencyle-xvyxa2ad.manus.space/og-image.png",
    previewVideoUrl: null,
    category: "Leadership",
    level: "advanced",
    language: "English",
    tags: JSON.stringify(["AI", "Leadership", "Prompt Engineering", "Automation", "AI Agents", "Executive Education", "Advanced"]),
    price: "697.00",
    comparePrice: "897.00",
    isFree: false,
    isPublished: true,
    isFeatured: true,
    totalDuration: 360,
    totalModules: 6,
    enrollmentCount: 0,
    rating: "5.00",
    ratingCount: 3,
  },
];

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  for (const course of COURSES) {
    // Check if slug already exists
    const [existing] = await conn.execute("SELECT id FROM courses WHERE slug = ?", [course.slug]);
    if (existing.length > 0) {
      console.log(`Course "${course.title}" already exists (id=${existing[0].id}), skipping.`);
      continue;
    }

    const [result] = await conn.execute(
      `INSERT INTO courses (trainerId, title, slug, description, shortDescription, thumbnailUrl, previewVideoUrl,
        category, level, language, tags, price, comparePrice, isFree, isPublished, isFeatured,
        totalDuration, totalModules, enrollmentCount, rating, ratingCount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.trainerId, course.title, course.slug, course.description, course.shortDescription,
        course.thumbnailUrl, course.previewVideoUrl, course.category, course.level, course.language,
        course.tags, course.price, course.comparePrice, course.isFree ? 1 : 0,
        course.isPublished ? 1 : 0, course.isFeatured ? 1 : 0,
        course.totalDuration, course.totalModules, course.enrollmentCount,
        course.rating, course.ratingCount,
      ]
    );
    console.log(`Inserted "${course.title}" with id=${result.insertId}`);
  }

  await conn.end();
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
