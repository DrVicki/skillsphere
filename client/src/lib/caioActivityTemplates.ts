export const CAIO_BOOTCAMP_SLUG = "chief-ai-officer-caio-4-week-bootcamp";

export type CAIOActivityTemplate = {
  week: number;
  title: string;
  summary: string;
  actionAssignment: string;
  docxUrl: string;
  pdfUrl: string;
};

export const caioActivityTemplates: CAIOActivityTemplate[] = [
  {
    week: 1,
    title: "Mandate & 30-Day Operating System Workbook",
    summary:
      "Frame your CAIO opportunity, assess candidate tasks, draft a charter, and protect your four-week evidence-building rhythm.",
    actionAssignment:
      "Complete the opportunity statement and one-page CAIO charter before beginning Week 2.",
    docxUrl:
      "/manus-storage/CAIO-Week-1-Mandate-and-Operating-System-Workbook_e5070c77.docx",
    pdfUrl:
      "/manus-storage/CAIO-Week-1-Mandate-and-Operating-System-Workbook_61751435.pdf",
  },
  {
    week: 2,
    title: "Proof Portfolio & Business Case Workbook",
    summary:
      "Create a shadow audit, risk check, proof artifact, and results memo that connects a business problem to a measured opportunity.",
    actionAssignment:
      "Use your completed results memo to request a scoped pilot conversation in Week 3.",
    docxUrl:
      "/manus-storage/CAIO-Week-2-Proof-and-Business-Case-Workbook_d5f724d1.docx",
    pdfUrl:
      "/manus-storage/CAIO-Week-2-Proof-and-Business-Case-Workbook_b4628e04.pdf",
  },
  {
    week: 3,
    title: "Responsible Pilot & Deployment Workbook",
    summary:
      "Map the real process, design a human-approved pilot, compare options, and plan the controls and handoff that make it durable.",
    actionAssignment:
      "Leave Week 3 with one accountable pilot plan, named review point, and clear stop condition.",
    docxUrl:
      "/manus-storage/CAIO-Week-3-Responsible-Pilot-Workbook_bafc5c07.docx",
    pdfUrl:
      "/manus-storage/CAIO-Week-3-Responsible-Pilot-Workbook_658d1064.pdf",
  },
  {
    week: 4,
    title: "90-Day Leadership Brief & Capstone Workbook",
    summary:
      "Package your evidence, pilot recommendation, governance posture, and decision request into a CAIO-ready leadership briefing.",
    actionAssignment:
      "Use the completed 90-day leadership brief as your final action assignment and capstone evidence file.",
    docxUrl:
      "/manus-storage/CAIO-Week-4-90-Day-Leadership-Brief-Workbook_1fe09fbf.docx",
    pdfUrl:
      "/manus-storage/CAIO-Week-4-90-Day-Leadership-Brief-Workbook_63eab47c.pdf",
  },
];

/**
 * Each weekly workbook appears at the end of that week's fourth action lesson.
 * The learner must have regular course access before the lesson content renders.
 */
export function getCAIOActivityTemplateForModule(
  courseSlug?: string | null,
  moduleTitle?: string | null
): CAIOActivityTemplate | null {
  if (courseSlug !== CAIO_BOOTCAMP_SLUG || !moduleTitle) return null;

  const match = moduleTitle.match(/^Week\s+([1-4])\s+·\s+Lesson\s+4\s+·/i);
  if (!match) return null;

  return (
    caioActivityTemplates.find(
      template => template.week === Number(match[1])
    ) ?? null
  );
}
