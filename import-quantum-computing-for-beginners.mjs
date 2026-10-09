import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const curriculumPath = new URL("./references/quantum-computing-for-beginners-curriculum.json", import.meta.url);
const examPath = new URL("./references/quantum-computing-for-beginners-final-exam.json", import.meta.url);
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));
const finalExamQuestions = JSON.parse(fs.readFileSync(examPath, "utf8"));

const course = {
  title: "Quantum Computing for Beginners",
  slug: "quantum-computing-for-beginners-1791574031102",
  description: "Master the essential ideas of quantum computing without requiring a physics background. This self-paced four-week beginner pathway uses 14 source-authored lessons, reflection-based knowledge checks, interactive visualizations, and a 15-question final exam to build practical understanding of superposition, entanglement, quantum gates, landmark algorithms, error correction, and emerging applications. Complete the curriculum and pass the final exam at 70% or higher to earn a SkillSphere certificate.",
  shortDescription: "Explore qubits, quantum mechanics, gates, algorithms, hardware, and real-world applications through 14 beginner-friendly lessons and a final exam.",
  thumbnailUrl: "/manus-storage/quantum-computing-for-beginners-hero_62afc393.webp",
  category: "Technology",
  level: "beginner",
  tags: ["Quantum Computing", "Quantum Mechanics", "Qubits", "Quantum Algorithms", "Emerging Technology"],
  totalDuration: 125,
};

function minutes(duration) {
  const value = Number.parseInt(String(duration).match(/\d+/)?.[0] ?? "0", 10);
  return Number.isFinite(value) ? value : 0;
}

function createReflectionPrompt(lesson) {
  const checks = lesson.quiz ?? [];
  if (!checks.length) return "";

  const prompts = checks.map((check, index) => {
    const correctAnswer = check.options?.[check.correctIndex] ?? "the source answer";
    return `${index + 1}. **${check.question}**\n\n   In your own words, explain why **${correctAnswer}** is the best answer and name one idea from this lesson that supports your explanation.`;
  });

  return `\n\n## Knowledge Check — Reflect & Apply\n\n${prompts.join("\n\n")}\n\nCapture your responses in your notes before continuing.`;
}

const lessons = curriculum.modules.flatMap((module) =>
  module.lessons.map((lesson) => ({
    title: `Module ${module.number} · ${lesson.title}`,
    type: "text",
    content: `**Module ${module.number}: ${module.title} · ${lesson.duration}**\n\n${lesson.content}${createReflectionPrompt(lesson)}`,
    duration: minutes(lesson.duration) * 60,
    isPreview: module.number === 1,
  })),
);

const modules = [
  ...lessons,
  {
    title: "Final Exam · Quantum Computing for Beginners",
    type: "assessment",
    content: "# Final Exam\n\nComplete this 15-question assessment after finishing all 14 lessons. A score of **70% or higher** confirms course completion and unlocks your certificate.",
    duration: 20 * 60,
    isPreview: false,
    assessmentData: {
      title: "Final Exam · Quantum Computing for Beginners",
      passingScore: 70,
      questions: finalExamQuestions,
    },
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
      throw new Error("Quantum course import stopped to protect existing learner enrollment or progress records.");
    }
  }

  await db.execute(
    `INSERT INTO courses (
      trainerId, title, slug, description, shortDescription, thumbnailUrl, category, level, language,
      tags, price, isFree, isPublished, isFeatured, totalDuration, totalModules
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'English', ?, 0.00, 1, 1, 0, ?, ?)
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
      course.totalDuration,
      modules.length,
    ],
  );

  const [[storedCourse]] = await db.execute("SELECT id FROM courses WHERE slug = ? LIMIT 1", [course.slug]);
  const courseId = storedCourse.id;

  await db.execute(
    `UPDATE courses SET
      trainerId = ?, title = ?, description = ?, shortDescription = ?, thumbnailUrl = ?, category = ?, level = ?,
      language = 'English', tags = ?, price = 0.00, isFree = 1, isPublished = 1, isFeatured = 0,
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
    `SELECT c.id, c.slug, c.title, c.totalModules, c.totalDuration, c.isPublished, c.isFree, COUNT(m.id) AS storedModules
     FROM courses c LEFT JOIN modules m ON m.courseId = c.id
     WHERE c.id = ? GROUP BY c.id`,
    [courseId],
  );
  if (Number(summary.storedModules) !== modules.length) {
    throw new Error(`Expected ${modules.length} modules but stored ${summary.storedModules}.`);
  }

  await db.commit();
  console.log(JSON.stringify({ ...summary, sourceLessons: lessons.length, finalExamQuestions: finalExamQuestions.length }, null, 2));
} catch (error) {
  await db.rollback();
  throw error;
} finally {
  await db.end();
}
