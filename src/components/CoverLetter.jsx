import React, { useState } from "react";
import { Sparkles, Copy, Download, FileText, CheckCircle, Printer, Mail, Phone, MapPin, Globe } from "lucide-react";
import { generateCoverLetter } from "../services/gemini";
import html2pdf from "html2pdf.js";

export default function CoverLetter({ cvData, apiKey, addToast, fontFamily, themeColor }) {
  const [targetJob, setTargetJob] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: ""
  });
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field, value) => {
    setTargetJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateLetter = async () => {
    if (!apiKey) {
      addToast("Harap tambahkan VITE_GEMINI_API_KEY di file .env Anda.", "error");
      return;
    }
    if (!targetJob.jobTitle || !targetJob.companyName) {
      addToast("Harap isi Posisi Pekerjaan dan Nama Perusahaan tujuan.", "error");
      return;
    }

    setLoading(true);
    setCopied(false);
    try {
      const letter = await generateCoverLetter(apiKey, cvData, targetJob);
      setGeneratedLetter(letter);
      addToast("Surat Lamaran berhasil dibuat oleh AI!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    addToast("Surat Lamaran berhasil disalin ke clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!generatedLetter) return;
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);

    const name = cvData.personalInfo.fullName || "Pelamar";
    const company = targetJob.companyName || "Perusahaan";
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanCompany = company.replace(/[^a-zA-Z0-9]/g, "_");
    element.download = `Surat_Lamaran_${cleanName}_ke_${cleanCompany}.txt`;

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast("Surat Lamaran berhasil diunduh sebagai berkas teks!", "success");
  };

  const handleDownloadPDF = () => {
    const element = document.querySelector(".cl-paper");
    if (!element) return;

    setPdfLoading(true);

    const name = cvData.personalInfo.fullName || "Pelamar";
    const company = targetJob.companyName || "Perusahaan";
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "_");
    const cleanCompany = company.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Surat_Lamaran_${cleanName}_ke_${cleanCompany}.pdf`;

    // Temporarily switch to light mode so html2canvas reads dark-text computed styles
    const currentTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.removeAttribute("data-theme");

    // Wait one frame for browser to recompute styles in light mode
    requestAnimationFrame(() => {
      const opt = {
        margin: 0,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2.5,
          useCORS: true,
          logging: false,
          letterRendering: true,
          onclone: (clonedDoc) => {
            clonedDoc.documentElement.removeAttribute("data-theme");

            const editableDivs = clonedDoc.querySelectorAll("[contenteditable]");
            editableDivs.forEach(div => {
              div.removeAttribute("contenteditable");
              div.style.setProperty("color", "#000000", "important");
              div.style.setProperty("background", "transparent", "important");
            });

            const paper = clonedDoc.querySelector(".cl-paper") || clonedDoc.body.querySelector(".cl-paper") || clonedDoc.body.firstChild;
            if (paper) {
              paper.style.setProperty("color", "#000000", "important");
              paper.style.setProperty("background", "#ffffff", "important");
              const allElements = paper.querySelectorAll("*");
              allElements.forEach(el => {
                el.style.setProperty("color", "#000000", "important");
              });
            }
          }
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
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

  return (
    <div className="workspace-layout no-print">

      {/* LEFT COLUMN: Input Form & AI Trigger */}
      <div className="panel animate-fade cover-letter-section" style={{ minHeight: "550px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <FileText size={20} className="logo-icon" /> AI Pembuat Surat Lamaran
        </h3>

        <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
          Masukkan detail pekerjaan target untuk menghasilkan Surat Lamaran Kerja (Cover Letter) otomatis yang disesuaikan secara khusus dengan CV Anda.
        </p>

        {/* Target Job Info Form */}
        <div className="form-section">
          <div className="form-grid">
            <div className="form-group">
              <label>Posisi Pekerjaan Target</label>
              <input
                type="text"
                value={targetJob.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                placeholder="cth. Senior UX Designer"
              />
            </div>

            <div className="form-group">
              <label>Nama Perusahaan Target</label>
              <input
                type="text"
                value={targetJob.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="cth. PT. Makmur Sentosa"
              />
            </div>

            <div className="form-group full-width">
              <label>Deskripsi Lowongan / Kualifikasi (Opsional)</label>
              <textarea
                value={targetJob.jobDescription}
                onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                placeholder="Tempel deskripsi lowongan di sini agar AI dapat menyesuaikan Surat Lamaran dengan kata kunci lowongan..."
                rows={10}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateLetter}
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? (
              <>
                <span className="ai-spinner" /> Sedang Menulis Surat Lamaran...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Buat Surat Lamaran dengan AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Paper Preview & Toolbar */}
      <div className="preview-panel">

        {/* Output Toolbar (Visible only when generated) */}
        <div className="preview-controls animate-fade">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700" }}>Preview Surat Lamaran</h3>

            {generatedLetter && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleCopy}
                  className="btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  {copied ? <CheckCircle size={14} style={{ color: "var(--accent-color)" }} /> : <Copy size={14} />} {copied ? "Tersalin" : "Salin"}
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  Unduh (.txt)
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="btn-primary"
                  style={{ padding: "6px 14px", fontSize: "12px" }}
                >
                  {pdfLoading ? (
                    <>
                      <span className="ai-spinner" /> Mengunduh...
                    </>
                  ) : (
                    <>
                      <Printer size={14} /> Unduh PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Paper Sheet Preview container */}
        <div className="cv-paper-container">
          <div
            className="cv-paper cl-paper animate-fade"
            style={{
              fontFamily: fontFamily,
              padding: "15mm 12mm",
              background: "#ffffff",
              color: "#000000", // Force absolute dark color to prevent dark theme inheritance in PDF capture
              boxShadow: "var(--box-shadow)",
              minHeight: "1020px"
            }}
          >
            {/* Letter Body (Directly Editable on Paper!) */}
            {generatedLetter ? (
              <div
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => setGeneratedLetter(e.currentTarget.innerText)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  background: "transparent",
                  fontFamily: fontFamily,
                  fontSize: "12px",
                  lineHeight: "1.6",
                  color: "#000000",
                  whiteSpace: "pre-wrap",
                  minHeight: "750px",
                  padding: 0
                }}
              >
                {generatedLetter}
              </div>
            ) : (
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "12px",
                  fontStyle: "italic",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "650px",
                  textAlign: "center",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "8px",
                  padding: "40px"
                }}
              >
                Surat lamaran yang dihasilkan oleh AI akan tampil di sini secara otomatis dalam format kertas siap cetak, lengkap dengan header surat resmi Anda.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
