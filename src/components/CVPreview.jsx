import React, { useState } from "react";
import { Printer, Layout, Type, Palette } from "lucide-react";
import { ClassicATS, ModernMinimal, Executive, CreativeTech, AcademicScholar, MinimalistGrid, ElegantSerif, CompactProfessional, LeftTimeline, BoldSidebar } from "../templates/Templates";
import html2pdf from "html2pdf.js";

const TEMPLATE_OPTIONS = [
  { id: "ats", name: "1. Classic ATS" },
  { id: "minimal", name: "2. Modern Minimal" },
  { id: "executive", name: "3. Executive Premium" },
  { id: "creative", name: "4. Creative Tech" },
  { id: "academic", name: "5. Academic Scholar" },
  { id: "grid", name: "6. Minimalist Grid" },
  { id: "serif", name: "7. Elegant Serif" },
  { id: "compact", name: "8. Compact Professional" },
  { id: "timeline", name: "9. Left Timeline" },
  { id: "bold-sidebar", name: "10. Bold Sidebar" }
];

const FONT_OPTIONS = [
  { id: "var(--font-inter)", name: "1. Inter (Clean Sans)" },
  { id: "var(--font-outfit)", name: "2. Outfit (Geometric Sans)" },
  { id: "var(--font-plusjakartasans)", name: "3. Plus Jakarta Sans (Modern)" },
  { id: "var(--font-montserrat)", name: "4. Montserrat (Bold Geometric)" },
  { id: "var(--font-dmsans)", name: "5. DM Sans (Minimalist Sans)" },
  { id: "var(--font-lora)", name: "6. Lora (Elegant Serif)" },
  { id: "var(--font-merriweather)", name: "7. Merriweather (Warm Serif)" },
  { id: "var(--font-playfair)", name: "8. Playfair Display (Editorial)" },
  { id: "var(--font-cinzel)", name: "9. Cinzel (Classical Roman)" },
  { id: "var(--font-robotomono)", name: "10. Roboto Mono (Tech Monospace)" }
];

const COLOR_PRESETS = [
  { hex: "#6366f1", name: "Indigo" },
  { hex: "#1e293b", name: "Charcoal" },
  { hex: "#0d9488", name: "Teal" },
  { hex: "#e11d48", name: "Crimson" },
  { hex: "#4f46e5", name: "Royal Blue" }
];

export default function CVPreview({
  cvData,
  templateId,
  onChangeTemplate,
  fontFamily,
  onChangeFont,
  themeColor,
  onChangeColor
}) {
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPDF = () => {
    const element = document.querySelector(".cv-paper");
    if (!element) return;

    setPdfLoading(true);

    const name = cvData.personalInfo.fullName || "CV";
    const filename = `CV_${name.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

    // Temporarily switch to light mode so html2canvas reads dark-text computed styles
    const currentTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme");

    // Wait one frame for browser to recompute styles in light mode
    requestAnimationFrame(() => {
      const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { 
          scale: 2.5,
          useCORS: true,
          logging: false,
          letterRendering: true,
          onclone: (clonedDoc) => {
            clonedDoc.documentElement.removeAttribute("data-theme");
            const paper = clonedDoc.querySelector(".cv-paper");
            if (paper) {
              paper.style.setProperty("background", "#ffffff", "important");
            }
          }
        },
        jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          if (currentTheme) document.documentElement.setAttribute("data-theme", currentTheme);
          setPdfLoading(false);
        })
        .catch((err) => {
          console.error(err);
          if (currentTheme) document.documentElement.setAttribute("data-theme", currentTheme);
          setPdfLoading(false);
        });
    });
  };

  const renderTemplate = () => {
    switch (templateId) {
      case "minimal":
        return <ModernMinimal cvData={cvData} themeColor={themeColor} />;
      case "executive":
        return <Executive cvData={cvData} themeColor={themeColor} />;
      case "creative":
        return <CreativeTech cvData={cvData} themeColor={themeColor} />;
      case "academic":
        return <AcademicScholar cvData={cvData} themeColor={themeColor} />;
      case "grid":
        return <MinimalistGrid cvData={cvData} themeColor={themeColor} />;
      case "serif":
        return <ElegantSerif cvData={cvData} themeColor={themeColor} />;
      case "compact":
        return <CompactProfessional cvData={cvData} themeColor={themeColor} />;
      case "timeline":
        return <LeftTimeline cvData={cvData} themeColor={themeColor} />;
      case "bold-sidebar":
        return <BoldSidebar cvData={cvData} themeColor={themeColor} />;
      case "ats":
      default:
        return <ClassicATS cvData={cvData} themeColor={themeColor} />;
    }
  };

  return (
    <div className="preview-panel">
      {/* Visual Customize Panel */}
      <div className="preview-controls no-print animate-fade">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Kustomisasi CV</h3>
          <button 
            onClick={handleDownloadPDF} 
            disabled={pdfLoading}
            className="btn-primary" 
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            {pdfLoading ? (
              <>
                <span className="ai-spinner" /> Mengunduh...
              </>
            ) : (
              <>
                <Printer size={16} /> Unduh PDF Instan
              </>
            )}
          </button>
        </div>

        <div className="control-row">
          {/* Template Selector */}
          <div className="control-group">
            <label><Layout size={12} style={{ marginRight: "4px" }} /> Template</label>
            <select value={templateId} onChange={(e) => onChangeTemplate(e.target.value)}>
              {TEMPLATE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Selector */}
          <div className="control-group">
            <label><Type size={12} style={{ marginRight: "4px" }} /> Font</label>
            <select value={fontFamily} onChange={(e) => onChangeFont(e.target.value)}>
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Selector */}
          <div className="control-group" style={{ flex: "1.2" }}>
            <label><Palette size={12} style={{ marginRight: "4px" }} /> Warna Aksen</label>
            <div className="color-dots">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  className={`color-dot ${themeColor === color.hex ? "active" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => onChangeColor(color.hex)}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actual CV Paper Sheet */}
      <div className="cv-paper-container">
        <div
          className="cv-paper animate-fade"
          style={{ fontFamily: fontFamily }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
