export const AI_DATA_ANALYTICS_COURSE_SLUG = "ai-in-data-analytics";

export const aiDataAnalyticsVisualizationTypes = [
  "maturity",
  "data-quality",
  "churn-risk",
  "nlp-insights",
  "fairness-audit",
  "capstone",
] as const;

export type AIDataAnalyticsVisualizationType = (typeof aiDataAnalyticsVisualizationTypes)[number];

const lessonVisualizations: Array<{
  titleIncludes: string;
  visualization: AIDataAnalyticsVisualizationType;
}> = [
  { titleIncludes: "What Is AI in the Context of Data Analytics?", visualization: "maturity" },
  { titleIncludes: "AI-Assisted Data Cleaning", visualization: "data-quality" },
  { titleIncludes: "Building Your First Predictive Model", visualization: "churn-risk" },
  { titleIncludes: "Text Analytics Fundamentals", visualization: "nlp-insights" },
  { titleIncludes: "Bias, Fairness & Responsible AI", visualization: "fairness-audit" },
  { titleIncludes: "Capstone · Build an AI-Powered Customer Analytics Dashboard", visualization: "capstone" },
];

export function getAIDataAnalyticsVisualizationForModule(
  courseSlug?: string | null,
  moduleTitle?: string | null,
): AIDataAnalyticsVisualizationType | null {
  if (courseSlug !== AI_DATA_ANALYTICS_COURSE_SLUG || !moduleTitle) return null;

  return lessonVisualizations.find(({ titleIncludes }) => moduleTitle.includes(titleIncludes))?.visualization ?? null;
}
