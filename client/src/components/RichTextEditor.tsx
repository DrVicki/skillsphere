import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import { marked } from "marked";

// Convert Markdown to HTML if the content is not already HTML
function normalizeToHTML(content: string): string {
  if (!content || !content.trim()) return "";
  // If it already looks like HTML, return as-is
  if (/<[a-z][\s\S]*>/i.test(content.trim())) return content;
  // Otherwise parse as Markdown
  return marked.parse(content, { async: false }) as string;
}
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { normalizeEmbedContent } from "@/lib/embedContent";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Code2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  Minus, Undo, Redo, Highlighter,
  Pilcrow, Upload, Loader2, Video,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.querySelector("iframe")?.getAttribute("src"),
      },
      title: {
        default: "Embedded content",
        parseHTML: (element) => element.querySelector("iframe")?.getAttribute("title") ?? "Embedded content",
      },
      provider: {
        default: "Website",
        parseHTML: (element) => element.getAttribute("data-embed-provider") ?? "Website",
      },
      kind: {
        default: "website",
        parseHTML: (element) => element.getAttribute("data-embed-kind") ?? "website",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.rich-embed" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title, provider, kind } = HTMLAttributes;
    return [
      "div",
      mergeAttributes({
        class: "rich-embed",
        "data-embed-provider": provider,
        "data-embed-kind": kind,
      }),
      [
        "iframe",
        {
          src,
          title,
          loading: "lazy",
          referrerpolicy: "strict-origin-when-cross-origin",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowfullscreen: "true",
        },
      ],
    ];
  },
});

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          pressed={active}
          onPressedChange={() => onClick()}
          disabled={disabled}
          className={cn(
            "h-7 w-7 p-0 rounded-md transition-colors",
            active ? "bg-primary/15 text-primary" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
            disabled && "opacity-40 cursor-not-allowed"
          )}
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{title}</TooltipContent>
    </Tooltip>
  );
}

function ToolbarSep() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />;
}

