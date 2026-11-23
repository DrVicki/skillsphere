import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = "/tmp/py30days";
const files = fs.readdirSync(root).filter(name => /^day\d+-.*\.js$/.test(name)).sort((a, b) => Number(a.match(/day(\d+)/)[1]) - Number(b.match(/day(\d+)/)[1]));
const weekMeta = [
  { number: 1, title: "Foundations & Control Flow", subtitle: "Print, variables, types, math, strings, input, decisions and loops.", sheets: [1, 20], project: "Number Guessing Game" },
  { number: 2, title: "Data Structures", subtitle: "Lists, tuples, sets and dictionaries — the containers everything else is built on.", sheets: [21, 40], project: "Contact Book" },
  { number: 3, title: "Functions, Text & Files", subtitle: "Your own functions, serious string work, and data that survives a restart.", sheets: [41, 60], project: "File-Backed Contact Book" },
  { number: 4, title: "Errors, Debugging & Classes", subtitle: "Read tracebacks, handle failure, and model the world with objects.", sheets: [61, 80], project: "Expense Tracker" },
  { number: 5, title: "Standard Library & Real Programs", subtitle: "math, random, datetime, collections, APIs and regex — then the capstone.", sheets: [81, 100], project: "To-Do CLI" },
];
const out = { source: "https://py30-nete5pnd.manus.space/", title: "30 Days to Learn Python — From print() to a Finished App", weeks: weekMeta, days: [] };
for (const file of files) {
  const day = Number(file.match(/day(\d+)/)[1]);
  const url = pathToFileURL(path.join(root, file)).href;
  const mod = await import(url);
  const data = mod.default;
  const week = weekMeta.find(item => day >= (item.number - 1) * 6 + 1 && day <= item.number * 6);
  out.days.push({ day, week: week.number, ...data });
}
fs.writeFileSync("/home/ubuntu/skillsphere/references/py30-source-content.json", JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify({ days: out.days.length, lessons: out.days.filter(d => d.kind === "lesson").length, reviews: out.days.filter(d => d.kind === "review").length, concepts: out.days.reduce((n, d) => n + (d.concepts?.length ?? 0), 0), weeks: out.weeks.length }, null, 2));
