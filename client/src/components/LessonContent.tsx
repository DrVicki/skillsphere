import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import DOMPurify from "dompurify";

interface LessonContentProps {
  content: string;
  title?: string;
}

// Detect if content is HTML (from Tiptap) or Markdown
function isHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str.trim());
}

// Counter for ordered list items (Markdown path)
let olCounter = 0;

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e3a6e", marginTop: 0, marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "3px solid #2A63BF", lineHeight: 1.3 }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e3a6e", marginTop: "2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.875rem", background: "linear-gradient(135deg, #EEF4FF 0%, #F0F7FF 100%)", borderLeft: "4px solid #2A63BF", borderRadius: "0 8px 8px 0" }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#2A63BF", marginTop: "1.5rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#F5B942", flexShrink: 0 }} />
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: "1.25rem", marginBottom: "0.5rem" }}>
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "#374151", marginBottom: "1rem" }}>
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul style={{ marginBottom: "1rem", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => {
    olCounter = 0;
    return (
      <ol style={{ marginBottom: "1rem", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.625rem", counterReset: "li-counter" }}>
        {children}
      </ol>
    );
  },
  li: ({ children, node }: any) => {
    const isOrdered = node?.parent?.ordered === true;
    if (isOrdered) {
      olCounter++;
      const num = olCounter;
      return (
        <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>
          <span style={{ flexShrink: 0, width: "1.625rem", height: "1.625rem", borderRadius: "50%", background: "#2A63BF", color: "#fff", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.1rem" }}>{num}</span>
          <span style={{ flex: 1 }}>{children}</span>
        </li>
      );
    }
    return (
      <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>
        <span style={{ flexShrink: 0, width: "8px", height: "8px", borderRadius: "50%", background: "#2A63BF", marginTop: "0.55rem" }} />
        <span style={{ flex: 1 }}>{children}</span>
      </li>
    );
  },
  blockquote: ({ children }) => (
    <blockquote style={{ margin: "1.25rem 0", padding: "1rem 1.25rem", background: "linear-gradient(135deg, #FFF8E7 0%, #FFFBF0 100%)", borderLeft: "4px solid #F5B942", borderRadius: "0 10px 10px 0", color: "#4b5563", fontStyle: "italic", fontSize: "0.9375rem", lineHeight: 1.7 }}>
      {children}
    </blockquote>
  ),
  code: ({ inline, children }: any) =>
    inline ? (
      <code style={{ padding: "0.125rem 0.375rem", borderRadius: "4px", background: "#EEF4FF", color: "#2A63BF", fontSize: "0.8125rem", fontFamily: "ui-monospace, SFMono-Regular, monospace", fontWeight: 600 }}>
        {children}
      </code>
    ) : (
      <code style={{ display: "block", background: "#1e293b", color: "#86efac", borderRadius: "10px", padding: "1.25rem", fontSize: "0.875rem", fontFamily: "ui-monospace, SFMono-Regular, monospace", overflowX: "auto" as const, lineHeight: 1.6, margin: "1rem 0" }}>
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre style={{ margin: "1rem 0", borderRadius: "10px", overflow: "hidden" }}>{children}</pre>
  ),
  table: ({ children }) => (
    <div style={{ margin: "1.25rem 0", overflowX: "auto" as const, borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "0.875rem" }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead style={{ background: "linear-gradient(135deg, #2A63BF 0%, #1e4fa3 100%)" }}>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr style={{ borderBottom: "1px solid #f3f4f6" }}>{children}</tr>,
  th: ({ children }) => <th style={{ padding: "0.75rem 1rem", textAlign: "left" as const, fontSize: "0.75rem", fontWeight: 700, color: "#ffffff", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: "0.75rem 1rem", color: "#374151", verticalAlign: "top" as const }}>{children}</td>,
  hr: () => <hr style={{ margin: "1.5rem 0", border: "none", height: "2px", background: "linear-gradient(to right, transparent, #e5e7eb, transparent)" }} />,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#2A63BF", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 500 }}>
      {children}
    </a>
  ),
  strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#1e3a6e" }}>{children}</strong>,
  em: ({ children }) => <em style={{ fontStyle: "italic", color: "#4b5563" }}>{children}</em>,
};

// CSS injected once for HTML (Tiptap) content styling
const htmlStyles = `
  .lesson-html-content h1 {
    font-size: 1.5rem; font-weight: 800; color: #1e3a6e;
    margin-top: 0; margin-bottom: 1rem;
    padding-bottom: 0.75rem; border-bottom: 3px solid #2A63BF; line-height: 1.3;
  }
  .lesson-html-content h2 {
    font-size: 1.2rem; font-weight: 700; color: #1e3a6e;
    margin-top: 2rem; margin-bottom: 0.75rem;
    padding: 0.5rem 0.875rem;
    background: linear-gradient(135deg, #EEF4FF 0%, #F0F7FF 100%);
    border-left: 4px solid #2A63BF; border-radius: 0 8px 8px 0;
  }
  .lesson-html-content h3 {
    font-size: 1rem; font-weight: 700; color: #2A63BF;
    margin-top: 1.5rem; margin-bottom: 0.5rem;
  }
  .lesson-html-content h4 {
    font-size: 0.8125rem; font-weight: 700; color: #6b7280;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-top: 1.25rem; margin-bottom: 0.5rem;
  }
  .lesson-html-content p {
    font-size: 0.9375rem; line-height: 1.75; color: #374151; margin-bottom: 1rem;
  }
  .lesson-html-content ul {
    margin-bottom: 1rem; padding-left: 1.5rem; list-style: disc;
  }
  .lesson-html-content ul li {
    font-size: 0.9375rem; color: #374151; line-height: 1.7;
    margin-bottom: 0.375rem;
    list-style-type: disc;
  }
  .lesson-html-content ul li::marker { color: #2A63BF; }
  .lesson-html-content ol {
    margin-bottom: 1rem; padding-left: 1.5rem; list-style: decimal;
  }
  .lesson-html-content ol li {
    font-size: 0.9375rem; color: #374151; line-height: 1.7;
    margin-bottom: 0.375rem;
  }
  .lesson-html-content ol li::marker { color: #2A63BF; font-weight: 700; }
  .lesson-html-content blockquote {
    margin: 1.25rem 0; padding: 1rem 1.25rem;
    background: linear-gradient(135deg, #FFF8E7 0%, #FFFBF0 100%);
    border-left: 4px solid #F5B942; border-radius: 0 10px 10px 0;
    color: #4b5563; font-style: italic; font-size: 0.9375rem; line-height: 1.7;
  }
  .lesson-html-content code {
    padding: 0.125rem 0.375rem; border-radius: 4px;
    background: #EEF4FF; color: #2A63BF;
    font-size: 0.8125rem; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 600;
  }
  .lesson-html-content pre {
    margin: 1rem 0; border-radius: 10px; overflow: hidden;
  }
  .lesson-html-content pre code {
    display: block; background: #1e293b; color: #86efac;
    border-radius: 10px; padding: 1.25rem;
    font-size: 0.875rem; font-family: ui-monospace, SFMono-Regular, monospace;
    overflow-x: auto; line-height: 1.6;
  }
  .lesson-html-content table {
    width: 100%; border-collapse: collapse; font-size: 0.875rem;
    margin: 1.25rem 0; border-radius: 12px; overflow: hidden;
    border: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .lesson-html-content thead { background: linear-gradient(135deg, #2A63BF 0%, #1e4fa3 100%); }
  .lesson-html-content th {
    padding: 0.75rem 1rem; text-align: left;
    font-size: 0.75rem; font-weight: 700; color: #ffffff;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .lesson-html-content td {
    padding: 0.75rem 1rem; color: #374151; vertical-align: top;
    border-bottom: 1px solid #f3f4f6;
  }
  .lesson-html-content tr:last-child td { border-bottom: none; }
  .lesson-html-content hr {
    margin: 1.5rem 0; border: none; height: 2px;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
  }
  .lesson-html-content a {
    color: #2A63BF; text-decoration: underline;
    text-underline-offset: 3px; font-weight: 500;
  }
  .lesson-html-content strong { font-weight: 700; color: #1e3a6e; }
  .lesson-html-content em { font-style: italic; color: #4b5563; }
  .lesson-html-content img {
    max-width: 100%; border-radius: 10px;
    margin: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

let stylesInjected = false;

function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = htmlStyles;
  document.head.appendChild(style);
  stylesInjected = true;
}

export default function LessonContent({ content }: LessonContentProps) {
  const contentIsHTML = isHTML(content);

  if (contentIsHTML) {
    injectStyles();
  }

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 12px rgba(42,99,191,0.07)",
      overflow: "hidden",
    }}>
      {/* Branded gradient accent bar */}
      <div style={{ height: "5px", background: "linear-gradient(90deg, #2A63BF 0%, #4a90d9 50%, #F5B942 100%)" }} />

      {/* Content area */}
      <div style={{ padding: "2rem 2.25rem" }}>
        {contentIsHTML ? (
          <div
            className="lesson-html-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content, { ADD_TAGS: ["iframe"], ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"] }) }}
          />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
