import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const curriculumPath = new URL(
  "./references/caio-bootcamp-curriculum.json",
  import.meta.url
);
const curriculum = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));

const course = {
  ...curriculum.course,
  thumbnailUrl: "/manus-storage/caio-bootcamp-guide-cover_ce9615ca.webp",
};

function lessonMarkdown(week, lesson) {
  const outcomes = lesson.outcomes.map(outcome => `- ${outcome}`).join("\n");
  const teaching = lesson.teaching.join("\n\n");
  const steps = lesson.activity.steps
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
  const definitionOfDone = lesson.activity.definitionOfDone
    .map(item => `- ${item}`)
    .join("\n");

  return `# Week ${week.number} · ${lesson.title}

**Week focus:** ${week.title}

**Week outcome:** ${week.outcome}

## Assigned reading

${lesson.reading}

[Open the supplied CAIO guide](${curriculum.source.readingUrl})

> **Reading source:** ${curriculum.source.citation}

## Learning outcomes

${outcomes}

## Core lesson

${teaching}

## Applied example · ${lesson.example.title}

${lesson.example.body}

## Hands-on activity · ${lesson.activity.title}

${lesson.activity.brief}

${steps}

## Definition of done

${definitionOfDone}

## Evidence file

Save this artifact with your name and date. Record assumptions, source information, and any limitations you discovered. Your four-week evidence file becomes the raw material for your capstone and future CAIO conversations.

## Reflection

${lesson.reflection}`;
}

function assessmentModule(week) {
  return {
    title: `Week ${week.number} Knowledge Check · ${week.title}`,
    type: "assessment",
    content: `# Week ${week.number} Knowledge Check

Complete this check after finishing Week ${week.number}: **${week.title}**.

You need a score of 75% to mark the assessment complete. Review the reading, examples, and your saved activity artifacts before submitting.`,
    // Module durations are stored in seconds; course-level duration stays in minutes.
    duration: 30 * 60,
    isPreview: false,
    assessmentData: {
      title: week.assessment.title,
      passingScore: 75,
      questions: week.assessment.questions,
    },
  };
}

const modules = curriculum.weeks.flatMap((week, weekIndex) => [
  ...week.lessons.map((lesson, lessonIndex) => ({
    title: `Week ${week.number} · Lesson ${lessonIndex + 1} · ${lesson.title}`,
    type: "text",
    content: lessonMarkdown(week, lesson),
    duration: lesson.duration * 60,
    isPreview: weekIndex === 0 && lessonIndex < 2,
    assessmentData: null,
  })),
  assessmentModule(week),
]);

// Individual modules store seconds, while the course summary is displayed in minutes.
const totalDuration = course.totalDuration;

const db = await createConnection(process.env.DATABASE_URL);

try {
  await db.beginTransaction();

  const [existingRows] = await db.execute(
    "SELECT id FROM courses WHERE slug = ? ORDER BY id ASC",
    [course.slug]
  );
  if (existingRows.length > 1) {
    throw new Error(
      "CAIO BootCamp import stopped because duplicate course records already exist. Resolve duplicates before rerunning the import."
    );
  }
  const existingCourseId = existingRows[0]?.id;

  if (existingCourseId) {
    const [[usage]] = await db.execute(
      `SELECT
        (SELECT COUNT(*) FROM enrollments WHERE courseId = ?) AS enrollmentCount,
        (SELECT COUNT(*) FROM module_progress WHERE courseId = ?) AS progressCount`,
      [existingCourseId, existingCourseId]
    );
    if (Number(usage.enrollmentCount) > 0 || Number(usage.progressCount) > 0) {
      throw new Error(
        "CAIO BootCamp import stopped to protect existing learner enrollment or progress records."
      );
    }
  }

  const courseValues = [
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
    totalDuration,
    modules.length,
  ];

  if (existingCourseId) {
    await db.execute(
      `UPDATE courses SET
        trainerId = ?, title = ?, slug = ?, description = ?, shortDescription = ?, thumbnailUrl = ?,
        category = ?, level = ?, language = 'English', tags = ?, price = ?, comparePrice = ?,
        isFree = 0, isPublished = 1, isFeatured = 0, totalDuration = ?, totalModules = ?
       WHERE id = ?`,
      [...courseValues, existingCourseId]
    );
  } else {
    await db.execute(
      `INSERT INTO courses (
        trainerId, title, slug, description, shortDescription, thumbnailUrl, category, level, language,
        tags, price, comparePrice, isFree, isPublished, isFeatured, totalDuration, totalModules
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'English', ?, ?, ?, 0, 1, 0, ?, ?)`,
      courseValues
    );
  }

  const courseId =
    existingCourseId ??
    (
      await db.execute(
        "SELECT id FROM courses WHERE slug = ? ORDER BY id ASC LIMIT 1",
        [course.slug]
      )
    )[0][0].id;

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
      ]
    );
  }

  const [[summary]] = await db.execute(
    `SELECT c.id, c.slug, c.title, c.totalModules, c.totalDuration, c.isPublished, c.isFree, c.price,
      COUNT(m.id) AS storedModules
     FROM courses c LEFT JOIN modules m ON m.courseId = c.id
     WHERE c.id = ? GROUP BY c.id`,
    [courseId]
  );
  if (Number(summary.storedModules) !== modules.length) {
    throw new Error(
      `Expected ${modules.length} modules but stored ${summary.storedModules}.`
    );
  }

  await db.commit();
  console.log(
    JSON.stringify(
      {
        ...summary,
        weeks: curriculum.weeks.length,
        lessons: curriculum.weeks.reduce(
          (count, week) => count + week.lessons.length,
          0
        ),
        knowledgeChecks: curriculum.weeks.length,
        capstoneTitle: curriculum.weeks.at(-1)?.lessons.at(-1)?.title,
        reading: curriculum.source.readingUrl,
      },
      null,
      2
    )
  );
} catch (error) {
  await db.rollback();
  throw error;
} finally {
  await db.end();
}