export default function RichTextEditor({
  value, onChange, placeholder = "Start writing...", minHeight = "300px", className,
}: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [embedTitle, setEmbedTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline cursor-pointer" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full rounded-lg my-4" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Embed,
    ],
    content: normalizeToHTML(value),
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none px-5 py-4",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Sync external value changes (e.g. loading existing post)
  useEffect(() => {
    if (!editor) return;
    const normalized = normalizeToHTML(value);
    const current = editor.getHTML();
    if (normalized !== current && normalized !== "<p></p>" && normalized !== "") {
      editor.commands.setContent(normalized);
    }
  }, [value, editor]);

  const insertLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl) {
      const text = linkText || linkUrl;
      if (editor.state.selection.empty) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${text}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl, linkText]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
  }, [editor, imageUrl, imageAlt]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!editor) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, GIF, WebP, etc.)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const key = `editor-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const res = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
      toast.success("Image inserted!");
      setImageDialogOpen(false);
    } catch (err) {
      toast.error("Upload failed — please try again");
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [editor]);

  const handleToolbarUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const insertEmbed = useCallback(() => {
    if (!editor) return;
    try {
      const embed = normalizeEmbedContent(embedCode, embedTitle);
      editor.chain().focus().insertContent({
        type: "embed",
        attrs: embed,
      }).run();
      editor.chain().focus().insertContent("<p></p>").run();
      setEmbedDialogOpen(false);
      setEmbedCode("");
      setEmbedTitle("");
      toast.success(`${embed.provider} embed inserted`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add that embed.");
    }
  }, [editor, embedCode, embedTitle]);

  if (!editor) return null;

  return (
    <div className={cn("border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/60">
        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
          <Undo className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
          <Redo className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Pilcrow className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Inline formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>

        <ToolbarSep />

        {/* Insert */}
        <ToolbarButton
          onClick={() => {
            const existing = editor.getAttributes("link").href;
            setLinkUrl(existing ?? "");
            setLinkText("");
            setLinkDialogOpen(true);
          }}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        {/* Hidden file input for direct upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
        />
        {/* Upload image directly from disk */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={false}
              onPressedChange={handleToolbarUploadClick}
              disabled={imageUploading}
              className="h-7 w-7 p-0 rounded-md transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40"
            >
              {imageUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">Upload Image from Computer</TooltipContent>
        </Tooltip>
        {/* Insert image by URL */}
        <ToolbarButton
          onClick={() => { setImageUrl(""); setImageAlt(""); setImageTab("url"); setImageDialogOpen(true); }}
          title="Insert Image by URL"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => { setEmbedCode(""); setEmbedTitle(""); setEmbedDialogOpen(true); }}
          title="Embed Video, Slide, Form, or Website"
        >
          <Video className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={insertTable} title="Insert Table">
          <TableIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div
        className="cursor-text"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Word count footer */}
      <div className="px-5 py-1.5 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
        </p>
        <p className="text-[10px] text-gray-400">
          Tip: Select text, then click a format button to apply it
        </p>
      </div>

      {/* Link dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Insert Link</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs mb-1.5 block">URL *</Label>
              <Input
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={e => e.key === "Enter" && insertLink()}
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Link Text (optional — uses selection if empty)</Label>
              <Input
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                placeholder="Click here"
                onKeyDown={e => e.key === "Enter" && insertLink()}
              />
            </div>
          </div>
          <DialogFooter>
            {editor.isActive("link") && (
              <Button variant="ghost" className="text-red-500 mr-auto" onClick={() => { editor.chain().focus().unsetLink().run(); setLinkDialogOpen(false); }}>
                Remove Link
              </Button>
            )}
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={insertLink} disabled={!linkUrl}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed dialog */}
      <Dialog open={embedDialogOpen} onOpenChange={setEmbedDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Embed Interactive Content</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs leading-5 text-blue-900">
              Paste a public YouTube or Vimeo video, Google Slides or Google Forms link, a secure website URL, or the provider’s iframe snippet. The editor creates a responsive, privacy-conscious embed.
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Embed URL or iframe code *</Label>
              <textarea
                value={embedCode}
                onChange={e => setEmbedCode(e.target.value)}
                placeholder={'https://www.youtube.com/watch?v=...\n\nor paste <iframe ...></iframe>'}
                className="min-h-28 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Accessible title (optional)</Label>
              <Input
                value={embedTitle}
                onChange={e => setEmbedTitle(e.target.value)}
                placeholder="e.g. Module 1 walkthrough video"
                onKeyDown={e => e.key === "Enter" && insertEmbed()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmbedDialogOpen(false)}>Cancel</Button>
            <Button onClick={insertEmbed} disabled={!embedCode.trim()}>Insert Embed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Insert Image</DialogTitle></DialogHeader>
          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-1">
            <button
              type="button"
              onClick={() => setImageTab("upload")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                imageTab === "upload" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setImageTab("url")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                imageTab === "url" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Image URL
            </button>
          </div>

          {imageTab === "upload" ? (
            <div className="py-2">
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) { handleFileUpload(f); setImageDialogOpen(false); }
                }}
              >
                {imageUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-gray-500">Uploading…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">Click to choose a file</p>
                    <p className="text-xs text-gray-400">or drag & drop here</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP — max 10 MB</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs mb-1.5 block">Image URL *</Label>
                <Input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Alt Text</Label>
                <Input
                  value={imageAlt}
                  onChange={e => setImageAlt(e.target.value)}
                  placeholder="Image description"
                />
              </div>
              {imageUrl && (
                <img src={imageUrl} alt={imageAlt} className="w-full h-32 object-cover rounded-lg border" onError={e => (e.currentTarget.style.display = "none")} />
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>Cancel</Button>
            {imageTab === "url" && (
              <Button onClick={insertImage} disabled={!imageUrl}>Insert Image</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
