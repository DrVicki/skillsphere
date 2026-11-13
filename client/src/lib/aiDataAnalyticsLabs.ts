export const AI_DATA_ANALYTICS_LAB_COURSE_SLUG = "ai-in-data-analytics";

export interface AIDataAnalyticsLab {
  id: string;
  title: string;
  focus: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
}

const common = `# AI in Data Analytics · browser lab
# This lab uses Python's standard library so it runs safely in your browser.
# Edit the TODO lines, then press Run.
`;

const lab = (id: string, title: string, focus: string, body: string, expectedOutput: string, hints: string[]): AIDataAnalyticsLab => ({
  id,
  title,
  focus,
  starterCode: `${common}\n${body}`,
  expectedOutput,
  hints,
});

const labs: AIDataAnalyticsLab[] = [
  lab("m1-l1", "Analytics maturity signal", "Classify an analytics question as descriptive, diagnostic, predictive, or prescriptive.", `questions = [
    ("weekly revenue dashboard", "what happened"),
    ("churn forecast", "what will happen"),
    ("next-best offer", "what should we do"),
]

# TODO: count how many questions belong to each maturity stage.
counts = {}
for _, stage in questions:
    counts[stage] = counts.get(stage, 0) + 1

print(counts)`, "{'what happened': 1, 'what will happen': 1, 'what should we do': 1}", ["Use a dictionary as a frequency table.", "The second item in each tuple is the stage label."]),
  lab("m1-l2", "Choose an AI technique", "Connect common analytics tasks to the technique that best supports them.", `tasks = {
    "forecast demand": "time-series model",
    "group customers": "clustering",
    "summarize reviews": "language model",
    "detect unusual claims": "anomaly detection",
}

# TODO: print each task and its technique in alphabetical order.
for task, technique in sorted(tasks.items()):
    print(f"{task}: {technique}")`, "detect unusual claims: anomaly detection\nforecast demand: time-series model\ngroup customers: clustering\nsummarize reviews: language model", ["Use sorted(tasks.items()).", "Keep the task and technique together while iterating."]),
  lab("m1-l3", "Detect a sales trend", "Calculate period-over-period change and flag a meaningful increase.", `sales = [120, 126, 133, 145, 151]

# TODO: calculate the absolute change and percentage change from first to last.
change = 0
percent_change = 0

print("Change:", change)
print("Percent change:", round(percent_change, 1), "%")`, "Change: 31\nPercent change: 25.8 %", ["Subtract sales[0] from sales[-1].", "Percentage change is change divided by the first value, times 100."]),
  lab("m1-l4", "Compare content engagement", "Summarize a small content analytics table and identify the strongest engagement.", `content = [
    {"title": "Drama", "views": 2400, "completions": 1680},
    {"title": "Comedy", "views": 2100, "completions": 1470},
    {"title": "Documentary", "views": 1800, "completions": 1350},
]

# TODO: add completion_rate to every row and find the best title.
for row in content:
    row["completion_rate"] = 0
best = max(content, key=lambda row: row["completion_rate"])
print(best["title"], round(best["completion_rate"] * 100, 1), "%")`, "Documentary 75.0 %", ["Completion rate is completions divided by views.", "max(..., key=...) selects the row with the largest derived value."]),
  lab("m1-q1", "Module 1 analytics check", "Use a small scoring function to turn evidence into a transparent recommendation.", `evidence = {"automated": 4, "human_review": 3, "data_quality": 2}

# TODO: calculate the average evidence score and classify readiness.
average = 0
readiness = "not assessed"

print("Average:", round(average, 1))
print("Readiness:", readiness)`, "Average: 3.0\nReadiness: ready for a pilot", ["Average the dictionary values.", "Use a threshold of 3 or higher for the pilot label."]),
  lab("m2-l1", "Profile messy data", "Measure missing values and normalize a compact customer table.", `rows = [
    {"name": "Ava", "age": 31, "spend": 120},
    {"name": "Bo", "age": None, "spend": 95},
    {"name": "Cy", "age": 29, "spend": None},
]

# TODO: report missing counts by column and fill missing spend with the mean.
missing = {}
for column in ("name", "age", "spend"):
    missing[column] = sum(row[column] is None for row in rows)
mean_spend = sum(row["spend"] for row in rows if row["spend"] is not None) / 2
for row in rows:
    if row["spend"] is None:
        row["spend"] = mean_spend
print(missing)
print(rows)`, "{'name': 0, 'age': 1, 'spend': 1}\n[{'name': 'Ava', 'age': 31, 'spend': 120}, {'name': 'Bo', 'age': None, 'spend': 95}, {'name': 'Cy', 'age': 29, 'spend': 107.5}]", ["Count None values per column.", "Imputation should be documented; this example uses the observed spend mean."]),
  lab("m2-l2", "Engineer useful features", "Create interpretable features from customer behavior.", `customers = [
    {"visits": 8, "purchases": 2, "support_tickets": 1},
    {"visits": 3, "purchases": 0, "support_tickets": 4},
    {"visits": 10, "purchases": 4, "support_tickets": 0},
]

# TODO: add conversion_rate and support_load to each customer.
for customer in customers:
    customer["conversion_rate"] = 0
    customer["support_load"] = 0
print(customers)`, "[{'visits': 8, 'purchases': 2, 'support_tickets': 1, 'conversion_rate': 0.25, 'support_load': 0.125}, {'visits': 3, 'purchases': 0, 'support_tickets': 4, 'conversion_rate': 0.0, 'support_load': 1.333}, {'visits': 10, 'purchases': 4, 'support_tickets': 0, 'conversion_rate': 0.4, 'support_load': 0.0}]", ["Guard against division by zero.", "A ratio is a feature only when its denominator is clearly defined."]),
  lab("m2-l3", "Clean customer records", "Deduplicate and standardize text before analysis.", `raw = ["  Northwind ", "northwind", "NORTHWIND", "Blue Sky", " blue sky "]

# TODO: normalize whitespace and case, then preserve first-seen order.
clean = []
for value in raw:
    normalized = ""
    if normalized not in clean:
        clean.append(normalized)
print(clean)`, "['northwind', 'blue sky']", ["Use strip().lower().", "Check membership before appending to preserve order."]),
  lab("m2-l4", "Monitor data quality", "Create a quality score from completeness, uniqueness, and validity checks.", `records = [
    {"email": "ava@example.com", "age": 31},
    {"email": "bo@example.com", "age": 42},
    {"email": "ava@example.com", "age": -2},
]

# TODO: calculate completeness, unique-email, and valid-age rates.
completeness = 0
unique_email_rate = 0
valid_age_rate = 0
print(round(completeness, 2), round(unique_email_rate, 2), round(valid_age_rate, 2))`, "1.0 0.67 0.67", ["Completeness is populated required fields divided by total required fields.", "A valid age is greater than 0 and less than 120."]),
  lab("m2-q1", "Preparation quality gate", "Turn quality dimensions into a go/no-go rule before modeling.", `quality = {"completeness": 0.96, "validity": 0.91, "uniqueness": 0.84}

# TODO: calculate the average and decide whether the dataset passes a 0.85 gate.
score = 0
passes = False
print(round(score, 2), passes)`, "0.9 True", ["Average the three values.", "A gate is a policy decision: make the threshold visible in code."]),
  lab("m3-l1", "Build a transparent predictor", "Use a simple nearest-baseline rule and evaluate its accuracy.", `actual = [0, 1, 1, 0, 1, 1]
predicted = [0, 1, 0, 0, 1, 1]

# TODO: calculate accuracy and print a model decision.
accuracy = 0
print("Accuracy:", round(accuracy, 2))`, "Accuracy: 0.83", ["Count matching positions with zip().", "Accuracy is correct predictions divided by all predictions."]),
  lab("m3-l2", "Explain model contributions", "Compare feature contributions without treating explanation as causation.", `contributions = {"recent_usage": 0.42, "support_tickets": 0.31, "tenure_months": -0.18}

# TODO: sort contributions by absolute importance and print the ranking.
for feature, contribution in []:
    print(feature, contribution)`, "recent_usage 0.42\nsupport_tickets 0.31\ntenure_months -0.18", ["Use key=lambda item: abs(item[1]) in sorted().", "Keep the sign because it communicates direction."]),
  lab("m3-l3", "Score churn risk", "Combine model inputs into a reviewable risk score.", `signals = {"tickets": 4, "days_since_purchase": 28, "review_score": 2}

# TODO: calculate a bounded risk score from the signals.
risk = 0
label = "monitor"
print(risk, label)`, "70 critical", ["Use a weighted sum, then clamp it between 0 and 100.", "High risk should trigger human review, not an automatic adverse decision."]),
  lab("m3-l4", "Optimize a route heuristic", "Compare route candidates using distance and stop-count tradeoffs.", `routes = [
    {"name": "North", "miles": 120, "stops": 18},
    {"name": "Central", "miles": 96, "stops": 20},
    {"name": "South", "miles": 110, "stops": 16},
]

# TODO: add miles_per_stop and select the most efficient route.
for route in routes:
    route["miles_per_stop"] = 0
best = min(routes, key=lambda route: route["miles_per_stop"])
print(best["name"], round(best["miles_per_stop"], 1))`, "Central 4.8", ["Compute miles divided by stops.", "Efficiency is only one objective; operational constraints still matter."]),
  lab("m3-q1", "Evaluate a model responsibly", "Calculate precision and recall for a binary prediction.", `actual = [1, 1, 1, 0, 0, 0]
predicted = [1, 0, 1, 1, 0, 0]

# TODO: calculate true positives, false positives, and false negatives.
tp = fp = fn = 0
precision = recall = 0
print(round(precision, 2), round(recall, 2))`, "0.67 0.67", ["Compare actual and predicted together.", "Precision uses predicted positives; recall uses actual positives."]),
  lab("m4-l1", "Extract text signals", "Create a simple transparent sentiment signal from review text.", `reviews = [
    "fast delivery and excellent quality",
    "late delivery and damaged box",
    "helpful support but high price",
]
positive = {"fast", "excellent", "helpful"}
negative = {"late", "damaged", "high"}

# TODO: score each review by counting positive minus negative words.
for review in reviews:
    score = 0
    print(score, review)`, "2 fast delivery and excellent quality\n-1 late delivery and damaged box\n0 helpful support but high price", ["Tokenize with lower().split().", "A rule-based signal should be inspected for false positives."]),
  lab("m4-l2", "Translate a question into a query", "Map plain-language business questions to safe, explicit aggregations.", `orders = [
    {"region": "East", "revenue": 120},
    {"region": "West", "revenue": 180},
    {"region": "East", "revenue": 90},
]

# TODO: aggregate revenue by region for the question: total revenue by region.
by_region = {}
for order in orders:
    by_region[order["region"]] = by_region.get(order["region"], 0) + order["revenue"]
print(by_region)`, "{'East': 210, 'West': 180}", ["Make the selected columns and aggregation explicit.", "A natural-language layer should produce a query a human can inspect."]),
  lab("m4-l3", "Summarize customer reviews", "Aggregate aspect mentions and sentiment for a small review set.", `reviews = [
    ("shipping", -1), ("shipping", -1), ("quality", 1),
    ("support", 1), ("quality", 1),
]

# TODO: calculate mention count and average sentiment by aspect.
summary = {}
for aspect, sentiment in reviews:
    summary.setdefault(aspect, []).append(sentiment)
for aspect, values in sorted(summary.items()):
    print(aspect, len(values), round(sum(values) / len(values), 1))`, "quality 2 1.0\nshipping 2 -1.0\nsupport 1 1.0", ["Group values by aspect before calculating averages.", "Counts and averages answer different stakeholder questions."]),
  lab("m4-l4", "Prioritize contract review", "Use transparent rules to triage documents for human review.", `contracts = [
    {"name": "A", "value": 90000, "auto_renew": True},
    {"name": "B", "value": 25000, "auto_renew": False},
    {"name": "C", "value": 75000, "auto_renew": False},
]

# TODO: flag contracts over 50000 or with auto-renewal.
for contract in contracts:
    priority = "standard"
    print(contract["name"], priority)`, "A priority\nB standard\nC priority", ["Use or to combine the two review conditions.", "Triage recommends review; it does not replace legal judgment."]),
  lab("m4-q1", "Validate text analytics", "Measure agreement between a simple classifier and reviewed labels.", `reviewed = ["positive", "negative", "positive", "positive", "negative"]
predicted = ["positive", "negative", "negative", "positive", "negative"]

# TODO: calculate the agreement rate.
agreement = 0
print(round(agreement, 2))`, "0.8", ["Compare paired labels with zip().", "Keep a reviewed sample as a reference set for evaluation."]),
  lab("m5-l1", "Audit selection parity", "Compare selection rates across groups and identify a disparity to investigate.", `groups = {
    "Group A": (72, 100),
    "Group B": (60, 100),
}

# TODO: calculate each selection rate and the ratio to the highest rate.
for group, (selected, total) in groups.items():
    rate = 0
    print(group, round(rate, 2))`, "Group A 0.72\nGroup B 0.6", ["Rate is selected divided by total.", "A disparity is a prompt for investigation, not proof of intent or cause."]),
  lab("m5-l2", "Build a governance checklist", "Score whether an analytics workflow has basic governance controls.", `controls = {
    "documented purpose": True,
    "human review": True,
    "bias monitoring": False,
    "retention limit": True,
}

# TODO: calculate the percentage of controls currently in place.
coverage = 0
print(round(coverage, 0), "%")`, "75.0 %", ["True values represent controls that are in place.", "Use coverage to prioritize remediation rather than claiming full compliance."]),
  lab("m5-l3", "Test hiring fairness", "Compare selection rates and flag a four-fifths-rule review trigger.", `selection = {"Group A": (48, 100), "Group B": (30, 100)}

# TODO: calculate the selection-rate ratio of the lower group to the higher group.
ratio = 0
needs_review = False
print(round(ratio, 2), needs_review)`, "0.62 True", ["Find the two rates before comparing them.", "This is an audit signal and should be reviewed with context and qualified experts."]),
  lab("m5-l4", "Document a responsible decision", "Create an audit record that makes an automated decision explainable and reviewable.", `decision = {
    "model": "screening-v2",
    "outcome": "pause deployment",
    "reason": "selection-rate disparity requires investigation",
    "owner": "analytics governance",
}

# TODO: print a complete, readable audit record.
for key, value in decision.items():
    print(f"{key}: {value}")`, "model: screening-v2\noutcome: pause deployment\nreason: selection-rate disparity requires investigation\nowner: analytics governance", ["Audit records should include what happened, why, and who owns follow-up.", "Do not place personal or confidential applicant data in a learning sandbox."]),
  lab("m5-q1", "Responsible analytics gate", "Combine quality, fairness, and governance signals into a deployment recommendation.", `checks = {"data_quality": True, "fairness_review": False, "owner_assigned": True}

# TODO: recommend deploy only when every required check is true.
recommendation = "hold"
print(recommendation)`, "hold", ["Use all(checks.values()) for an all-controls gate.", "A hold is a responsible outcome when a required review is incomplete."]),
  lab("capstone", "Customer analytics dashboard metric", "Build one transparent KPI from a small customer dataset before you extend the capstone with richer charts or models.", `customers = [
    {"segment": "new", "revenue": 120, "satisfied": True},
    {"segment": "returning", "revenue": 220, "satisfied": True},
    {"segment": "new", "revenue": 80, "satisfied": False},
]

# TODO: calculate total revenue and satisfaction rate by segment.
by_segment = {}
for customer in customers:
    segment = customer["segment"]
    summary = by_segment.setdefault(segment, {"revenue": 0, "satisfied": 0, "count": 0})
    summary["revenue"] += customer["revenue"]
    summary["satisfied"] += int(customer["satisfied"])
    summary["count"] += 1
for segment, summary in sorted(by_segment.items()):
    print(segment, summary["revenue"], round(summary["satisfied"] / summary["count"] * 100, 1), "% satisfied")`, "new 200 50.0 % satisfied\nreturning 220 100.0 % satisfied", ["Group records by segment with setdefault().", "A dashboard metric should expose its numerator and denominator so stakeholders can interpret it."]),
];

