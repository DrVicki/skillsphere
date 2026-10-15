import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const curriculumPath = new URL("./references/ai-data-analytics-curriculum.json", import.meta.url);
const capstonePath = new URL("./references/ai-data-analytics-capstone.json", import.meta.url);
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
const capstone = JSON.parse(fs.readFileSync(capstonePath, "utf8"));

const course = {
  title: "Using AI in Data Analytics",
  slug: "ai-in-data-analytics",
  description: "A four-week intermediate, hands-on course for analysts who want to apply AI across the modern analytics workflow. The complete source curriculum includes 25 lessons across five modules, five seven-question knowledge checks, interactive workflow visualizations, and a six-step customer analytics capstone. Learners practice AI-assisted data preparation, feature engineering, predictive modeling, explainable AI, NLP, responsible AI governance, and stakeholder-ready reporting. Complete all lessons and pass the knowledge checks to earn a SkillSphere certificate.",
  shortDescription: "Master AI-powered analytics—from data cleaning and feature engineering to predictive modeling, NLP, and responsible AI governance.",
  thumbnailUrl: "/manus-storage/ai-data-analytics-hero_a7cd25e8.webp",
  category: "Data Science",
  level: "intermediate",
  tags: ["AI", "Data Analytics", "Machine Learning", "NLP", "Python", "Data Science", "Responsible AI"],
  price: "297.00",
  comparePrice: "597.00",
  totalDuration: 435,
};

function minutes(duration) {
  const value = Number.parseInt(String(duration).match(/\d+/)?.[0] ?? "0", 10);
  return Number.isFinite(value) ? value : 0;
}

function lessonContent(module, lesson) {
  const label = lesson.type === "example" ? "Applied Example" : lesson.type === "case-study" ? "Case Study" : "Lesson";
  return `**Module ${module.number}: ${module.title} · ${label} · ${lesson.duration}**\n\n${lesson.content}`;
}

function capstoneContent(project) {
  const objectives = project.objectives.map((objective) => `- ${objective}`).join("\n");
  const tools = project.tools.map((tool) => `- ${tool}`).join("\n");
  const steps = project.steps.map((step) => {
    const tasks = step.tasks.map((task) => `- ${task}`).join("\n");
    const dataGenerator = step.dataGeneratorScript ? `\n\n### Source dataset generator\n\n\`\`\`python\n${step.dataGeneratorScript}\n\`\`\`` : "";
    return `## Step ${step.stepNumber}: ${step.title}\n\n${step.description}\n\n### Tasks\n\n${tasks}${dataGenerator}\n\n### Starter code\n\n\`\`\`python\n${step.codeSnippet}\n\`\`\`\n\n### Deliverable\n\n${step.deliverable}\n\n> **Source guidance:** ${step.hint}`;
  }).join("\n\n---\n\n");

  return `# ${project.title}\n\n**${project.subtitle}**\n\n${project.overview}\n\n## Objectives\n\n${objectives}\n\n## Suggested tools\n\n${tools}\n\n**Estimated time:** ${project.estimatedTime}\n\n---\n\n${steps}`;
}

const sourceLessons = curriculum.modules.flatMap((module) => module.lessons.map((lesson) => ({
  title: `Module ${module.number} · ${lesson.title}`,
  type: lesson.type === "quiz" ? "assessment" : "text",
  content: lessonContent(module, lesson),
  duration: minutes(lesson.duration) * 60,
  isPreview: lesson.id === "m1-l1" || lesson.id === "m1-l2",
  assessmentData: lesson.type === "quiz" ? {
    title: lesson.title,
    passingScore: 75,
    questions: lesson.questions,
  } : null,
})));

const modules = [
  ...sourceLessons,
  {
    title: `Capstone · ${capstone.title}`,
    type: "text",
    content: capstoneContent(capstone),
    duration: 240 * 60,
    isPreview: false,
    assessmentData: null,
  },
];

const db = await createConnection(process.env.DATABASE_URL);

