import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const curriculumPath = new URL("./references/cube-unlocked-curriculum.json", import.meta.url);
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
const thumbnailUrl = "/manus-storage/cube-unlocked-hero_d9a24cc9.jpg";

function lessonContent(lesson) {
  const sourceSections = lesson.sections
    .map((section) => `## ${section.title}\n\n${section.body}`)
    .join("\n\n");

  const guidedMoves = lesson.moves?.length
    ? `\n\n## Guided move cards\n\n${lesson.moves
        .map((move) => `- **${move.sequence} — ${move.label}:** ${move.note}`)
        .join("\n")}`
    : "";

  const practice = lesson.practice?.length
    ? `\n\n## Practice\n\n${lesson.practice.map((item, index) => `${index + 1}. ${item}`).join("\n")}`
    : "";

  return `# ${lesson.title}\n\n**${lesson.module} · ${lesson.kicker} · ${lesson.minutes} minutes**\n\n## Learning objective\n\n${lesson.objective}\n\n${sourceSections}${guidedMoves}${practice}\n\n## Knowledge check · reflect before continuing\n\n${lesson.reflection}\n\nWrite a short answer in your course notes, then complete this lesson when you can explain the idea in your own words.\n\n---\n\n*Source credit: Cube, Unlocked — an original learning adaptation by Dr. Vicki Bealman of Philo Li’s commutator-first Rubik’s Cube method. The original interactive 3D cube and instructional GIFs are credited to Philo Li.*`;
}

const course = {
  title: "Cube, Unlocked — A Visual Rubik's Cube Course",
  slug: "cube-unlocked-visual-rubiks-cube-course",
  description:
    "A visual, commutator-first micro-course for solving a 3×3 Rubik’s Cube with understanding instead of rote memorization. Learn the fixed color frame, cube notation, open–act–close–restore logic, Roux-style side blocks, top corners, and the last six edges through seven guided practice lessons.",
  shortDescription:
    "Solve a 3×3 cube with visual, commutator-first logic—not rote memorization.",
  category: "Puzzles & Problem Solving",
  level: "beginner",
  tags: ["Rubik's Cube", "3×3 Cube", "Roux Method", "Commutators", "Spatial Reasoning", "Problem Solving"],
  totalDuration: curriculum.reduce((sum, lesson) => sum + lesson.minutes, 0),
  modules: curriculum.map((lesson, index) => ({
    title: `${lesson.number} · ${lesson.title}`,
    type: "text",
    content: lessonContent(lesson),
    duration: lesson.minutes * 60,
    sortOrder: index,
    isPreview: index < 2,
  })),
};

const db = await createConnection(process.env.DATABASE_URL);

async function getCourseActivity(courseId) {
  const [rows] = await db.execute(
    `SELECT
      (SELECT COUNT(*) FROM enrollments WHERE courseId = ?) AS enrollments,
      (SELECT COUNT(*) FROM module_progress WHERE courseId = ?) AS progress,
      (SELECT COUNT(*) FROM payments WHERE courseId = ?) AS payments`,
    [courseId, courseId, courseId],
  );
  return rows[0];
}

function hasCourseActivity(activity) {
  return Number(activity.enrollments) > 0 || Number(activity.progress) > 0 || Number(activity.payments) > 0;
}

