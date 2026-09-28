export type EmbedContent = {
  src: string;
  title: string;
  provider: "YouTube" | "Vimeo" | "Google Slides" | "Google Forms" | "Website";
  kind: "video" | "document" | "form" | "website";
};

function getIframeSource(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.toLowerCase().includes("<iframe")) return trimmed;

  const sourceMatch = trimmed.match(/<iframe\b[^>]*\ssrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i);
  if (!sourceMatch) {
    throw new Error("The iframe code needs a source URL.");
  }

  return (sourceMatch[1] ?? sourceMatch[2] ?? sourceMatch[3] ?? "").replace(/&amp;/g, "&");
}

function isHost(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function youtubeEmbed(url: URL): EmbedContent | null {
  const host = url.hostname.toLowerCase();
  let videoId = "";

  if (isHost(host, "youtu.be")) {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } else if (isHost(host, "youtube.com")) {
    if (url.pathname.startsWith("/embed/")) videoId = url.pathname.split("/")[2] ?? "";
    else if (url.pathname.startsWith("/shorts/")) videoId = url.pathname.split("/")[2] ?? "";
    else videoId = url.searchParams.get("v") ?? "";
  }

  if (!videoId) return null;

  const params = new URLSearchParams({ rel: "0", modestbranding: "1" });
  const start = url.searchParams.get("start") ?? url.searchParams.get("t");
  if (start && /^\d+$/.test(start)) params.set("start", start);

  return {
    src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`,
    title: "YouTube video",
    provider: "YouTube",
    kind: "video",
  };
}

function vimeoEmbed(url: URL): EmbedContent | null {
  const host = url.hostname.toLowerCase();
  if (!isHost(host, "vimeo.com")) return null;

  const videoId = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
  if (!videoId) return null;

  return {
    src: `https://player.vimeo.com/video/${videoId}`,
    title: "Vimeo video",
    provider: "Vimeo",
    kind: "video",
  };
}

function googleEmbed(url: URL): EmbedContent | null {
  const host = url.hostname.toLowerCase();
  if (!isHost(host, "docs.google.com")) return null;

  if (url.pathname.includes("/presentation/")) {
    const embedUrl = new URL(url.toString());
    if (!embedUrl.pathname.includes("/embed")) {
      embedUrl.pathname = embedUrl.pathname.replace(/\/(edit|present)(\/.*)?$/, "/embed");
      if (!embedUrl.pathname.endsWith("/embed")) embedUrl.pathname = `${embedUrl.pathname.replace(/\/$/, "")}/embed`;
    }
    if (!embedUrl.searchParams.has("start")) embedUrl.searchParams.set("start", "false");
    if (!embedUrl.searchParams.has("loop")) embedUrl.searchParams.set("loop", "false");
    return {
      src: embedUrl.toString(),
      title: "Google Slides presentation",
      provider: "Google Slides",
      kind: "document",
    };
  }

  if (url.pathname.includes("/forms/")) {
    const embedUrl = new URL(url.toString());
    embedUrl.searchParams.set("embedded", "true");
    return {
      src: embedUrl.toString(),
      title: "Google Form",
      provider: "Google Forms",
      kind: "form",
    };
  }

  return null;
}

/**
 * Converts a public URL or an iframe snippet into a normalized, safe iframe source.
 * Authoring controls own the iframe attributes; pasted markup is never stored verbatim.
 */
export function normalizeEmbedContent(input: string, customTitle?: string): EmbedContent {
  const rawSource = getIframeSource(input);
  if (!rawSource) throw new Error("Paste an embed URL or iframe snippet.");

  let url: URL;
  try {
    url = new URL(rawSource);
  } catch {
    throw new Error("Enter a complete HTTPS URL or a valid iframe snippet.");
  }

  if (url.protocol !== "https:") {
    throw new Error("Only secure HTTPS embed sources are allowed.");
  }

  const normalized = youtubeEmbed(url) ?? vimeoEmbed(url) ?? googleEmbed(url) ?? {
    src: url.toString(),
    title: "Embedded content",
    provider: "Website" as const,
    kind: "website" as const,
  };

  return {
    ...normalized,
    title: customTitle?.trim() || normalized.title,
  };
}
