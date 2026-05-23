import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface LessonContentProps {
  content: string;
  title?: string;
}

// Counter for ordered list items
let olCounter = 0;

const components: Components = {
  // ── Headings ──────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 style={{
      fontSize: "1.5rem",
      fontWeight: 800,
      color: "#1e3a6e",
      marginTop: 0,
      marginBottom: "1rem",
      paddingBottom: "0.75rem",
      borderBottom: "3px solid #2A63BF",
      lineHeight: 1.3,
    }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontSize: "1.2rem",
      fontWeight: 700,
      color: "#1e3a6e",
      marginTop: "2rem",
      marginBottom: "0.75rem",
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
      padding: "0.5rem 0.875rem",
      background: "linear-gradient(135deg, #EEF4FF 0%, #F0F7FF 100%)",
      borderLeft: "4px solid #2A63BF",
      borderRadius: "0 8px 8px 0",
    }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontSize: "1rem",
      fontWeight: 700,
      color: "#2A63BF",
      marginTop: "1.5rem",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    }}>
      <span style={{
        display: "inline-block",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#F5B942",
        flexShrink: 0,
      }} />
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 style={{
      fontSize: "0.8125rem",
      fontWeight: 700,
      color: "#6b7280",
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      marginTop: "1.25rem",
      marginBottom: "0.5rem",
    }}>
      {children}
    </h4>
  ),

  // ── Paragraph ─────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p style={{
      fontSize: "0.9375rem",
      lineHeight: 1.75,
      color: "#374151",
      marginBottom: "1rem",
    }}>
      {children}
    </p>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul style={{
      marginBottom: "1rem",
      paddingLeft: 0,
      listStyle: "none",
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.5rem",
    }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => {
    olCounter = 0;
    return (
      <ol style={{
        marginBottom: "1rem",
        paddingLeft: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column" as const,
        gap: "0.625rem",
        counterReset: "li-counter",
      }}>
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
          <span style={{
            flexShrink: 0,
            width: "1.625rem",
            height: "1.625rem",
            borderRadius: "50%",
            background: "#2A63BF",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "0.1rem",
          }}>
            {num}
          </span>
          <span style={{ flex: 1 }}>{children}</span>
        </li>
      );
    }
    return (
      <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>
        <span style={{
          flexShrink: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#2A63BF",
          marginTop: "0.55rem",
        }} />
        <span style={{ flex: 1 }}>{children}</span>
      </li>
    );
  },

  // ── Blockquote ────────────────────────────────────────────────────────────
  blockquote: ({ children }) => (
    <blockquote style={{
      margin: "1.25rem 0",
      padding: "1rem 1.25rem",
      background: "linear-gradient(135deg, #FFF8E7 0%, #FFFBF0 100%)",
      borderLeft: "4px solid #F5B942",
      borderRadius: "0 10px 10px 0",
      color: "#4b5563",
      fontStyle: "italic",
      fontSize: "0.9375rem",
      lineHeight: 1.7,
    }}>
      {children}
    </blockquote>
  ),

  // ── Code ──────────────────────────────────────────────────────────────────
  code: ({ inline, children }: any) =>
    inline ? (
      <code style={{
        padding: "0.125rem 0.375rem",
        borderRadius: "4px",
        background: "#EEF4FF",
        color: "#2A63BF",
        fontSize: "0.8125rem",
        fontFamily: "ui-monospace, SFMono-Regular, monospace",
        fontWeight: 600,
      }}>
        {children}
      </code>
    ) : (
      <code style={{
        display: "block",
        background: "#1e293b",
        color: "#86efac",
        borderRadius: "10px",
        padding: "1.25rem",
        fontSize: "0.875rem",
        fontFamily: "ui-monospace, SFMono-Regular, monospace",
        overflowX: "auto" as const,
        lineHeight: 1.6,
        margin: "1rem 0",
      }}>
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre style={{ margin: "1rem 0", borderRadius: "10px", overflow: "hidden" }}>{children}</pre>
  ),

  // ── Table ─────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div style={{
      margin: "1.25rem 0",
      overflowX: "auto" as const,
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "0.875rem" }}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: "linear-gradient(135deg, #2A63BF 0%, #1e4fa3 100%)" }}>
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th style={{
      padding: "0.75rem 1rem",
      textAlign: "left" as const,
      fontSize: "0.75rem",
      fontWeight: 700,
      color: "#ffffff",
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
    }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td style={{
      padding: "0.75rem 1rem",
      color: "#374151",
      verticalAlign: "top" as const,
    }}>
      {children}
    </td>
  ),

  // ── Horizontal Rule ───────────────────────────────────────────────────────
  hr: () => (
    <hr style={{
      margin: "1.5rem 0",
      border: "none",
      height: "2px",
      background: "linear-gradient(to right, transparent, #e5e7eb, transparent)",
    }} />
  ),

  // ── Links ─────────────────────────────────────────────────────────────────
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#2A63BF",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        fontWeight: 500,
      }}
    >
      {children}
    </a>
  ),

  // ── Strong / Em ───────────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong style={{ fontWeight: 700, color: "#1e3a6e" }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ fontStyle: "italic", color: "#4b5563" }}>{children}</em>
  ),
};

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 12px rgba(42,99,191,0.07)",
      overflow: "hidden",
    }}>
      {/* Branded gradient accent bar */}
      <div style={{
        height: "5px",
        background: "linear-gradient(90deg, #2A63BF 0%, #4a90d9 50%, #F5B942 100%)",
      }} />

      {/* Content area */}
      <div style={{ padding: "2rem 2.25rem" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
