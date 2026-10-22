import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CAIO_BOOTCAMP_SLUG,
  caioActivityTemplates,
  getCAIOActivityTemplateForModule,
} from "../client/src/lib/caioActivityTemplates";

const learnerPage = fs.readFileSync(
  new URL("../client/src/pages/LearnCourse.tsx", import.meta.url),
  "utf8"
);
const downloadCard = fs.readFileSync(
  new URL(
    "../client/src/components/CAIOActivityTemplateDownload.tsx",
    import.meta.url
  ),
  "utf8"
);

describe("CAIO BootCamp weekly action templates", () => {
  it("maps all four Week 4 action lessons to editable and printable workbooks", () => {
    expect(caioActivityTemplates).toHaveLength(4);
    expect(caioActivityTemplates.map(template => template.week)).toEqual([
      1, 2, 3, 4,
    ]);
    for (const template of caioActivityTemplates) {
      expect(template.docxUrl).toMatch(/^\/manus-storage\/.*\.docx$/);
      expect(template.pdfUrl).toMatch(/^\/manus-storage\/.*\.pdf$/);
      expect(template.actionAssignment.length).toBeGreaterThan(25);
      expect(
        getCAIOActivityTemplateForModule(
          CAIO_BOOTCAMP_SLUG,
          `Week ${template.week} · Lesson 4 · Action assignment`
        )
      ).toMatchObject({ week: template.week, title: template.title });
    }
  });

  it("does not show a weekly workbook on unrelated courses or non-final lessons", () => {
    expect(
      getCAIOActivityTemplateForModule(
        "another-course",
        "Week 1 · Lesson 4 · Action"
      )
    ).toBeNull();
    expect(
      getCAIOActivityTemplateForModule(
        CAIO_BOOTCAMP_SLUG,
        "Week 1 · Lesson 3 · Action"
      )
    ).toBeNull();
  });

  it("renders accessible DOCX and PDF downloads in the learner lesson view", () => {
    expect(learnerPage).toContain("getCAIOActivityTemplateForModule");
    expect(learnerPage).toContain("<CAIOActivityTemplateDownload");
    expect(downloadCard).toContain("Download editable DOCX");
    expect(downloadCard).toContain("Download print PDF");
    expect(downloadCard).toContain("download");
  });
});
