import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

/**
 * Standard Contact Ribbon Subcomponent to keep code DRY.
 */
function ContactRibbon({ personalInfo, themeColor, inline = false }) {
  const styles = inline 
    ? { display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#475569" }
    : { display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px", color: "#475569" };

  return (
    <div style={styles}>
      {personalInfo.email && (
        <span className="cv-contact-item" style={{ gap: "6px", display: "flex", alignItems: "center" }}>
          <Mail size={12} style={{ color: themeColor }} /> {personalInfo.email}
        </span>
      )}
      {personalInfo.phone && (
        <span className="cv-contact-item" style={{ gap: "6px", display: "flex", alignItems: "center" }}>
          <Phone size={12} style={{ color: themeColor }} /> {personalInfo.phone}
        </span>
      )}
      {personalInfo.location && (
        <span className="cv-contact-item" style={{ gap: "6px", display: "flex", alignItems: "center" }}>
          <MapPin size={12} style={{ color: themeColor }} /> {personalInfo.location}
        </span>
      )}
      {personalInfo.website && (
        <span className="cv-contact-item" style={{ gap: "6px", display: "flex", alignItems: "center" }}>
          <Globe size={12} style={{ color: themeColor }} /> {personalInfo.website}
        </span>
      )}
    </div>
  );
}

// ==========================================
// 1. CLASSIC ATS TEMPLATE
// ==========================================
export function ClassicATS({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div className="ats-layout" style={{ "--cv-theme-color": themeColor }}>
      <div className="cv-header">
        <h1 className="cv-header-name">{personalInfo.fullName || "NAMA LENGKAP ANDA"}</h1>
        <div className="cv-header-title" style={{ color: themeColor }}>
          {personalInfo.title || "Target Jabatan / Pekerjaan"}
        </div>
        <div className="cv-header-contacts" style={{ justifyContent: "center" }}>
          <ContactRibbon personalInfo={personalInfo} themeColor={themeColor} inline />
        </div>
      </div>
      {personalInfo.summary && (
        <div className="cv-section">
          <h2 className="cv-section-title" style={{ borderBottomColor: themeColor }}>Profil Profesional</h2>
          <p className="cv-summary-text">{personalInfo.summary}</p>
        </div>
      )}
      {experiences.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title" style={{ borderBottomColor: themeColor }}>Riwayat Pekerjaan</h2>
          <div className="cv-experience-list">
            {experiences.map((exp, index) => (
              <div key={index} className="cv-item experience-item">
                <div className="cv-item-header">
                  <div>
                    <span className="cv-item-role">{exp.role}</span>{" | "}
                    <span className="cv-item-company">{exp.company}</span>
                  </div>
                  <span className="cv-item-duration">{exp.duration}</span>
                </div>
                {exp.description && <div className="cv-item-description">{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {education.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title" style={{ borderBottomColor: themeColor }}>Pendidikan</h2>
          <div className="cv-education-list">
            {education.map((edu, index) => (
              <div key={index} className="cv-item education-item">
                <div className="cv-item-header">
                  <div>
                    <span className="cv-item-role">{edu.degree}</span>{" - "}
                    <span className="cv-item-company">{edu.institution}</span>
                  </div>
                  <span className="cv-item-duration">{edu.duration}</span>
                </div>
                {edu.gpa && <div className="cv-item-description">IPK: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {skills.length > 0 && (
        <div className="cv-section skills-section">
          <h2 className="cv-section-title" style={{ borderBottomColor: themeColor }}>Keahlian Utama</h2>
          <div className="cv-skills-grid">
            {skills.map((skill, index) => (
              <span key={index} className="cv-skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. MODERN MINIMAL TEMPLATE
// ==========================================
export function ModernMinimal({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div className="modern-grid" style={{ "--cv-theme-color": themeColor }}>
      <div className="modern-sidebar">
        <div>
          <h1 className="cv-header-name" style={{ fontSize: "22px", lineHeight: "1.2", marginBottom: "8px" }}>
            {personalInfo.fullName}
          </h1>
          <div className="cv-header-title" style={{ color: themeColor, fontSize: "13px", fontWeight: "700" }}>
            {personalInfo.title}
          </div>
        </div>
        <ContactRibbon personalInfo={personalInfo} themeColor={themeColor} />
        {skills.length > 0 && (
          <div style={{ marginTop: "10px" }} className="skills-section">
            <h3 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: themeColor, marginBottom: "8px", fontWeight: "700" }}>
              Keahlian
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {skills.map((skill, index) => (
                <span key={index} className="cv-skill-badge" style={{ width: "fit-content" }}>{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="modern-main">
        {personalInfo.summary && (
          <div className="cv-section">
            <h2 className="cv-section-title">Tentang Saya</h2>
            <p className="cv-summary-text">{personalInfo.summary}</p>
          </div>
        )}
        {experiences.length > 0 && (
          <div className="cv-section">
            <h2 className="cv-section-title">Pengalaman Kerja</h2>
            <div className="cv-experience-list">
              {experiences.map((exp, index) => (
                <div key={index} className="cv-item experience-item">
                  <div className="cv-item-header">
                    <div>
                      <span className="cv-item-role" style={{ color: themeColor }}>{exp.role}</span>{" di "}
                      <span className="cv-item-company">{exp.company}</span>
                    </div>
                    <span className="cv-item-duration">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <div className="cv-item-description" style={{ borderLeft: `2px solid ${themeColor}`, paddingLeft: "10px" }}>
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div className="cv-section">
            <h2 className="cv-section-title">Pendidikan</h2>
            <div className="cv-education-list">
              {education.map((edu, index) => (
                <div key={index} className="cv-item education-item">
                  <div className="cv-item-header">
                    <div>
                      <span className="cv-item-role">{edu.degree}</span>{" - "}
                      <span className="cv-item-company">{edu.institution}</span>
                    </div>
                    <span className="cv-item-duration">{edu.duration}</span>
                  </div>
                  {edu.gpa && <div className="cv-item-description">IPK: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. EXECUTIVE PREMIUM TEMPLATE
// ==========================================
export function Executive({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div className="executive-layout" style={{ "--cv-theme-color": themeColor }}>
      <div className="executive-header" style={{ background: themeColor }}>
        <h1 className="cv-header-name" style={{ color: "#ffffff", fontSize: "32px", fontWeight: "800" }}>
          {personalInfo.fullName}
        </h1>
        <div className="cv-header-title" style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px", fontWeight: "600", letterSpacing: "1px" }}>
          {personalInfo.title}
        </div>
        <div className="cv-header-contacts" style={{ color: "rgba(255, 255, 255, 0.85)", marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
          <ContactRibbon personalInfo={personalInfo} themeColor="#ffffff" inline />
        </div>
      </div>
      {personalInfo.summary && (
        <div className="cv-section" style={{ marginTop: "10px" }}>
          <h2 className="cv-section-title" style={{ color: themeColor }}>Profil Eksekutif</h2>
          <p className="cv-summary-text" style={{ fontStyle: "italic", fontSize: "13px" }}>"{personalInfo.summary}"</p>
        </div>
      )}
      {experiences.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title" style={{ color: themeColor }}>Pengalaman Karir</h2>
          <div className="cv-experience-list" style={{ gap: "20px" }}>
            {experiences.map((exp, index) => (
              <div key={index} className="cv-item experience-item">
                <div className="cv-item-header">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className="cv-item-role" style={{ fontSize: "14px", color: "#0f172a" }}>{exp.role}</span>
                    <span className="cv-item-company" style={{ color: themeColor, fontSize: "12px", fontWeight: "600" }}>{exp.company}</span>
                  </div>
                  <span className="cv-item-duration" style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>{exp.duration}</span>
                </div>
                {exp.description && <div className="cv-item-description" style={{ marginTop: "6px" }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {education.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title" style={{ color: themeColor }}>Pendidikan Resmi</h2>
          <div className="cv-education-list">
            {education.map((edu, index) => (
              <div key={index} className="cv-item education-item">
                <div className="cv-item-header">
                  <div>
                    <span className="cv-item-role" style={{ color: "#0f172a" }}>{edu.degree}</span>{" - "}
                    <span className="cv-item-company">{edu.institution}</span>
                  </div>
                  <span className="cv-item-duration">{edu.duration}</span>
                </div>
                {edu.gpa && <div className="cv-item-description">IPK: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {skills.length > 0 && (
        <div className="cv-section skills-section">
          <h2 className="cv-section-title" style={{ color: themeColor }}>Core Competencies</h2>
          <div className="cv-skills-grid">
            {skills.map((skill, index) => (
              <span key={index} className="cv-skill-badge" style={{ borderLeft: `3px solid ${themeColor}`, background: "#f8fafc" }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. CREATIVE TECH TEMPLATE
// ==========================================
export function CreativeTech({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
      <div>
        {/* Main Column Left */}
        <div style={{ borderBottom: `4px solid ${themeColor}`, paddingBottom: "16px", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-1px" }}>{personalInfo.fullName}</h1>
          <div style={{ fontSize: "14px", fontWeight: "700", color: themeColor, textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
            {personalInfo.title}
          </div>
        </div>
        {personalInfo.summary && (
          <div className="cv-section">
            <h2 className="cv-section-title" style={{ color: "#0f172a", borderBottom: `2px solid ${themeColor}` }}>Profil</h2>
            <p className="cv-summary-text">{personalInfo.summary}</p>
          </div>
        )}
        {experiences.length > 0 && (
          <div className="cv-section">
            <h2 className="cv-section-title" style={{ color: "#0f172a", borderBottom: `2px solid ${themeColor}` }}>Pengalaman</h2>
            <div className="cv-experience-list">
              {experiences.map((exp, index) => (
                <div key={index} className="cv-item experience-item" style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "13px" }}>
                    <span style={{ color: themeColor }}>{exp.role}</span>
                    <span style={{ color: "#64748b" }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>{exp.company}</div>
                  {exp.description && <div className="cv-item-description" style={{ paddingLeft: 0 }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Sidebar Right */}
      <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
        <div className="cv-section">
          <h3 style={{ fontSize: "12px", fontWeight: "800", color: themeColor, textTransform: "uppercase", marginBottom: "10px" }}>Kontak</h3>
          <ContactRibbon personalInfo={personalInfo} themeColor={themeColor} />
        </div>
        {skills.length > 0 && (
          <div className="cv-section skills-section" style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "800", color: themeColor, textTransform: "uppercase", marginBottom: "10px" }}>Keahlian</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skills.map((skill, index) => (
                <span key={index} className="cv-skill-badge" style={{ background: themeColor, color: "#ffffff", border: "none" }}>{skill}</span>
              ))}
            </div>
          </div>
        )}
        {education.length > 0 && (
          <div className="cv-section" style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "12px", fontWeight: "800", color: themeColor, textTransform: "uppercase", marginBottom: "10px" }}>Pendidikan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {education.map((edu, index) => (
                <div key={index} style={{ fontSize: "11px" }}>
                  <div style={{ fontWeight: "700", color: "#0f172a" }}>{edu.degree}</div>
                  <div style={{ color: "#475569" }}>{edu.institution}</div>
                  <div style={{ color: "#94a3b8" }}>{edu.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. ACADEMIC SCHOLAR TEMPLATE
// ==========================================
export function AcademicScholar({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div style={{ fontFamily: "var(--font-serif)", padding: "10px" }}>
      <div style={{ textAlign: "left", borderBottom: "1px double #475569", paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "32px", fontFamily: "var(--font-serif)", fontWeight: "500", color: "#000000" }}>{personalInfo.fullName}</h1>
        <div style={{ fontStyle: "italic", fontSize: "14px", color: "#475569", marginTop: "4px" }}>{personalInfo.title}</div>
        <div style={{ marginTop: "12px" }}>
          <ContactRibbon personalInfo={personalInfo} themeColor="#475569" inline />
        </div>
      </div>
      {personalInfo.summary && (
        <div className="cv-section">
          <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #000000", paddingBottom: "4px", marginBottom: "10px", fontFamily: "var(--font-serif)" }}>
            Ringkasan Akademik
          </h2>
          <p style={{ fontSize: "12.5px", color: "#111111", lineHeight: "1.6" }}>{personalInfo.summary}</p>
        </div>
      )}
      {education.length > 0 && (
        <div className="cv-section">
          <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #000000", paddingBottom: "4px", marginBottom: "10px", fontFamily: "var(--font-serif)" }}>
            Pendidikan & Kualifikasi
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {education.map((edu, index) => (
              <div key={index} style={{ fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                  <span>{edu.degree}</span>
                  <span>{edu.duration}</span>
                </div>
                <div style={{ fontStyle: "italic", color: "#334155" }}>{edu.institution}</div>
                {edu.gpa && <div style={{ fontSize: "11px", color: "#64748b" }}>IPK / Evaluasi: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {experiences.length > 0 && (
        <div className="cv-section" style={{ marginTop: "16px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #000000", paddingBottom: "4px", marginBottom: "10px", fontFamily: "var(--font-serif)" }}>
            Pengalaman Penelitian & Pekerjaan
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experiences.map((exp, index) => (
              <div key={index} style={{ fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                  <span>{exp.role}</span>
                  <span>{exp.duration}</span>
                </div>
                <div style={{ fontStyle: "italic", color: "#334155", marginBottom: "4px" }}>{exp.company}</div>
                {exp.description && <div style={{ fontSize: "11.5px", color: "#111111", paddingLeft: "10px" }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. MINIMALIST GRID TEMPLATE
// ==========================================
export function MinimalistGrid({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid #000", paddingBottom: "12px", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{personalInfo.fullName}</h1>
          <div style={{ fontSize: "13px", fontWeight: "600", color: themeColor, textTransform: "uppercase" }}>{personalInfo.title}</div>
        </div>
        <ContactRibbon personalInfo={personalInfo} themeColor="#475569" inline />
      </div>

      {/* Grid Summary */}
      {personalInfo.summary && (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: themeColor, textTransform: "uppercase", letterSpacing: "1px" }}>PROFIL</div>
          <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.5" }}>{personalInfo.summary}</div>
        </div>
      )}

      {/* Grid Work */}
      {experiences.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: themeColor, textTransform: "uppercase", letterSpacing: "1px" }}>PENGALAMAN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {experiences.map((exp, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "12.5px" }}>
                  <span>{exp.role} @ {exp.company}</span>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>{exp.duration}</span>
                </div>
                {exp.description && <div style={{ fontSize: "11.5px", color: "#475569", marginTop: "4px" }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Edu */}
      {education.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: themeColor, textTransform: "uppercase", letterSpacing: "1px" }}>PENDIDIKAN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu, index) => (
              <div key={index} style={{ fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                  <span>{edu.degree}</span>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>{edu.duration}</span>
                </div>
                <div style={{ color: "#475569" }}>{edu.institution} {edu.gpa && `(IPK: ${edu.gpa})`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Skills */}
      {skills.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: themeColor, textTransform: "uppercase", letterSpacing: "1px" }}>KEAHLIAN</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skills.map((skill, index) => (
              <span key={index} style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", color: "#334155", fontWeight: "600" }}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. ELEGANT SERIF TEMPLATE
// ==========================================
export function ElegantSerif({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div style={{ fontFamily: "var(--font-serif)", color: "#2d2424" }}>
      <div style={{ textAlign: "center", borderBottom: `2px solid ${themeColor}`, paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "32px", fontFamily: "var(--font-serif)", fontWeight: "600", color: "#1a0f0f", margin: 0 }}>{personalInfo.fullName}</h1>
        <div style={{ fontSize: "13px", fontWeight: "600", color: themeColor, letterSpacing: "2px", textTransform: "uppercase", marginTop: "6px" }}>{personalInfo.title}</div>
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "center" }}>
          <ContactRibbon personalInfo={personalInfo} themeColor={themeColor} inline />
        </div>
      </div>
      {personalInfo.summary && (
        <div className="cv-section" style={{ textAlign: "center" }}>
          <p style={{ fontStyle: "italic", fontSize: "13px", color: "#3a2f2f", lineHeight: "1.6", maxWidth: "680px", margin: "0 auto" }}>
            "{personalInfo.summary}"
          </p>
        </div>
      )}
      {experiences.length > 0 && (
        <div className="cv-section">
          <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px", color: themeColor, borderBottom: "1px solid #dcd6d6", paddingBottom: "4px", marginBottom: "12px", textAlign: "center", fontWeight: "700" }}>
            Pengalaman Profesional
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {experiences.map((exp, index) => (
              <div key={index} style={{ fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                  <span style={{ color: "#1a0f0f" }}>{exp.role} - <span style={{ fontWeight: "500", fontStyle: "italic" }}>{exp.company}</span></span>
                  <span style={{ color: "#5c4f4f" }}>{exp.duration}</span>
                </div>
                {exp.description && <div style={{ fontSize: "11.5px", color: "#3a2f2f", marginTop: "4px", lineHeight: "1.5" }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
      {education.length > 0 && (
        <div className="cv-section">
          <h2 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px", color: themeColor, borderBottom: "1px solid #dcd6d6", paddingBottom: "4px", marginBottom: "12px", textAlign: "center", fontWeight: "700" }}>
            Riwayat Pendidikan
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                <span><span style={{ fontWeight: "700" }}>{edu.degree}</span>, {edu.institution} {edu.gpa && `(IPK: ${edu.gpa})`}</span>
                <span style={{ color: "#5c4f4f" }}>{edu.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. COMPACT PROFESSIONAL TEMPLATE
// ==========================================
export function CompactProfessional({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div style={{ fontSize: "11px", lineHeight: "1.3" }}>
      {/* Header Inline */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1.5px solid ${themeColor}`, paddingBottom: "6px", marginBottom: "12px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#000", margin: 0 }}>{personalInfo.fullName}</h1>
          <div style={{ fontSize: "11px", fontWeight: "700", color: themeColor }}>{personalInfo.title}</div>
        </div>
        <ContactRibbon personalInfo={personalInfo} themeColor="#475569" inline />
      </div>

      {personalInfo.summary && (
        <div style={{ marginBottom: "10px" }}>
          <p style={{ color: "#1e293b", fontSize: "11px" }}>{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "800", borderBottom: `1px solid ${themeColor}`, paddingBottom: "2px", color: themeColor, textTransform: "uppercase", marginBottom: "6px" }}>
            Pengalaman Kerja
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {experiences.map((exp, index) => (
              <div key={index}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
                  <span>{exp.role} @ {exp.company}</span>
                  <span>{exp.duration}</span>
                </div>
                {exp.description && <div style={{ color: "#334155", fontSize: "10.5px", paddingLeft: "6px" }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h3 style={{ fontSize: "11px", fontWeight: "800", borderBottom: `1px solid ${themeColor}`, paddingBottom: "2px", color: themeColor, textTransform: "uppercase", marginBottom: "6px" }}>
            Pendidikan
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {education.map((edu, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                <span><strong>{edu.degree}</strong> - {edu.institution} {edu.gpa && `(IPK: ${edu.gpa})`}</span>
                <span>{edu.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h3 style={{ fontSize: "11px", fontWeight: "800", borderBottom: `1px solid ${themeColor}`, paddingBottom: "2px", color: themeColor, textTransform: "uppercase", marginBottom: "6px" }}>
            Keahlian Utama
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {skills.map((skill, index) => (
              <span key={index} style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "3px", fontSize: "10px", color: "#334155" }}>{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. LEFT TIMELINE TEMPLATE
// ==========================================
export function LeftTimeline({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div style={{ "--cv-theme-color": themeColor }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#000", margin: 0 }}>{personalInfo.fullName}</h1>
          <div style={{ fontSize: "13px", fontWeight: "700", color: themeColor, textTransform: "uppercase", marginTop: "2px" }}>{personalInfo.title}</div>
        </div>
        <ContactRibbon personalInfo={personalInfo} themeColor="#475569" />
      </div>

      {personalInfo.summary && (
        <div className="cv-section">
          <p className="cv-summary-text">{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title" style={{ borderBottomColor: themeColor }}>Timeline Pekerjaan</h2>
          <div style={{ display: "flex", flexDirection: "column", borderLeft: `2px solid ${themeColor}`, marginLeft: "10px", paddingLeft: "20px", gap: "20px" }}>
            {experiences.map((exp, index) => (
              <div key={index} style={{ position: "relative" }}>
                {/* Visual Bullet dot on timeline */}
                <div style={{ position: "absolute", left: "-27px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: themeColor, border: "2px solid #ffffff", boxShadow: "0 0 0 2px " + themeColor }} />
                
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "13px" }}>
                  <span style={{ color: "#0f172a" }}>{exp.role} <span style={{ fontWeight: "500", color: "#475569" }}>di {exp.company}</span></span>
                  <span style={{ color: themeColor, fontSize: "12px" }}>{exp.duration}</span>
                </div>
                {exp.description && <div className="cv-item-description" style={{ paddingLeft: 0, marginTop: "6px" }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="cv-section" style={{ marginTop: "20px" }}>
          <h2 className="cv-section-title" style={{ borderBottomColor: themeColor }}>Pendidikan</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu, index) => (
              <div key={index} className="cv-item" style={{ borderLeft: "2px solid #cbd5e1", paddingLeft: "12px" }}>
                <div className="cv-item-header">
                  <span className="cv-item-role">{edu.degree}</span>
                  <span className="cv-item-duration">{edu.duration}</span>
                </div>
                <div className="cv-item-company">{edu.institution} {edu.gpa && `(IPK: ${edu.gpa})`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. BOLD SIDEBAR TEMPLATE
// ==========================================
export function BoldSidebar({ cvData, themeColor }) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", margin: "-40px", minHeight: "1020px" }}>
      {/* Dark Sidebar Left */}
      <div style={{ background: themeColor, color: "#ffffff", padding: "40px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#ffffff", margin: 0, lineHeight: "1.1" }}>{personalInfo.fullName}</h1>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255, 255, 255, 0.8)", textTransform: "uppercase", marginTop: "8px", letterSpacing: "1px" }}>
            {personalInfo.title}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255, 255, 255, 0.6)", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "4px", marginBottom: "12px" }}>
            Kontak
          </h3>
          <ContactRibbon personalInfo={personalInfo} themeColor="#ffffff" />
        </div>

        {skills.length > 0 && (
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255, 255, 255, 0.6)", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "4px", marginBottom: "12px" }}>
              Keahlian
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {skills.map((skill, index) => (
                <span key={index} style={{ fontSize: "11px", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "4px", width: "fit-content" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Right */}
      <div style={{ padding: "40px", background: "#ffffff", color: "#1e293b", display: "flex", flexDirection: "column", gap: "24px" }}>
        {personalInfo.summary && (
          <div className="cv-section">
            <h2 className="cv-section-title" style={{ color: themeColor, borderBottomColor: "#e2e8f0" }}>Tentang Saya</h2>
            <p className="cv-summary-text">{personalInfo.summary}</p>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="cv-section">
            <h2 className="cv-section-title" style={{ color: themeColor, borderBottomColor: "#e2e8f0" }}>Pengalaman Kerja</h2>
            <div className="cv-experience-list">
              {experiences.map((exp, index) => (
                <div key={index} className="cv-item experience-item">
                  <div className="cv-item-header">
                    <div>
                      <span className="cv-item-role" style={{ color: themeColor }}>{exp.role}</span>{" di "}
                      <span className="cv-item-company">{exp.company}</span>
                    </div>
                    <span className="cv-item-duration">{exp.duration}</span>
                  </div>
                  {exp.description && <div className="cv-item-description" style={{ paddingLeft: 0 }}>{exp.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="cv-section">
            <h2 className="cv-section-title" style={{ color: themeColor, borderBottomColor: "#e2e8f0" }}>Pendidikan</h2>
            <div className="cv-education-list">
              {education.map((edu, index) => (
                <div key={index} className="cv-item education-item">
                  <div className="cv-item-header">
                    <div>
                      <span className="cv-item-role">{edu.degree}</span>{" - "}
                      <span className="cv-item-company">{edu.institution}</span>
                    </div>
                    <span className="cv-item-duration">{edu.duration}</span>
                  </div>
                  {edu.gpa && <div className="cv-item-description">IPK: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
