import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface LessonContentProps {
  content: string;
  title?: string;
}

// Custom component map — every Markdown element gets a SkillSphere-branded style
const components: Components = {
  // ── Headings ──────────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-foreground mt-0 mb-4 pb-3 border-b border-border leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-foreground mt-8 mb-3 flex items-center gap-2">
      <span className="w-1 h-6 bg-primary rounded-full shrink-0" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mt-5 mb-2">
      {children}
    </h4>
  ),

  // ── Paragraph ─────────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="text-[0.9375rem] text-foreground/90 leading-relaxed mb-4">
      {children}
    </p>
  ),

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className="mb-4 space-y-1.5 pl-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 space-y-1.5 pl-0 list-none counter-reset-[item]">
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => {
    // Detect ordered list item by checking parent (node type)
    const isOrdered = (props as any).node?.parent?.type === "list" &&
      (props as any).node?.parent?.ordered;
    return isOrdered ? (
      <li className="flex gap-3 text-[0.9375rem] text-foreground/90 leading-relaxed">
        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
          {(props as any).index !== undefined ? (props as any).index + 1 : "•"}
        </span>
        <span className="flex-1">{children}</span>
      </li>
    ) : (
      <li className="flex gap-3 text-[0.9375rem] text-foreground/90 leading-relaxed">
        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
        <span className="flex-1">{children}</span>
      </li>
    );
  },

  // ── Blockquote ────────────────────────────────────────────────────────────
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-primary/40 bg-primary/5 rounded-r-lg py-3 pr-4 text-foreground/80 italic text-sm">
      {children}
    </blockquote>
  ),

  // ── Code ──────────────────────────────────────────────────────────────────
  code: ({ inline, children, ...props }: any) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[0.8125rem] font-mono font-medium">
        {children}
      </code>
    ) : (
      <code className="block bg-gray-900 text-green-300 rounded-lg p-4 text-sm font-mono overflow-x-auto leading-relaxed my-4">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="my-4 rounded-lg overflow-hidden">{children}</pre>
  ),

  // ── Table ─────────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-border shadow-sm">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary/8 border-b border-border">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-muted/40 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-foreground/90">{children}</td>
  ),

  // ── Horizontal Rule ───────────────────────────────────────────────────────
  hr: () => (
    <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  ),

  // ── Links ─────────────────────────────────────────────────────────────────
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium"
    >
      {children}
    </a>
  ),

  // ── Strong / Em ───────────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-foreground/80">{children}</em>
  ),
};

export default function LessonContent({ content, title }: LessonContentProps) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Lesson header accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-[#F5B942]" />

      <div className="p-6 md:p-8">
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
