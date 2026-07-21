import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Download, Printer, X, CheckCircle, AlertCircle, Eye } from "lucide-react";

const LOGO_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

interface CourseCertificateProps {
  open: boolean;
  onClose: () => void;
  learnerName: string;
  courseTitle: string;
  completionDate: Date;
  certificateId: string;
}

function escapeHtml(str: string) {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shared certificate visual — used both in preview and print HTML */
function CertPreview({
  displayName,
  courseTitle,
  formattedDate,
  certificateId,
  scale = 1,
}: {
  displayName: string;
  courseTitle: string;
  formattedDate: string;
  certificateId: string;
  scale?: number;
}) {
  const s = (base: number) => base * scale;
  return (
    <div
      style={{
        width: `${s(900)}px`,
        height: `${s(636)}px`,
        background: "linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 50%, #0d1b3e 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `${s(40)}px ${s(56)}px`,
        flexShrink: 0,
      }}
    >
      {/* Corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: `${s(160)}px`, height: `${s(160)}px`, background: "linear-gradient(135deg, rgba(245,185,66,0.3) 0%, transparent 60%)", borderRadius: `0 0 100% 0` }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: `${s(160)}px`, height: `${s(160)}px`, background: "linear-gradient(315deg, rgba(245,185,66,0.3) 0%, transparent 60%)", borderRadius: `100% 0 0 0` }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: `${s(100)}px`, height: `${s(100)}px`, background: "linear-gradient(225deg, rgba(42,99,191,0.5) 0%, transparent 60%)", borderRadius: `0 0 0 100%` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: `${s(100)}px`, height: `${s(100)}px`, background: "linear-gradient(45deg, rgba(42,99,191,0.5) 0%, transparent 60%)", borderRadius: `0 100% 0 0` }} />
      {/* Border frames */}
      <div style={{ position: "absolute", inset: `${s(14)}px`, border: `${s(2)}px solid rgba(245,185,66,0.55)`, borderRadius: `${s(10)}px`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: `${s(20)}px`, border: `${s(1)}px solid rgba(245,185,66,0.2)`, borderRadius: `${s(8)}px`, pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: `${s(12)}px`, marginBottom: `${s(12)}px` }}>
          <img src={LOGO_URL} alt="SkillSphere" style={{ width: `${s(52)}px`, height: `${s(52)}px`, borderRadius: "50%", border: `${s(2)}px solid rgba(245,185,66,0.7)` }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: `${s(20)}px`, fontWeight: 800, color: "#ffffff" }}>SkillSphere</div>
            <div style={{ fontSize: `${s(9)}px`, color: "#F5B942", letterSpacing: `${s(2)}px`, textTransform: "uppercase" }}>Empowering Skills. Building Futures.</div>
          </div>
        </div>

        <div style={{ width: `${s(70)}px`, height: `${s(2)}px`, background: "#F5B942", margin: `0 auto ${s(12)}px`, opacity: 0.7 }} />
        <div style={{ fontSize: `${s(10)}px`, letterSpacing: `${s(4)}px`, textTransform: "uppercase", color: "#F5B942", fontWeight: 600, marginBottom: `${s(8)}px` }}>Certificate of Completion</div>
        <div style={{ fontSize: `${s(12)}px`, color: "rgba(255,255,255,0.6)", fontFamily: "'Lato', sans-serif", marginBottom: `${s(6)}px` }}>This is to proudly certify that</div>

        {/* Learner name — solid gold, no webkit tricks */}
        <div style={{ fontSize: `${s(34)}px`, fontWeight: 700, color: "#F5B942", marginBottom: `${s(6)}px`, lineHeight: 1.15 }}>
          {displayName}
        </div>

        <div style={{ fontSize: `${s(12)}px`, color: "rgba(255,255,255,0.6)", fontFamily: "'Lato', sans-serif", marginBottom: `${s(8)}px` }}>has successfully completed the course</div>

        <div style={{ fontSize: `${s(17)}px`, fontWeight: 700, color: "#ffffff", padding: `${s(7)}px ${s(22)}px`, background: "rgba(245,185,66,0.13)", border: `${s(1)}px solid rgba(245,185,66,0.35)`, borderRadius: `${s(7)}px`, display: "inline-block" }}>
          {courseTitle}
        </div>

        <div style={{ width: `${s(100)}px`, height: `${s(1)}px`, background: "rgba(245,185,66,0.4)", margin: `${s(12)}px auto` }} />

        {/* Footer row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: `0 ${s(30)}px` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: `${s(13)}px`, fontWeight: 600, color: "#ffffff", marginBottom: `${s(2)}px` }}>{formattedDate}</div>
            <div style={{ width: `${s(90)}px`, height: `${s(1)}px`, background: "rgba(255,255,255,0.3)", margin: `${s(3)}px auto` }} />
            <div style={{ fontSize: `${s(9)}px`, color: "rgba(255,255,255,0.5)", letterSpacing: `${s(1)}px`, textTransform: "uppercase" }}>Date Issued</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: `${s(48)}px`, height: `${s(48)}px`, borderRadius: "50%", background: "linear-gradient(135deg, #F5B942, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", margin: `0 auto ${s(5)}px` }}>
              <svg width={s(22)} height={s(22)} viewBox="0 0 24 24" fill="none" stroke="#0d1b3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <div style={{ fontSize: `${s(8)}px`, color: "rgba(255,255,255,0.4)", letterSpacing: `${s(1.5)}px`, textTransform: "uppercase" }}>Verified</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: `${s(13)}px`, fontWeight: 600, color: "#ffffff", marginBottom: `${s(2)}px` }}>Dr. Vicki Bealman</div>
            <div style={{ width: `${s(90)}px`, height: `${s(1)}px`, background: "rgba(255,255,255,0.3)", margin: `${s(3)}px auto` }} />
            <div style={{ fontSize: `${s(9)}px`, color: "rgba(255,255,255,0.5)", letterSpacing: `${s(1)}px`, textTransform: "uppercase" }}>Issued By</div>
          </div>
        </div>

        <div style={{ marginTop: `${s(10)}px`, fontSize: `${s(8)}px`, color: "rgba(255,255,255,0.3)", letterSpacing: `${s(1)}px` }}>
          Certificate ID: {certificateId}
        </div>
      </div>
    </div>
  );
}

export default function CourseCertificate({
  open,
  onClose,
  learnerName,
  courseTitle,
  completionDate,
  certificateId,
}: CourseCertificateProps) {
  const [step, setStep] = useState<"preview" | "ready">("preview");
  const displayName = (learnerName ?? "").trim() || "Learner";

  const formattedDate = completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Reset to preview step when modal opens
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setStep("preview");
    else onClose();
  };

  function handlePrint() {
    const logoAbsoluteUrl = `${window.location.origin}${LOGO_URL}`;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SkillSphere Certificate — ${escapeHtml(displayName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 landscape; margin: 0; }
    html, body {
      width: 297mm; height: 210mm;
      background: #0d1b3e;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-family: 'Poppins', sans-serif;
    }
    .cert {
      width: 297mm; height: 210mm;
      background: linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 50%, #0d1b3e 100%);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative; overflow: hidden;
      padding: 30px 50px;
    }
    .c1{position:absolute;top:0;left:0;width:160px;height:160px;background:linear-gradient(135deg,rgba(245,185,66,0.3) 0%,transparent 60%);border-radius:0 0 100% 0;}
    .c2{position:absolute;bottom:0;right:0;width:160px;height:160px;background:linear-gradient(315deg,rgba(245,185,66,0.3) 0%,transparent 60%);border-radius:100% 0 0 0;}
    .c3{position:absolute;top:0;right:0;width:100px;height:100px;background:linear-gradient(225deg,rgba(42,99,191,0.5) 0%,transparent 60%);border-radius:0 0 0 100%;}
    .c4{position:absolute;bottom:0;left:0;width:100px;height:100px;background:linear-gradient(45deg,rgba(42,99,191,0.5) 0%,transparent 60%);border-radius:0 100% 0 0;}
    .b1{position:absolute;inset:14px;border:2px solid rgba(245,185,66,0.55);border-radius:10px;pointer-events:none;}
    .b2{position:absolute;inset:20px;border:1px solid rgba(245,185,66,0.2);border-radius:8px;pointer-events:none;}
    .content { position:relative;z-index:2;text-align:center;width:100%; }
    .header { display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px; }
    .logo { width:52px;height:52px;border-radius:50%;border:2px solid rgba(245,185,66,0.7); }
    .brand-name { font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px; }
    .brand-tag { font-size:9px;color:#F5B942;letter-spacing:2px;text-transform:uppercase; }
    .divider { width:70px;height:2px;background:#F5B942;margin:0 auto 12px;opacity:0.7; }
    .cert-label { font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#F5B942;font-weight:600;margin-bottom:8px; }
    .sub { font-size:12px;color:rgba(255,255,255,0.6);font-family:'Lato',sans-serif;margin-bottom:6px; }
    .name { font-size:34px;font-weight:700;color:#F5B942;margin-bottom:6px;line-height:1.15;letter-spacing:-0.3px; }
    .course-box { font-size:17px;font-weight:700;color:#ffffff;padding:7px 22px;background:rgba(245,185,66,0.13);border:1px solid rgba(245,185,66,0.35);border-radius:7px;display:inline-block;margin-bottom:4px; }
    .thin { width:100px;height:1px;background:rgba(245,185,66,0.4);margin:12px auto; }
    .footer { display:flex;justify-content:space-between;align-items:flex-end;padding:0 30px;width:100%; }
    .fcol { text-align:center; }
    .fval { font-size:13px;font-weight:600;color:#ffffff;margin-bottom:2px; }
    .fline { width:90px;height:1px;background:rgba(255,255,255,0.3);margin:3px auto; }
    .flabel { font-size:9px;color:rgba(255,255,255,0.5);letter-spacing:1px;text-transform:uppercase; }
    .medal { width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#F5B942,#e8a020);display:flex;align-items:center;justify-content:center;margin:0 auto 5px; }
    .cert-id { margin-top:10px;font-size:8px;color:rgba(255,255,255,0.3);letter-spacing:1px; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div>
    <div class="b1"></div><div class="b2"></div>
    <div class="content">
      <div class="header">
        <img src="${logoAbsoluteUrl}" class="logo" alt="SkillSphere" />
        <div style="text-align:left">
          <div class="brand-name">SkillSphere</div>
          <div class="brand-tag">Empowering Skills. Building Futures.</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="cert-label">Certificate of Completion</div>
      <div class="sub">This is to proudly certify that</div>
      <div class="name">${escapeHtml(displayName)}</div>
      <div class="sub">has successfully completed the course</div>
      <div class="course-box">${escapeHtml(courseTitle)}</div>
      <div class="thin"></div>
      <div class="footer">
        <div class="fcol">
          <div class="fval">${escapeHtml(formattedDate)}</div>
          <div class="fline"></div>
          <div class="flabel">Date Issued</div>
        </div>
        <div class="fcol">
          <div class="medal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d1b3e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
          <div style="font-size:8px;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;">Verified</div>
        </div>
        <div class="fcol">
          <div class="fval">Dr. Vicki Bealman</div>
          <div class="fline"></div>
          <div class="flabel">Issued By</div>
        </div>
      </div>
      <div class="cert-id">Certificate ID: ${escapeHtml(certificateId)}</div>
    </div>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to download your certificate.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 1000);
  }

  // Verification checklist items
  const checks = [
    { label: "Your Name", value: displayName, ok: displayName !== "Learner" },
    { label: "Course Title", value: courseTitle, ok: !!courseTitle },
    { label: "Completion Date", value: formattedDate, ok: true },
    { label: "Issued By", value: "Dr. Vicki Bealman", ok: true },
    { label: "Certificate ID", value: certificateId, ok: true },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent
        className="p-0 overflow-hidden border-0 shadow-2xl"
        style={{
          maxWidth: step === "preview" ? "680px" : "960px",
          background: step === "preview" ? "#0f172a" : "transparent",
          transition: "max-width 0.3s ease",
        }}
      >
        <DialogTitle className="sr-only">Course Certificate</DialogTitle>
        {step === "preview" ? (
          /* ── STEP 1: Verification Preview ── */
          <div className="flex flex-col" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: "linear-gradient(90deg, #0d1b3e, #1a2f6b)", borderBottom: "1px solid rgba(245,185,66,0.2)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(245,185,66,0.15)", border: "1px solid rgba(245,185,66,0.4)" }}>
                  <Eye className="h-4 w-4" style={{ color: "#F5B942" }} />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm">Verify Certificate Details</h2>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Confirm your information before downloading</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.08)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                <X className="h-3.5 w-3.5 text-white/70" />
              </button>
            </div>

            {/* Thumbnail preview */}
            <div className="px-6 pt-5 pb-3">
              <div
                className="rounded-xl overflow-hidden shadow-xl"
                style={{ border: "1px solid rgba(245,185,66,0.25)", transform: "scale(1)", transformOrigin: "top center" }}
              >
                <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "900px", height: "636px", marginBottom: `${-(636 * 0.38)}px`, marginRight: `${-(900 * 0.38)}px` }}>
                  <CertPreview
                    displayName={displayName}
                    courseTitle={courseTitle}
                    formattedDate={formattedDate}
                    certificateId={certificateId}
                    scale={1}
                  />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="px-6 pb-2">
              <p className="text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Certificate Details</p>
              <div className="grid grid-cols-1 gap-1.5">
                {checks.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: item.ok ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${item.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}
                  >
                    <div className="flex items-center gap-2">
                      {item.ok
                        ? <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#22c55e" }} />
                        : <AlertCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#ef4444" }} />
                      }
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-white truncate max-w-xs text-right">{item.value}</span>
                  </div>
                ))}
              </div>
              {!checks[0].ok && (
                <p className="text-xs mt-2 px-1" style={{ color: "#F5B942" }}>
                  ⚠ Your name is not set. Go to your Dashboard to add your full name before downloading.
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-between px-6 py-4 mt-1"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <button
                onClick={onClose}
                className="text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/20 bg-white/5 hover:bg-white/10"
                  onClick={() => setStep("ready")}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" /> Full Preview
                </Button>
                <Button
                  size="sm"
                  onClick={() => { setStep("ready"); setTimeout(handlePrint, 100); }}
                  style={{ background: "linear-gradient(90deg, #2A63BF, #1a4fa0)", color: "white" }}
                  className="hover:opacity-90 transition-opacity"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ── STEP 2: Full High-Res Preview ── */
          <div className="relative">
            {/* Floating action bar */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl"
              style={{ background: "rgba(13,27,62,0.95)", border: "1px solid rgba(245,185,66,0.3)", backdropFilter: "blur(12px)" }}
            >
              <span className="text-xs font-medium mr-1" style={{ color: "rgba(255,255,255,0.6)" }}>Certificate Preview</span>
              <div className="w-px h-4 bg-white/20" />
              <button
                onClick={() => setStep("preview")}
                className="text-xs px-2 py-1 rounded transition-colors"
                style={{ color: "rgba(255,255,255,0.5)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                ← Back to Verify
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #F5B942, #e8a020)", color: "#0d1b3e" }}
              >
                <Printer className="h-3 w-3" /> Print
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #2A63BF, #1a4fa0)", color: "white" }}
              >
                <Download className="h-3 w-3" /> Download PDF
              </button>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-1"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                <X className="h-3 w-3 text-white/70" />
              </button>
            </div>

            {/* Full-size certificate — fits dialog width */}
            <div className="overflow-hidden rounded-lg" style={{ border: "1px solid rgba(245,185,66,0.2)" }}>
              <div style={{ width: "100%", aspectRatio: "900/636", overflow: "hidden" }}>
                <div style={{ transform: "scale(1)", transformOrigin: "top left", width: "900px" }}>
                  <CertPreview
                    displayName={displayName}
                    courseTitle={courseTitle}
                    formattedDate={formattedDate}
                    certificateId={certificateId}
                    scale={1}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
