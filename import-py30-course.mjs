import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const courseSlug = "30-days-to-learn-python";
const source = JSON.parse(fs.readFileSync(new URL("./references/py30-source-content.json", import.meta.url), "utf8"));

function codeBlock(code) {
  return `\n\`\`\`python\n${code}\n\`\`\`\n`;
}
function conceptMarkdown(concept) {
  const notes = (concept.notes ?? []).map(note => `- Line ${note.line}: ${note.label}`).join("\n");
  const steps = (concept.steps ?? []).map((step, index) => `${index + 1}. ${step}`).join("\n");
  return `### Concept sheet ${concept.sheet}: ${concept.title}\n\n**In one sentence:** ${concept.sub}\n\n${concept.plain}\n\n**Worked example:**${codeBlock(concept.code)}\n**Line notes:**\n${notes}\n\n**Expected output:**\n\`\`\`text\n${(concept.out ?? []).join("\n")}\n\`\`\`\n\n**How it works:**\n${steps}`;
}
function lessonContent(day, week) {
  const concepts = day.concepts.map(conceptMarkdown).join("\n\n");
  const flow = day.flow ? `## Visual flow: ${day.flow.title}\n\n${day.flow.steps.map((step, index) => `${index + 1}. **${step.label}** — ${step.caption}`).join("\n")}\n\n${day.flow.caption}` : "";
  const mistake = day.mistake ? `## Common mistake\n\nWrong: ${codeBlock(day.mistake.wrong)}\n**Error:** ${day.mistake.error}\nCorrect: ${codeBlock(day.mistake.correct)}\n${day.mistake.why}` : "";
  const checks = (day.checks ?? []).map((check, index) => `### Check ${index + 1}: ${check.question}\n${check.code ? codeBlock(check.code) : ""}\n${check.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`).join("\n")}\n\n**Answer:** ${String.fromCharCode(65 + check.answer)} — ${check.explain}`).join("\n\n");
  return `# ${day.title}\n\n**Week ${week.number} · ${week.title}**  \n**Concept sheets:** ${day.sheets.join(", ")}  \n**Estimated time:** ${day.time}\n\n## Goal\n\n${day.goal}\n\n## Daily exercise\n\n${day.task}\n\n${concepts}\n\n${flow}\n\n${mistake}\n\n## Tip\n\n${day.tip}\n\n## Embedded coding lab\n\nUse the lab directly below this content to type the starter program, run it, change one thing, and run it again. Save the working code before leaving the lesson.\n\n**Lab hint:** ${day.lab.hint}\n\n## Reflection\n\n${day.reflection}\n\n## Knowledge checks\n\n${checks}\n\n## Recap\n\n${day.recap.map(item => `- ${item}`).join("\n")}\n\n**Source lesson:** ${source.source}day/${day.day}`;
}
function reviewContent(day, week) {
  return `# ${day.title}\n\n**Week ${week.number} · ${week.title}**  \n**Weekly project:** ${week.project}\n\n## Build brief\n\n${day.brief}\n\n## Requirements\n\n${day.requirements.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\n## Starter code\n${codeBlock(day.starter)}\n## Sample input\n${codeBlock(day.input ?? "Run the program with representative inputs.")}\n## Embedded coding lab\n\nComplete the review build in the browser lab. Run the happy path, then test an invalid or boundary input. Save and download your final Python file.\n\n## Stretch goals\n\n${day.stretch.map(item => `- ${item}`).join("\n")}\n\n## Review checklist\n\n${day.checklist.map(item => `- ${item}`).join("\n")}\n\n## Reflection\n\n${day.reflection}\n\n**Source build:** ${source.source}day/${day.day}`;
}

const modules = source.days.map(day => {
  const week = source.weeks.find(item => item.number === day.week);
  return {
    title: `Week ${week.number} | ${day.title}`,
    type: "text",
    duration: day.kind === "review" ? 55 : 38,
    content: day.kind === "review" ? reviewContent(day, week) : lessonContent(day, week),
    isPreview: day.day === 1,
    sortOrder: day.day - 1,
  };
});

const db = await createConnection(process.env.DATABASE_URL);
try {
  const [existingCourses] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [courseSlug]);
  let courseId;
  if (existingCourses.length) {
    courseId = existingCourses[0].id;
  } else {
    const [result] = await db.execute(
      `INSERT INTO courses (trainerId, title, slug, description, shortDescription, category, level, language, tags, price, isFree, isPublished, isFeatured, totalDuration, totalModules)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'English', ?, 0.00, 1, 1, 0, ?, ?)`,
      [1, source.title, courseSlug, "A focused 30-day Python course that moves from print() and variables to a persistent To-Do CLI. Every day combines concept sheets, typed examples, a small exercise, and a browser coding lab.", "30 days, 100 concept sheets, 5 weekly builds, and a runnable Python lab every day.", "Programming", "beginner", JSON.stringify(["Python", "Programming", "Coding Labs", "Data Structures", "Functions", "Files", "Classes", "Standard Library"]), modules.reduce((sum, item) => sum + item.duration, 0), modules.length]
    );
    courseId = result.insertId;
  }
  const [existingModules] = await db.execute("SELECT id, title FROM modules WHERE courseId = ?", [courseId]);
  const byTitle = new Map(existingModules.map(row => [row.title, row]));
  for (const module of modules) {
    const existing = byTitle.get(module.title);
    if (existing) {
      await db.execute(`UPDATE modules SET type = 'text', content = ?, duration = ?, sortOrder = ?, isPreview = ?, videoUrl = NULL, videoKey = NULL, assessmentData = NULL WHERE id = ?`, [module.content, module.duration, module.sortOrder, module.isPreview ? 1 : 0, existing.id]);
    } else {
      await db.execute(`INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview) VALUES (?, ?, 'text', ?, ?, ?, ?)`, [courseId, module.title, module.content, module.duration, module.sortOrder, module.isPreview ? 1 : 0]);
    }
  }
  await db.execute(`UPDATE courses SET title = ?, description = ?, shortDescription = ?, category = ?, level = ?, tags = ?, price = 0.00, isFree = 1, isPublished = 1, totalDuration = ?, totalModules = ? WHERE id = ?`, [source.title, "A focused 30-day Python course that moves from print() and variables to a persistent To-Do CLI. Every day combines concept sheets, typed examples, a small exercise, and a browser coding lab.", "30 days, 100 concept sheets, 5 weekly builds, and a runnable Python lab every day.", "Programming", "beginner", JSON.stringify(["Python", "Programming", "Coding Labs", "Data Structures", "Functions", "Files", "Classes", "Standard Library"]), modules.reduce((sum, item) => sum + item.duration, 0), modules.length, courseId]);
  console.log(JSON.stringify({ courseId, courseSlug, weeks: source.weeks.length, days: source.days.length, concepts: source.days.reduce((sum, day) => sum + (day.concepts?.length ?? 0), 0), modules: modules.length }, null, 2));
} finally {
  await db.end();
}
