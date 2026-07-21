import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const db = await createConnection(process.env.DATABASE_URL);

const overviewContent = `# MAGICA / THE OVERVIEW

---

## 🚨 Stop juggling 10 different AI tools.

**Magica is the only autonomous AI super agent you need.**

Use Magica like a **working studio** — one intelligent workspace where every task, project, research session, and creative workflow lives together.

---

## What Makes Magica Different?

Most people bounce between ChatGPT for writing, another tool for research, a third for images, and a fourth for automation. Every switch costs time, context, and energy.

Magica eliminates that friction. It is a single autonomous super agent that:

- **Thinks** — understands complex, multi-step goals
- **Plans** — breaks big projects into actionable steps
- **Executes** — takes real actions: searches the web, writes code, generates images, manages files
- **Remembers** — keeps context across your entire workspace
- **Adapts** — learns your workflows and preferences over time

---

## The Studio Metaphor

Think of Magica as your personal creative and professional studio:

| Studio Role | What Magica Does |
|---|---|
| **Research Assistant** | Finds, reads, and summarizes information from the web |
| **Writing Partner** | Drafts, edits, and refines documents and communications |
| **Project Manager** | Organises tasks, tracks progress, and surfaces next steps |
| **Technical Collaborator** | Writes and runs code, analyses data, builds automations |
| **Creative Director** | Generates images, designs assets, and produces media |

---

## Why One Tool Wins

> "The best workflow is the one you actually use."

When everything lives in one place, you stop managing tools and start doing work. Magica is designed so that the AI disappears into the background — you just describe what you need, and it happens.

---

## Your Next Step

Ready to experience Magica for yourself? Click the button below to create your free account and start your first project today.

[**→ SIGN UP FOR MAGICA**](https://manus.im/signup)`;

const ctaContent = `# Get Started with Magica

---

You have completed the Magica Workflow Guide. You now have everything you need to replace your fragmented AI toolkit with a single, powerful studio.

## What You Have Learned

- How Magica maps to the Claude workflows you already know
- How to chat, manage projects, work with files, and run research — all in one place
- How to build repeatable Flows that automate your most common tasks

## Take the Next Step

Create your free Magica account and put these skills into practice immediately.

**[→ SIGN UP FOR MAGICA — It's Free](https://manus.im/signup)**

---

*Magica is built by the Manus team — the same team behind the AI tools you already trust.*`;

await db.execute(
  `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
  [180001, "MAGICA / THE OVERVIEW", "text", overviewContent, 10, 8, 1]
);
console.log("Inserted: MAGICA / THE OVERVIEW");

await db.execute(
  `INSERT INTO modules (courseId, title, type, content, duration, sortOrder, isPreview, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
  [180001, "Get Started with Magica", "text", ctaContent, 5, 9, 1]
);
console.log("Inserted: Get Started with Magica");

await db.execute(
  `UPDATE courses SET totalModules = totalModules + 2 WHERE id = 180001`
);
console.log("Updated totalModules for Magica Workflow Guide");

await db.end();
console.log("Done!");