const lessonTitleToLabId: Record<string, string> = {
  "What Is AI in the Context of Data Analytics?": "m1-l1",
  "Key AI Technologies for Analysts": "m1-l2",
  "Example: Automating Sales Trend Detection": "m1-l3",
  "Case Study: Netflix's AI-Driven Content Analytics": "m1-l4",
  "Knowledge Check: Module 1": "m1-q1",
  "AI-Assisted Data Cleaning": "m2-l1",
  "Automated Feature Engineering": "m2-l2",
  "Example: Cleaning Messy Customer Data with AI": "m2-l3",
  "Case Study: Airbnb's Data Quality at Scale": "m2-l4",
  "Knowledge Check: Module 2": "m2-q1",
  "Building Your First Predictive Model": "m3-l1",
  "Model Interpretability & Explainable AI": "m3-l2",
  "Example: Customer Churn Prediction Pipeline": "m3-l3",
  "Case Study: UPS ORION — AI Route Optimization": "m3-l4",
  "Knowledge Check: Module 3": "m3-q1",
  "Text Analytics Fundamentals": "m4-l1",
  "LLMs for Analytics: Querying Data in Plain English": "m4-l2",
  "Example: Analyzing Customer Reviews at Scale": "m4-l3",
  "Case Study: JPMorgan's COIN — Contract Intelligence": "m4-l4",
  "Knowledge Check: Module 4": "m4-q1",
  "Bias, Fairness & Responsible AI": "m5-l1",
  "AI Governance Frameworks & Compliance": "m5-l2",
  "Example: Auditing a Hiring Algorithm for Bias": "m5-l3",
  "Case Study: Amazon's Biased Hiring Tool": "m5-l4",
  "Knowledge Check: Module 5": "m5-q1",
  "Capstone · Build an AI-Powered Customer Analytics Dashboard": "capstone",
};

export function getAIDataAnalyticsLabForModule(courseSlug?: string | null, moduleTitle?: string | null): AIDataAnalyticsLab | null {
  if (courseSlug !== AI_DATA_ANALYTICS_LAB_COURSE_SLUG || !moduleTitle) return null;
  const normalizedTitle = moduleTitle.replace(/^Module \d+\s*[·:-]\s*/i, "").replace(/^Lesson \d+\s*[·:-]\s*/i, "").trim();
  const id = lessonTitleToLabId[normalizedTitle] ?? Object.entries(lessonTitleToLabId).find(([title]) => normalizedTitle.includes(title) || title.includes(normalizedTitle))?.[1];
  return labs.find(item => item.id === id) ?? null;
}

export const aiDataAnalyticsLabs = labs;
