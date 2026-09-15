type CourseEmailRecipient = {
  name?: string | null;
  email?: string | null;
};

type CourseEmail = {
  title: string;
  slug: string;
};

const FALLBACK_SITE_ORIGIN = "https://myskillsphere.com";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function courseUrl(course: CourseEmail, origin?: string) {
  try {
    const parsed = new URL(origin ?? FALLBACK_SITE_ORIGIN);
    const approvedHost = parsed.hostname === "myskillsphere.com" || parsed.hostname === "skillsphere-swswjrvl.manus.space";
    if (approvedHost && (parsed.protocol === "https:" || parsed.protocol === "http:")) {
      return `${parsed.origin}/learn/${encodeURIComponent(course.slug)}`;
    }
  } catch {
    // Use the production site URL when an origin is not available (e.g., a payment webhook).
  }
  return `${FALLBACK_SITE_ORIGIN}/learn/${encodeURIComponent(course.slug)}`;
}

async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: {
  to?: string | null;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "SkillSphere <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      console.error("[Email] Resend rejected transactional email", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Email] Transactional delivery failed", error);
    return false;
  }
}

export async function sendEnrollmentEmail(recipient: CourseEmailRecipient, course: CourseEmail, origin?: string) {
  const learnerName = recipient.name?.trim() || "there";
  const url = courseUrl(course, origin);
  const title = escapeHtml(course.title);
  return sendTransactionalEmail({
    to: recipient.email,
    subject: `You’re enrolled in ${course.title} | SkillSphere`,
    text: `Hi ${learnerName},\n\nYou’re enrolled in ${course.title}. Your learning space is ready whenever you are.\n\nStart learning: ${url}\n\nSkillSphere\nEmpowering Skills. Building Futures.`,
    html: `<main style="font-family:Arial,sans-serif;color:#13284b;max-width:600px;margin:0 auto;padding:32px 24px"><p style="margin:0 0 24px;color:#2A63BF;font-weight:700;font-size:18px">SkillSphere</p><h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Welcome to your course, ${escapeHtml(learnerName)}.</h1><p style="font-size:16px;line-height:1.6">You’re officially enrolled in <strong>${title}</strong>. Your learning space is ready whenever you are.</p><p style="margin:28px 0"><a href="${url}" style="background:#2A63BF;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:700;display:inline-block">Start Learning</a></p><p style="font-size:14px;color:#5d6878;line-height:1.5">SkillSphere · Empowering Skills. Building Futures.</p></main>`,
  });
}

export async function sendCompletionEmail(recipient: CourseEmailRecipient, course: CourseEmail, origin?: string) {
  const learnerName = recipient.name?.trim() || "there";
  const url = courseUrl(course, origin);
  const title = escapeHtml(course.title);
  return sendTransactionalEmail({
    to: recipient.email,
    subject: `Congratulations — you completed ${course.title}! | SkillSphere`,
    text: `Congratulations ${learnerName}!\n\nYou completed ${course.title}. Your SkillSphere course certificate is now available.\n\nView your course and certificate: ${url}\n\nSkillSphere\nEmpowering Skills. Building Futures.`,
    html: `<main style="font-family:Arial,sans-serif;color:#13284b;max-width:600px;margin:0 auto;padding:32px 24px"><p style="margin:0 0 24px;color:#2A63BF;font-weight:700;font-size:18px">SkillSphere</p><h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Congratulations, ${escapeHtml(learnerName)}!</h1><p style="font-size:16px;line-height:1.6">You completed <strong>${title}</strong>. Your certificate is now available in your course learning space.</p><p style="margin:28px 0"><a href="${url}" style="background:#F5B942;color:#13284b;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:700;display:inline-block">View Certificate</a></p><p style="font-size:14px;color:#5d6878;line-height:1.5">SkillSphere · Empowering Skills. Building Futures.</p></main>`,
  });
}
