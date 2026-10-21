import fs from "node:fs";
import { createConnection } from "mysql2/promise";

const courseSlug = "python-forge-learn-by-building";
const sourcePath = new URL(
  "./references/pyforge-source-content.json",
  import.meta.url
);
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

function lessonMarkdown(lesson) {
  const explanation = lesson.explanation
    .map(({ heading, body }) => `## ${heading}\n\n${body}`)
    .join("\n\n");
  const activitySteps = lesson.activity.steps
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
  const successCriteria = lesson.activity.successCriteria
    .map(criterion => `- ${criterion}`)
    .join("\n");
  const hints = lesson.hints.map(hint => `- ${hint}`).join("\n");

  return `# ${lesson.title}

**${lesson.module.phase} · Module ${lesson.module.number} · ${lesson.eyebrow}**

## What you'll be able to do

${lesson.objectives.map(objective => `- ${objective}`).join("\n")}

${explanation}

## Worked example

\`\`\`python
${lesson.exampleCode}
\`\`\`

## Expected output

\`\`\`
${lesson.expectedOutput}
\`\`\`

## Hands-on activity: ${lesson.activity.title}

${lesson.activity.brief}

${activitySteps}

## Definition of done

${successCriteria}

## Static hints

${hints}

## Reflection

${lesson.reflectionPrompt}

## Knowledge check

${lesson.quiz.question}

${lesson.quiz.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n")}

> The interactive Python lab, hints, definition of done, reflection, and knowledge check appear directly below this lesson.`;
}

function projectMarkdown(project) {
  const rubric = project.rubric
    .map(({ criterion, description }) => `- **${criterion}:** ${description}`)
    .join("\n");
  return `# Portfolio Project ${String(project.number).padStart(2, "0")} · ${project.title}

**${project.module.phase} · ${project.bonus ? "Bonus portfolio project" : `Module ${project.module.number} portfolio project`}**

## Brief

${project.brief}

## Scenario

${project.scenario}

## Build requirements

${project.requirements.map(requirement => `- ${requirement}`).join("\n")}

## Starter code

\`\`\`python
${project.starterCode}
\`\`\`

## Definition of done

${project.successCriteria.map(criterion => `- ${criterion}`).join("\n")}

## Rubric

${rubric}

## Stretch goals

${project.stretch.map(goal => `- ${goal}`).join("\n")}

## Reflection prompts

${project.reflection.map(prompt => `- ${prompt}`).join("\n")}

> Use the interactive Python lab below to build, test, save, and download your project.`;
}

const db = await createConnection(process.env.DATABASE_URL);

try {
  const [courseRows] = await db.execute(
    "SELECT id FROM courses WHERE slug = ? LIMIT 1",
    [courseSlug]
  );
  if (!courseRows.length)
    throw new Error(`Python Forge course '${courseSlug}' was not found`);
  const courseId = courseRows[0].id;

  const [existingRows] = await db.execute(
    "SELECT id, title FROM modules WHERE courseId = ?",
    [courseId]
  );
  const existingByTitle = new Map(existingRows.map(row => [row.title, row]));
  const curriculum = [
    ...source.lessons.map((lesson, index) => ({
      title: lesson.title,
      duration: lesson.duration,
      content: lessonMarkdown(lesson),
      isPreview: index < 2,
      sortOrder: index,
    })),
    ...source.projects.map((project, index) => ({
      title: `Portfolio Project ${String(project.number).padStart(2, "0")} · ${project.title}`,
      duration: 90,
      content: projectMarkdown(project),
      isPreview: false,
      sortOrder: source.lessons.length + index,
    })),
  ];

  for (const module of curriculum) {
    const existing = existingByTitle.get(module.title);
    if (existing) {
      await db.execute(
        `UPDATE modules
         SET type = 'text', content = ?, videoUrl = NULL, videoKey = NULL, duration = ?, sortOrder = ?, isPreview = ?, assessmentData = NULL
         WHERE id = ?`,
        [
          module.content,
          module.duration,
          module.sortOrder,
          module.isPreview ? 1 : 0,
          existing.id,
        ]
      );
    } else {
      await db.execute(
        `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview)
         VALUES (?, ?, 'text', ?, ?, ?, ?)`,
        [
          courseId,
          module.title,
          module.content,
          module.duration,
          module.sortOrder,
          module.isPreview ? 1 : 0,
        ]
      );
    }
  }

  await db.execute(
    `UPDATE courses
     SET title = ?, description = ?, shortDescription = ?, category = ?, level = ?, tags = ?, totalModules = ?, totalDuration = ?, isPublished = 1
     WHERE id = ?`,
    [
      "Python Forge — Learn by Building",
      "A deliberate, project-led Python path from first expressions to portfolio-ready work. Learn through 30 guided lessons, 12 portfolio briefs, source-authored explanations and activities, browser-based coding labs, code downloads, knowledge checks, and practical projects spanning Python fundamentals, automation, Flask, and data science.",
      "30 guided Python lessons, 12 portfolio projects, and an embedded browser coding lab.",
      "Programming",
      "beginner",
      JSON.stringify([
        "Python",
        "Programming",
        "Browser Coding Lab",
        "Automation",
        "Data Science",
        "Flask",
        "Portfolio Projects",
      ]),
      curriculum.length,
      2160,
      courseId,
    ]
  );

  const [summaryRows] = await db.execute(
    "SELECT id, title, sortOrder, duration, isPreview FROM modules WHERE courseId = ? ORDER BY sortOrder, id",
    [courseId]
  );
  console.log(
    JSON.stringify(
      {
        courseId,
        courseSlug,
        lessonCount: source.lessons.length,
        projectCount: source.projects.length,
        totalModules: summaryRows.length,
        first: summaryRows[0],
        last: summaryRows.at(-1),
      },
      null,
      2
    )
  );
} finally {
  await db.end();
}
