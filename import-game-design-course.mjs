import fs from "node:fs";
import mysql from "mysql2/promise";

const curriculum = JSON.parse(
  fs.readFileSync(new URL("./references/game-design-curriculum.json", import.meta.url), "utf8")
);
const COURSE_SLUG = curriculum.course.slug;

function minutes(duration) {
  return Number.parseInt(String(duration).match(/\d+/)?.[0] ?? "0", 10);
}

function resourceIcon(type) {
  return type === "video" ? "video" : type === "tool" ? "tool" : "reading";
}

function moduleContent(module) {
  const objectives = module.objectives.map(objective => `- ${objective}`).join("\n");
  const topics = module.topics.map(topic => `- ${topic}`).join("\n");
  const resources = module.resources
    .map(resource => `- [${resource.label}](${resource.url}) — ${resourceIcon(resource.type)}`)
    .join("\n");
  const steps = module.activity.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
  const part = module.part;

  return `# Module ${module.num}: ${module.title}

## ${part.label} — ${part.title}

${module.overview}

## Learning objectives

${objectives}

## Hands-on activity · ${module.activity.title}

${steps}

### Evidence to keep

${module.activity.deliverable}

## Topics covered

${topics}

## Recommended resources

${resources}

## Reflection prompt

> ${module.reflectionPrompt}

Use the Game Diary to record your response, the evidence you gathered, and the next design question you want to test.

**Estimated time:** ${module.duration}`;
}

const modules = curriculum.modules.map(module => ({
  title: module.title,
  type: "text",
  content: moduleContent(module),
  duration: minutes(module.duration) * 60,
  isPreview: module.num === "01" || module.num === "02",
  assessmentData: null,
}));
const totalDuration = modules.reduce((total, module) => total + Math.round(module.duration / 60), 0);
const description = "A guided studio experience from Dr. Vicki Bealman that moves learners through four parts and 24 modules: game systems, tabletop prototyping, digital practice, and a portfolio-ready capstone. Every source-authored module includes focused readings, objectives, topics, a hands-on design activity, reflection prompt, interactive visualization, and a persistent Game Diary path.";
const shortDescription = "Master game design from rules and player experience to prototyping, playtesting, digital practice, and a portfolio-ready capstone.";
const tags = ["Game Design", "Game Development", "Prototyping", "Playtesting", "Game Engines", "Accessibility", "Game Diary"];

const db = await mysql.createConnection(process.env.DATABASE_URL);
try {
  await db.beginTransaction();
  const [existingRows] = await db.execute("SELECT id, price, comparePrice, isFree, isPublished, isFeatured FROM courses WHERE slug = ? LIMIT 1", [COURSE_SLUG]);
  const existing = existingRows[0];

  if (existing) {
    await db.execute(
      `UPDATE courses SET
        trainerId = 1,
        title = ?,
        description = ?,
        shortDescription = ?,
        category = 'Game Design',
        level = 'advanced',
        language = 'English',
        tags = ?,
        isPublished = 1,
        totalDuration = ?,
        totalModules = ?
       WHERE id = ?`,
      [curriculum.course.title, description, shortDescription, JSON.stringify(tags), totalDuration, modules.length, existing.id]
    );
  } else {
    await db.execute(
      `INSERT INTO courses (
        trainerId, title, slug, description, shortDescription, thumbnailUrl, category, level, language,
        tags, price, comparePrice, isFree, isPublished, isFeatured, totalDuration, totalModules
      ) VALUES (1, ?, ?, ?, ?, ?, 'Game Design', 'advanced', 'English', ?, '297.00', '597.00', 0, 1, 1, ?, ?)`,
      [curriculum.course.title, COURSE_SLUG, description, shortDescription, "/manus-storage/thumb-game-design-fh2DRzasihEdqoEShygcMh.webp", JSON.stringify(tags), totalDuration, modules.length]
    );
  }

  const [[storedCourse]] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [COURSE_SLUG]);
  const courseId = Number(storedCourse.id);
  const [existingModuleRows] = await db.execute("SELECT id, sortOrder FROM modules WHERE courseId = ? ORDER BY sortOrder", [courseId]);
  const existingByOrder = new Map(existingModuleRows.map(row => [Number(row.sortOrder), Number(row.id)]));

  for (const [index, module] of modules.entries()) {
    const sortOrder = index + 1;
    const values = [module.title, module.type, module.content, module.duration, sortOrder, module.isPreview ? 1 : 0, null];
    const existingId = existingByOrder.get(sortOrder);
    if (existingId) {
      await db.execute(
        `UPDATE modules SET title = ?, type = ?, content = ?, duration = ?, sortOrder = ?, isPreview = ?, assessmentData = ? WHERE id = ? AND courseId = ?`,
        [...values, existingId, courseId]
      );
    } else {
      await db.execute(
        `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview, assessmentData) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [courseId, ...values]
      );
    }
  }

  const [[summary]] = await db.execute(
    `SELECT c.id, c.slug, c.title, c.totalModules, c.totalDuration, c.isPublished, c.isFree,
      COUNT(m.id) AS storedModules,
      (SELECT COUNT(*) FROM enrollments WHERE courseId = c.id) AS enrollmentCount,
      (SELECT COUNT(*) FROM module_progress WHERE courseId = c.id) AS progressCount
     FROM courses c LEFT JOIN modules m ON m.courseId = c.id
     WHERE c.id = ? GROUP BY c.id`,
    [courseId]
  );
  if (Number(summary.storedModules) !== modules.length) {
    throw new Error(`Expected ${modules.length} modules but stored ${summary.storedModules}.`);
  }
  await db.commit();
  console.log(JSON.stringify({ ...summary, preservedModuleIds: existingByOrder.size, sourceUrl: curriculum.sourceUrl }, null, 2));
} catch (error) {
  await db.rollback();
  throw error;
} finally {
  await db.end();
}
