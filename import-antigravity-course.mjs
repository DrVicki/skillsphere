import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const source = JSON.parse(fs.readFileSync(new URL("./references/antigravity-course-curriculum.json", import.meta.url), "utf8"));
const course = {
  title: "Web Development with Antigravity AI Agent",
  slug: "web-development-with-antigravity-ai-agent",
  description: "A beginner-friendly, hands-on web development course that uses Google Antigravity to generate, review, and refine HTML, CSS, JavaScript, and REST API code. Learners build a theme-switching task list, connect it to live API data, handle errors, and practice POST requests through source-authored activities and embedded coding labs.",
  shortDescription: "Build a real web app with HTML, CSS, JavaScript, REST APIs, and the Antigravity Agent.",
  thumbnailUrl: "/manus-storage/antigravity-color_34e18907.svg",
  category: "Web Development",
  level: "beginner",
  tags: ["Antigravity", "HTML", "CSS", "JavaScript", "REST API", "Web Development"],
  price: "0.00",
  totalDuration: source.modules.reduce((total, module) => total + module.units.reduce((sum, unit) => sum + Number(unit.durationMinutes || 0), 0), 0),
};

function contentFor(module, unit) {
  const action = unit.actionAssignment ? `\n\n## Action Assignment\n\n${unit.actionAssignment}` : "";
  const sourceNote = `\n\n> **Source activity:** Imported from the Antigravity course source for SkillSphere. Use the embedded coding lab below when this lesson includes one.`;
  return `# Module ${module.id === "module-1" ? "1" : "2"}: ${module.title}\n\n## ${unit.title}\n\n${unit.content}${action}${sourceNote}`;
}

const modules = source.modules.flatMap((module, moduleIndex) => module.units.map((unit) => ({
  title: `Module ${moduleIndex + 1} · ${unit.title}`,
  type: unit.type === "assessment" ? "assessment" : "text",
  content: contentFor(module, unit),
  duration: Number(unit.durationMinutes || 0) * 60,
  sortOrder: moduleIndex * 7 + Number(unit.number) - 1,
  isPreview: moduleIndex === 0 && Number(unit.number) <= 2,
  assessmentData: unit.knowledgeCheck ? {
    title: unit.title,
    passingScore: 80,
    questions: unit.knowledgeCheck,
  } : null,
})));

const db = await createConnection(process.env.DATABASE_URL);
try {
  await db.beginTransaction();
  await db.execute(
    `INSERT INTO courses (trainerId, title, slug, description, shortDescription, thumbnailUrl, category, level, language, tags, price, comparePrice, isFree, isPublished, isFeatured, totalDuration, totalModules)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'English', ?, ?, NULL, 1, 1, 0, ?, ?)
     ON DUPLICATE KEY UPDATE trainerId=VALUES(trainerId), title=VALUES(title), description=VALUES(description), shortDescription=VALUES(shortDescription), thumbnailUrl=VALUES(thumbnailUrl), category=VALUES(category), level=VALUES(level), tags=VALUES(tags), price=VALUES(price), isFree=1, isPublished=1, totalDuration=VALUES(totalDuration), totalModules=VALUES(totalModules)`,
    [1, course.title, course.slug, course.description, course.shortDescription, course.thumbnailUrl, course.category, course.level, JSON.stringify(course.tags), course.price, course.totalDuration, modules.length],
  );
  const [[storedCourse]] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [course.slug]);
  const courseId = storedCourse.id;
  const [existingRows] = await db.execute("SELECT id, sortOrder FROM modules WHERE courseId = ? ORDER BY sortOrder ASC, id ASC", [courseId]);
  const existingByOrder = new Map(existingRows.map(row => [Number(row.sortOrder), row]));
  for (const lesson of modules) {
    const existing = existingByOrder.get(lesson.sortOrder);
    if (existing) {
      await db.execute(`UPDATE modules SET title=?, type=?, content=?, duration=?, sortOrder=?, isPreview=?, assessmentData=? WHERE id=?`, [lesson.title, lesson.type, lesson.content, lesson.duration, lesson.sortOrder, lesson.isPreview ? 1 : 0, lesson.assessmentData ? JSON.stringify(lesson.assessmentData) : null, existing.id]);
    } else {
      await db.execute(`INSERT INTO modules (courseId,title,type,content,duration,sortOrder,isPreview,assessmentData) VALUES (?,?,?,?,?,?,?,?)`, [courseId, lesson.title, lesson.type, lesson.content, lesson.duration, lesson.sortOrder, lesson.isPreview ? 1 : 0, lesson.assessmentData ? JSON.stringify(lesson.assessmentData) : null]);
    }
  }
  await db.execute("DELETE FROM modules WHERE courseId = ? AND sortOrder >= ?", [courseId, modules.length]);
  await db.commit();
  console.log(JSON.stringify({ courseId, slug: course.slug, modules: modules.length, assessments: modules.filter(m => m.assessmentData).length, sourceUrl: source.sourceUrl }, null, 2));
} catch (error) {
  await db.rollback();
  throw error;
} finally { await db.end(); }
