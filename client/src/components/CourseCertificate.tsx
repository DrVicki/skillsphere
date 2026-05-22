import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, Printer, X } from "lucide-react";

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

export default function CourseCertificate({
  open,
  onClose,
  learnerName,
  courseTitle,
  completionDate,
  certificateId,
}: CourseCertificateProps) {
  const displayName = (learnerName ?? "").trim() || "Learner";

  const formattedDate = completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handlePrint() {
    const logoAbsoluteUrl = `${window.location.origin}${LOGO_URL}`;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SkillSphere Certificate</title>
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
    /* Corners */
    .c1{position:absolute;top:0;left:0;width:160px;height:160px;background:linear-gradient(135deg,rgba(245,185,66,0.3) 0%,transparent 60%);border-radius:0 0 100% 0;}
    .c2{position:absolute;bottom:0;right:0;width:160px;height:160px;background:linear-gradient(315deg,rgba(245,185,66,0.3) 0%,transparent 60%);border-radius:100% 0 0 0;}
    .c3{position:absolute;top:0;right:0;width:100px;height:100px;background:linear-gradient(225deg,rgba(42,99,191,0.5) 0%,transparent 60%);border-radius:0 0 0 100%;}
    .c4{position:absolute;bottom:0;left:0;width:100px;height:100px;background:linear-gradient(45deg,rgba(42,99,191,0.5) 0%,transparent 60%);border-radius:0 100% 0 0;}
    /* Borders */
    .b1{position:absolute;inset:14px;border:2px solid rgba(245,185,66,0.55);border-radius:10px;pointer-events:none;}
    .b2{position:absolute;inset:20px;border:1px solid rgba(245,185,66,0.2);border-radius:8px;pointer-events:none;}
    /* Content */
    .content { position:relative;z-index:2;text-align:center;width:100%; }
    .header { display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px; }
    .logo { width:52px;height:52px;border-radius:50%;border:2px solid rgba(245,185,66,0.7); }
    .brand { text-align:left; }
    .brand-name { font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.3px; }
    .brand-tag { font-size:9px;color:#F5B942;letter-spacing:2px;text-transform:uppercase; }
    .divider { width:70px;height:2px;background:#F5B942;margin:0 auto 12px;opacity:0.7; }
    .cert-label { font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#F5B942;font-weight:600;margin-bottom:8px; }
    .sub { font-size:12px;color:rgba(255,255,255,0.6);font-family:'Lato',sans-serif;margin-bottom:6px; }
    /* THE NAME — solid gold, no gradients, no transparency */
    .name {
      font-size: 34px;
      font-weight: 700;
      color: #F5B942;
      margin-bottom: 6px;
      line-height: 1.15;
      letter-spacing: -0.3px;
    }
    .course-box {
      font-size:17px;font-weight:700;color:#ffffff;
      padding:7px 22px;
      background:rgba(245,185,66,0.13);
      border:1px solid rgba(245,185,66,0.35);
      border-radius:7px;display:inline-block;margin-bottom:4px;
    }
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
        <div class="brand">
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div className="relative">
          {/* Action buttons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-white/50 text-gray-700 shadow-md"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1.5" /> Print
            </Button>
            <Button
              size="sm"
              className="bg-[#2A63BF] hover:bg-[#2A63BF]/90 text-white shadow-md"
              onClick={handlePrint}
            >
              <Download className="h-4 w-4 mr-1.5" /> Download
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm hover:bg-white border-white/50 text-gray-700 shadow-md h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* On-screen certificate preview — uses same solid colors as print */}
          <div
            style={{
              width: "100%",
              aspectRatio: "1.414 / 1",
              background: "linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 50%, #0d1b3e 100%)",
              position: "relative",
              overflow: "hidden",
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 56px",
            }}
          >
            {/* Corners */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "160px", height: "160px", background: "linear-gradient(135deg, rgba(245,185,66,0.3) 0%, transparent 60%)", borderRadius: "0 0 100% 0" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "160px", height: "160px", background: "linear-gradient(315deg, rgba(245,185,66,0.3) 0%, transparent 60%)", borderRadius: "100% 0 0 0" }} />
            <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: "linear-gradient(225deg, rgba(42,99,191,0.5) 0%, transparent 60%)", borderRadius: "0 0 0 100%" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100px", height: "100px", background: "linear-gradient(45deg, rgba(42,99,191,0.5) 0%, transparent 60%)", borderRadius: "0 100% 0 0" }} />
            <div style={{ position: "absolute", inset: "14px", border: "2px solid rgba(245,185,66,0.55)", borderRadius: "10px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: "20px", border: "1px solid rgba(245,185,66,0.2)", borderRadius: "8px", pointerEvents: "none" }} />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "100%" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
                <img src={LOGO_URL} alt="SkillSphere" style={{ width: "52px", height: "52px", borderRadius: "50%", border: "2px solid rgba(245,185,66,0.7)" }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>SkillSphere</div>
                  <div style={{ fontSize: "9px", color: "#F5B942", letterSpacing: "2px", textTransform: "uppercase" }}>Empowering Skills. Building Futures.</div>
                </div>
              </div>

              <div style={{ width: "70px", height: "2px", background: "#F5B942", margin: "0 auto 12px", opacity: 0.7 }} />
              <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#F5B942", fontWeight: 600, marginBottom: "8px" }}>Certificate of Completion</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "'Lato', sans-serif", marginBottom: "6px" }}>This is to proudly certify that</div>

              {/* Learner name — solid gold, no webkit tricks */}
              <div style={{ fontSize: "34px", fontWeight: 700, color: "#F5B942", marginBottom: "6px", lineHeight: 1.15 }}>
                {displayName}
              </div>

              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "'Lato', sans-serif", marginBottom: "8px" }}>has successfully completed the course</div>

              <div style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", padding: "7px 22px", background: "rgba(245,185,66,0.13)", border: "1px solid rgba(245,185,66,0.35)", borderRadius: "7px", display: "inline-block" }}>
                {courseTitle}
              </div>

              <div style={{ width: "100px", height: "1px", background: "rgba(245,185,66,0.4)", margin: "12px auto" }} />

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 30px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", marginBottom: "2px" }}>{formattedDate}</div>
                  <div style={{ width: "90px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "3px auto" }} />
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase" }}>Date Issued</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #F5B942, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 5px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d1b3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Verified</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", marginBottom: "2px" }}>Dr. Vicki Bealman</div>
                  <div style={{ width: "90px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "3px auto" }} />
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase" }}>Issued By</div>
                </div>
              </div>

              <div style={{ marginTop: "10px", fontSize: "8px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>
                Certificate ID: {certificateId}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
