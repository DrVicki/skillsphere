export const ANTIGRAVITY_COURSE_SLUG = "web-development-with-antigravity-ai-agent";

export type AntigravityLabKind = "setup" | "html" | "css" | "javascript" | "fetch" | "fetch-ui" | "fetch-errors" | "fetch-post";

export type AntigravityLab = {
  id: string;
  kind: AntigravityLabKind;
  title: string;
  objective: string;
  prompt: string;
  starter: { html: string; css: string; javascript: string };
  openFile?: "html" | "css" | "javascript";
};

const baseHtml = `<!doctype html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Antigravity Tasks</title></head>
<body>
  <main class="app">
    <h1>My Tasks</h1>
    <p class="status">Build this page with Antigravity.</p>
    <ul id="task-list"><li>Learn HTML</li><li>Try CSS</li><li>Ship JavaScript</li></ul>
    <button id="theme-toggle" type="button">Switch to Dark Theme</button>
  </main>
</body>
</html>`;

const baseCss = `:root { font-family: system-ui, sans-serif; color: #14213d; background: #f7f9fc; }
body { margin: 0; min-height: 100vh; }
.app { max-width: 680px; margin: 0 auto; padding: 3rem 1.25rem; }
h1 { color: #2563eb; }
li { margin: .6rem 0; padding: .65rem; background: white; border-radius: .6rem; }
button { border: 0; border-radius: .6rem; padding: .7rem 1rem; background: #2563eb; color: white; cursor: pointer; }
.dark-theme { color: #eef2ff; background: #111827; }
.dark-theme .app { background: #1f2937; }
.dark-theme li { background: #374151; }
.dark-theme h1 { color: #93c5fd; }`;

const baseJs = `const button = document.querySelector('#theme-toggle');
button?.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  button.textContent = document.body.classList.contains('dark-theme')
    ? 'Switch to Light Theme'
    : 'Switch to Dark Theme';
});`;

