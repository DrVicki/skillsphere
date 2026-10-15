import { describe, expect, it } from "vitest";
import {
  AI_DATA_ANALYTICS_COURSE_SLUG,
  getAIDataAnalyticsVisualizationForModule,
} from "../client/src/lib/aiDataAnalyticsVisualizations";

describe("AI data analytics visualization routing", () => {
  it("shows each standalone visualization only in its matching source lesson", () => {
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Module 1 · What Is AI in the Context of Data Analytics?")).toBe("maturity");
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Module 2 · AI-Assisted Data Cleaning")).toBe("data-quality");
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Module 3 · Building Your First Predictive Model")).toBe("churn-risk");
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Module 4 · Text Analytics Fundamentals")).toBe("nlp-insights");
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Module 5 · Bias, Fairness & Responsible AI")).toBe("fairness-audit");
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Capstone · Build an AI-Powered Customer Analytics Dashboard")).toBe("capstone");
  });

  it("does not render the course tools for unrelated courses or source lessons", () => {
    expect(getAIDataAnalyticsVisualizationForModule("another-course", "Module 1 · What Is AI in the Context of Data Analytics?")).toBeNull();
    expect(getAIDataAnalyticsVisualizationForModule(AI_DATA_ANALYTICS_COURSE_SLUG, "Knowledge Check: Module 1")).toBeNull();
  });
});