try {
  await db.beginTransaction();

  const [existingRows] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [course.slug]);
  const existingCourseId = existingRows[0]?.id;
  if (existingCourseId) {
    const [[usage]] = await db.execute(
      `SELECT
        (SELECT COUNT(*) FROM enrollments WHERE courseId = ?) AS enrollmentCount,
        (SELECT COUNT(*) FROM module_progress WHERE courseId = ?) AS progressCount`,
      [existingCourseId, existingCourseId],
    );
    if (Number(usage.enrollmentCount) > 0 || Number(usage.progressCount) > 0) {
      throw new Error("AI data analytics import stopped to protect existing learner enrollment or progress records.");
    }
  }

  await db.execute(
    `INSERT INTO courses (
      trainerId, title, slug, description, shortDescription, thumbnailUrl, category, level, language,
      tags, price, comparePrice, isFree, isPublished, isFeatured, totalDuration, totalModules
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'English', ?, ?, ?, 0, 1, 1, ?, ?)
    ON DUPLICATE KEY UPDATE
      trainerId = VALUES(trainerId),
      title = VALUES(title),
      description = VALUES(description),
      shortDescription = VALUES(shortDescription),
      thumbnailUrl = VALUES(thumbnailUrl),
      category = VALUES(category),
      level = VALUES(level),
      language = VALUES(language),
      tags = VALUES(tags),
      price = VALUES(price),
      comparePrice = VALUES(comparePrice),
      isFree = VALUES(isFree),
      isPublished = VALUES(isPublished),
      isFeatured = VALUES(isFeatured),
      totalDuration = VALUES(totalDuration),
      totalModules = VALUES(totalModules)`,
    [
      1,
      course.title,
      course.slug,
      course.description,
      course.shortDescription,
      course.thumbnailUrl,
      course.category,
      course.level,
      JSON.stringify(course.tags),
      course.price,
      course.comparePrice,
      course.totalDuration,
      modules.length,
    ],
  );

  const [[storedCourse]] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [course.slug]);
  const courseId = storedCourse.id;

  await db.execute(
    `UPDATE courses SET
      trainerId = ?, title = ?, description = ?, shortDescription = ?, thumbnailUrl = ?, category = ?, level = ?,
      language = 'English', tags = ?, price = ?, comparePrice = ?, isFree = 0, isPublished = 1, isFeatured = 1,
      totalDuration = ?, totalModules = ?
     WHERE id = ?`,
    [
      1,
      course.title,
      course.description,
      course.shortDescription,
      course.thumbnailUrl,
      course.category,
      course.level,
      JSON.stringify(course.tags),
      course.price,
      course.comparePrice,
      course.totalDuration,
      modules.length,
      courseId,
    ],
  );

  await db.execute("DELETE FROM modules WHERE courseId = ?", [courseId]);
  for (const [sortOrder, module] of modules.entries()) {
    await db.execute(
      `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview, assessmentData)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        courseId,
        module.title,
        module.type,
        module.content,
        module.duration,
        sortOrder,
        module.isPreview ? 1 : 0,
        module.assessmentData ? JSON.stringify(module.assessmentData) : null,
      ],
    );
  }

  const [[summary]] = await db.execute(
    `SELECT c.id, c.slug, c.title, c.totalModules, c.totalDuration, c.isPublished, c.isFree, c.price, COUNT(m.id) AS storedModules
     FROM courses c LEFT JOIN modules m ON m.courseId = c.id
     WHERE c.id = ? GROUP BY c.id`,
    [courseId],
  );
  if (Number(summary.storedModules) !== modules.length) {
    throw new Error(`Expected ${modules.length} modules but stored ${summary.storedModules}.`);
  }

  await db.commit();
  console.log(JSON.stringify({
    ...summary,
    sourceLessons: sourceLessons.length,
    knowledgeChecks: sourceLessons.filter((module) => module.type === "assessment").length,
    knowledgeCheckQuestions: sourceLessons.reduce((count, module) => count + (module.assessmentData?.questions?.length ?? 0), 0),
    capstoneSteps: capstone.steps.length,
  }, null, 2));
} catch (error) {
  await db.rollback();
  throw error;
} finally {
  await db.end();
}