export const ANTIGRAVITY_LABS: AntigravityLab[] = [
  { id: "m1-environment", kind: "setup", title: "Set up your Antigravity workspace", objective: "Practice directing the Antigravity Agent with a clear natural-language request.", prompt: "Hello! I'm going to build a web page today. Please create an HTML, CSS, and JavaScript project with a task list and a light/dark theme toggle.", starter: { html: baseHtml, css: baseCss, javascript: baseJs } },
  { id: "m1-html", kind: "html", title: "Add basic HTML to your web app", objective: "Use semantic HTML to create the structure and content of a task-list page.", prompt: "Create a semantic task-list page with a heading, three tasks, and a button. Keep structure in index.html.", starter: { html: baseHtml, css: "", javascript: "" }, openFile: "html" },
  { id: "m1-css", kind: "css", title: "Style your HTML with CSS", objective: "Separate presentation from structure and create a reusable dark-theme style.", prompt: "Style the task list with readable spacing, color, rounded cards, and a .dark-theme class.", starter: { html: baseHtml, css: baseCss, javascript: "" }, openFile: "css" },
  { id: "m1-javascript", kind: "javascript", title: "Add interactivity with JavaScript", objective: "Use an event listener and classList.toggle to switch between light and dark themes.", prompt: "Add a click handler that toggles the dark-theme class and updates the button label.", starter: { html: baseHtml, css: baseCss, javascript: baseJs }, openFile: "javascript" },
  { id: "m2-fetch-basics", kind: "fetch", title: "Understand the Fetch API", objective: "Practice making a GET request and reading JSON with async/await.", prompt: "Use fetch and async/await to request the first todo from JSONPlaceholder and log the parsed JSON.", starter: { html: `<main class="app"><h1>Fetch API practice</h1><p id="output">Open the console to inspect the response.</p></main>`, css: baseCss, javascript: `async function loadTodo() {\n  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');\n  const todo = await response.json();\n  console.log(todo);\n}\nloadTodo();` }, openFile: "javascript" },
  { id: "m2-fetch-ui", kind: "fetch-ui", title: "Fetch and display API data", objective: "Render remote JSON in the page and show a loading state while it arrives.", prompt: "Fetch five todos, show Loading tasks... while waiting, then render the titles as a list.", starter: { html: `<main class="app"><h1>Remote tasks</h1><p id="status">Loading tasks...</p><ul id="task-list"></ul></main>`, css: baseCss, javascript: `const status = document.querySelector('#status');\nconst list = document.querySelector('#task-list');\nfetch('https://jsonplaceholder.typicode.com/todos?_limit=5')\n  .then(response => response.json())\n  .then(todos => {\n    status.textContent = '';\n    list.innerHTML = todos.map(todo => '<li>' + todo.title + '</li>').join('');\n  });` }, openFile: "javascript" },
  { id: "m2-fetch-errors", kind: "fetch-errors", title: "Handle loading states and errors", objective: "Use response.ok and a retry control to make network failures understandable.", prompt: "Add a try/catch flow, an error message, and a Try again button. Test it with an invalid URL, then restore the endpoint.", starter: { html: `<main class="app"><h1>Reliable tasks</h1><p id="status"></p><button id="retry" type="button">Try again</button><ul id="task-list"></ul></main>`, css: baseCss, javascript: `const status = document.querySelector('#status');\nconst retry = document.querySelector('#retry');\nasync function loadTasks() {\n  status.textContent = 'Loading tasks...';\n  try {\n    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');\n    if (!response.ok) throw new Error('Request failed: ' + response.status);\n    const todos = await response.json();\n    status.textContent = 'Loaded ' + todos.length + ' tasks.';\n  } catch (error) {\n    status.textContent = 'Could not load tasks. Try again.';\n    console.error(error);\n  }\n}\nretry.addEventListener('click', loadTasks);\nloadTasks();` }, openFile: "javascript" },
  { id: "m2-fetch-post", kind: "fetch-post", title: "Send data with POST requests", objective: "Submit JSON with POST and reflect the new task optimistically in the interface.", prompt: "Add a task form, send the new task with POST and JSON.stringify, then place it at the top of the list.", starter: { html: `<main class="app"><h1>Task manager</h1><form id="task-form"><input id="task-input" required placeholder="New task"><button>Add Task</button></form><ul id="task-list"><li>Existing task</li></ul></main>`, css: baseCss, javascript: `const form = document.querySelector('#task-form');\nconst input = document.querySelector('#task-input');\nconst list = document.querySelector('#task-list');\nform.addEventListener('submit', async event => {\n  event.preventDefault();\n  const task = { title: input.value, completed: false, userId: 1 };\n  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {\n    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(task)\n  });\n  const saved = await response.json();\n  list.insertAdjacentHTML('afterbegin', '<li>' + saved.title + '</li>');\n  input.value = '';\n});` }, openFile: "javascript" },
];

export function getAntigravityLabForModule(courseSlug?: string | null, moduleTitle?: string | null): AntigravityLab | null {
  if (courseSlug !== ANTIGRAVITY_COURSE_SLUG || !moduleTitle) return null;
  const title = moduleTitle.toLowerCase();
  if (title.includes("set up your environment")) return ANTIGRAVITY_LABS[0];
  if (title.includes("add basic html")) return ANTIGRAVITY_LABS[1];
  if (title.includes("style your html")) return ANTIGRAVITY_LABS[2];
  if (title.includes("add interactivity")) return ANTIGRAVITY_LABS[3];
  if (title.includes("understand the fetch")) return ANTIGRAVITY_LABS[4];
  if (title.includes("fetch and display")) return ANTIGRAVITY_LABS[5];
  if (title.includes("loading states")) return ANTIGRAVITY_LABS[6];
  if (title.includes("send data with post")) return ANTIGRAVITY_LABS[7];
  return null;
}
