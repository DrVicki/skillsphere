import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Award, Download, Printer, X } from "lucide-react";

const LOGO_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

interface CourseCertificateProps {
  open: boolean;
  onClose: () => void;
  learnerName: string;
  courseTitle: string;
  completionDate: Date;
  certificateId: string;
}

export default function CourseCertificate({
  open,
  onClose,
  learnerName,
  courseTitle,
  completionDate,
  certificateId,
}: CourseCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const formattedDate = completionDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handlePrint() {
    const printContent = certRef.current?.innerHTML;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SkillSphere Certificate — ${courseTitle}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            @page { size: A4 landscape; margin: 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  }

  function handleDownload() {
    handlePrint();
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
              onClick={handleDownload}
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

          {/* Certificate */}
          <div ref={certRef}>
            <div
              style={{
                width: "100%",
                aspectRatio: "1.414 / 1",
                background: "linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 40%, #0d1b3e 100%)",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 64px",
              }}
            >
              {/* Decorative corner ornaments */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "180px", height: "180px", background: "linear-gradient(135deg, rgba(245,185,66,0.25) 0%, transparent 60%)", borderRadius: "0 0 100% 0" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "180px", height: "180px", background: "linear-gradient(315deg, rgba(245,185,66,0.25) 0%, transparent 60%)", borderRadius: "100% 0 0 0" }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: "linear-gradient(225deg, rgba(42,99,191,0.4) 0%, transparent 60%)", borderRadius: "0 0 0 100%" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "120px", height: "120px", background: "linear-gradient(45deg, rgba(42,99,191,0.4) 0%, transparent 60%)", borderRadius: "0 100% 0 0" }} />

              {/* Gold border frame */}
              <div style={{
                position: "absolute", inset: "16px",
                border: "2px solid rgba(245,185,66,0.5)",
                borderRadius: "12px",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: "22px",
                border: "1px solid rgba(245,185,66,0.2)",
                borderRadius: "10px",
                pointerEvents: "none",
              }} />

              {/* Watermark circles */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "380px", height: "380px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.04)", pointerEvents: "none" }} />

              {/* Content */}
              <div style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%" }}>

                {/* Header: Logo + Brand */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
                  <img
                    src={LOGO_URL}
                    alt="SkillSphere"
                    style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid rgba(245,185,66,0.6)", boxShadow: "0 0 20px rgba(245,185,66,0.3)" }}
                  />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "22px", fontWeight: 800, background: "linear-gradient(90deg, #ffffff, #F5B942)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.3px" }}>
                      SkillSphere
                    </div>
                    <div style={{ fontSize: "10px", color: "#F5B942", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 400 }}>
                      Empowering Skills. Building Futures.
                    </div>
                  </div>
                </div>

                {/* Gold divider */}
                <div style={{ width: "80px", height: "2px", background: "linear-gradient(90deg, transparent, #F5B942, transparent)", margin: "0 auto 18px" }} />

                {/* Certificate of Completion */}
                <div style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#F5B942", fontWeight: 600, marginBottom: "10px" }}>
                  Certificate of Completion
                </div>

                {/* "This certifies that" */}
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", fontFamily: "'Lato', sans-serif", marginBottom: "8px" }}>
                  This is to proudly certify that
                </div>

                {/* Learner Name */}
                <div style={{
                  fontSize: "38px",
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #ffffff 20%, #F5B942 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                }}>
                  {learnerName}
                </div>

                {/* "has successfully completed" */}
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", fontFamily: "'Lato', sans-serif", marginBottom: "10px" }}>
                  has successfully completed the course
                </div>

                {/* Course Title */}
                <div style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "6px",
                  padding: "8px 24px",
                  background: "rgba(245,185,66,0.12)",
                  border: "1px solid rgba(245,185,66,0.3)",
                  borderRadius: "8px",
                  display: "inline-block",
                }}>
                  {courseTitle}
                </div>

                {/* Gold divider */}
                <div style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(245,185,66,0.5), transparent)", margin: "18px auto" }} />

                {/* Footer: Date + Issuer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 40px" }}>
                  {/* Date */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "2px" }}>{formattedDate}</div>
                    <div style={{ width: "100px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "4px auto" }} />
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase" }}>Date Issued</div>
                  </div>

                  {/* Award icon center */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "linear-gradient(135deg, #F5B942, #e8a020)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px", boxShadow: "0 0 20px rgba(245,185,66,0.4)" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d1b3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Verified</div>
                  </div>

                  {/* Issuer */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginBottom: "2px" }}>Dr. Vicki Bealman</div>
                    <div style={{ width: "100px", height: "1px", background: "rgba(255,255,255,0.3)", margin: "4px auto" }} />
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase" }}>Issued By</div>
                  </div>
                </div>

                {/* Certificate ID */}
                <div style={{ marginTop: "14px", fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>
                  Certificate ID: {certificateId}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