async function insertModules(courseId) {
  for (const module of course.modules) {
    await db.execute(
      `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        courseId,
        module.title,
        module.type,
        module.content,
        module.duration,
        module.sortOrder,
        module.isPreview ? 1 : 0,
      ],
    );
  }
}

try {
  const [sourceRows] = await db.execute(
    "SELECT id FROM courses WHERE slug = ? LIMIT 1",
    [course.slug],
  );
  const [legacyRows] = await db.execute(
    "SELECT id FROM courses WHERE title = ? LIMIT 1",
    ["Cube Unlocked: Solve Rubik's Cube"],
  );

  if (legacyRows.length > 0) {
    const legacyId = legacyRows[0].id;
    const legacyActivity = await getCourseActivity(legacyId);
    if (hasCourseActivity(legacyActivity)) {
      throw new Error(`Cannot consolidate the existing Cube course because it has learner or payment activity: ${JSON.stringify(legacyActivity)}`);
    }

    if (sourceRows.length > 0 && sourceRows[0].id !== legacyId) {
      const duplicateId = sourceRows[0].id;
      const duplicateActivity = await getCourseActivity(duplicateId);
      if (hasCourseActivity(duplicateActivity)) {
        throw new Error(`Cannot remove the duplicate Cube course because it has learner or payment activity: ${JSON.stringify(duplicateActivity)}`);
      }
      await db.beginTransaction();
      try {
        await db.execute("DELETE FROM modules WHERE courseId = ?", [duplicateId]);
        await db.execute("DELETE FROM courses WHERE id = ?", [duplicateId]);
        await db.commit();
      } catch (error) {
        await db.rollback();
        throw error;
      }
    }

    await db.beginTransaction();
    try {
      await db.execute("DELETE FROM modules WHERE courseId = ?", [legacyId]);
      await db.execute(
        `UPDATE courses SET
          title = ?, slug = ?, description = ?, shortDescription = ?, thumbnailUrl = ?,
          category = ?, level = ?, language = 'English', tags = ?, isPublished = 1,
          isFeatured = 0, totalDuration = ?, totalModules = ?
        WHERE id = ?`,
        [
          course.title,
          course.slug,
          course.description,
          course.shortDescription,
          thumbnailUrl,
          course.category,
          course.level,
          JSON.stringify(course.tags),
          course.totalDuration,
          course.modules.length,
          legacyId,
        ],
      );
      await insertModules(legacyId);
      await db.commit();
    } catch (error) {
      await db.rollback();
      throw error;
    }

    console.log(`Consolidated ${course.title} into the existing course listing (id ${legacyId}); preserved its existing price.`);
  } else if (sourceRows.length > 0) {
    const courseId = sourceRows[0].id;
    const activity = await getCourseActivity(courseId);
    if (hasCourseActivity(activity)) {
      throw new Error(`Cannot refresh the Cube course because it has learner or payment activity: ${JSON.stringify(activity)}`);
    }

    await db.beginTransaction();
    try {
      await db.execute("DELETE FROM modules WHERE courseId = ?", [courseId]);
      await db.execute(
        `UPDATE courses SET
          description = ?, shortDescription = ?, thumbnailUrl = ?, category = ?, level = ?,
          language = 'English', tags = ?, isPublished = 1, isFeatured = 0,
          totalDuration = ?, totalModules = ?
        WHERE id = ?`,
        [
          course.description,
          course.shortDescription,
          thumbnailUrl,
          course.category,
          course.level,
          JSON.stringify(course.tags),
          course.totalDuration,
          course.modules.length,
          courseId,
        ],
      );
      await insertModules(courseId);
      await db.commit();
    } catch (error) {
      await db.rollback();
      throw error;
    }
    console.log(`Refreshed ${course.title}: ${course.modules.length} source lessons (id ${courseId})`);
  } else {
    const [courseResult] = await db.execute(
      `INSERT INTO courses (
        trainerId, title, slug, description, shortDescription, thumbnailUrl, category, level, language,
        tags, price, isFree, isPublished, isFeatured, totalDuration, totalModules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'English', ?, 0.00, 1, 1, 0, ?, ?)`,
      [
        1,
        course.title,
        course.slug,
        course.description,
        course.shortDescription,
        thumbnailUrl,
        course.category,
        course.level,
        JSON.stringify(course.tags),
        course.totalDuration,
        course.modules.length,
      ],
    );

    const courseId = courseResult.insertId;
    await insertModules(courseId);

    console.log(`Imported ${course.title}: ${course.modules.length} source lessons (id ${courseId})`);
  }
} finally {
  await db.end();
}
