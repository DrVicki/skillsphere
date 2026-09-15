import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const sourceCache = "/home/ubuntu/course-source-cache";
const dataCenter = JSON.parse(fs.readFileSync(`${sourceCache}/datacenter-full-curriculum.json`, "utf8"));
const chatGptBusiness = JSON.parse(fs.readFileSync(`${sourceCache}/chatgpt-business-full-curriculum.json`, "utf8"));
const pyforge = JSON.parse(fs.readFileSync(`${sourceCache}/pyforge-full-curriculum.json`, "utf8"));

function bySourceOrder(a, b) {
  const [aModule, aLesson] = a.sourceId.match(/m(\d+)-(?:l|q)(\d+)/).slice(1).map(Number);
  const [bModule, bLesson] = b.sourceId.match(/m(\d+)-(?:l|q)(\d+)/).slice(1).map(Number);
  const aKind = a.sourceId.includes("-l") ? 0 : 1;
  const bKind = b.sourceId.includes("-l") ? 0 : 1;
  return aModule - bModule || aLesson - bLesson || aKind - bKind;
}

const curricula = [
  {
    slug: "data-centers-virtual-field-trip",
    modules: [...dataCenter.lessons, ...dataCenter.quizzes].sort(bySourceOrder),
  },
  {
    slug: "python-forge-learn-by-building",
    modules: [...pyforge].sort(bySourceOrder),
  },
  {
    slug: "10-ways-chatgpt-business-owners",
    modules: [...chatGptBusiness.lessons, ...chatGptBusiness.quizzes].sort(bySourceOrder),
  },
];

const db = await createConnection(process.env.DATABASE_URL);

for (const curriculum of curricula) {
  const [courseRows] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [curriculum.slug]);
  if (!courseRows.length) throw new Error(`Course not found: ${curriculum.slug}`);
  const courseId = courseRows[0].id;
  const [moduleRows] = await db.execute("SELECT id FROM modules WHERE courseId = ? ORDER BY sortOrder ASC, id ASC", [courseId]);
  if (moduleRows.length !== curriculum.modules.length) {
    throw new Error(`Module count mismatch for ${curriculum.slug}: expected ${curriculum.modules.length}, found ${moduleRows.length}`);
  }

  for (const [index, sourceModule] of curriculum.modules.entries()) {
    const dbModuleId = moduleRows[index].id;
    await db.execute(
      `UPDATE modules
       SET title = ?, type = ?, content = ?, duration = ?, sortOrder = ?, isPreview = ?, assessmentData = ?
       WHERE id = ?`,
      [
        sourceModule.title,
        sourceModule.type,
        sourceModule.content,
        sourceModule.duration,
        index,
        index < 2 ? 1 : 0,
        sourceModule.assessmentData ? JSON.stringify(sourceModule.assessmentData) : null,
        dbModuleId,
      ],
    );
  }
  console.log(`Restored source lesson content for ${curriculum.slug}: ${curriculum.modules.length} modules`);
}

await db.end();
