import React, { useState } from "react";
import { 
  User, Briefcase, GraduationCap, Award, Settings, 
  Plus, Trash2, Sparkles, ChevronRight, ChevronLeft, Check 
} from "lucide-react";

import { enhanceWorkExperience, generateProfessionalSummary } from "../services/gemini";

export default function CVForm({
  cvData,
  onChangeCvData,
  apiKey,
  onChangeApiKey,
  activeStep,
  setActiveStep,
  addToast
}) {
  const [newSkill, setNewSkill] = useState("");
  const [aiLoading, setAiLoading] = useState({
    summary: false,
    experience: {}
  });

  const steps = [
    { id: 0, name: "Data Diri", icon: <User size={16} /> },
    { id: 1, name: "Ringkasan", icon: <Award size={16} /> },
    { id: 2, name: "Pekerjaan", icon: <Briefcase size={16} /> },
    { id: 3, name: "Pendidikan", icon: <GraduationCap size={16} /> },
    { id: 4, name: "Keahlian", icon: <Settings size={16} /> }
  ];

  // Helper to update specific nested properties
  const updatePersonalInfo = (field, value) => {
    onChangeCvData({
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        [field]: value
      }
    });
  };

  // Summary AI Generator
  const handleGenerateSummary = async () => {
    if (!apiKey) {
      addToast("Harap masukkan API Key Gemini terlebih dahulu pada langkah Keahlian atau kotak konfigurasi.", "error");
      return;
    }
    setAiLoading(prev => ({ ...prev, summary: true }));
    try {
      const summary = await generateProfessionalSummary(apiKey, cvData);
      onChangeCvData({
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          summary
        }
      });
      addToast("Profil Profesional berhasil dibuat oleh AI!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setAiLoading(prev => ({ ...prev, summary: false }));
    }
  };

  // Experience handlers
  const handleAddExperience = () => {
    onChangeCvData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
        { role: "", company: "", duration: "", description: "" }
      ]
    });
  };

  const handleRemoveExperience = (index) => {
    const list = [...cvData.experiences];
    list.splice(index, 1);
    onChangeCvData({ ...cvData, experiences: list });
  };

  const handleUpdateExperience = (index, field, value) => {
    const list = [...cvData.experiences];
    list[index] = { ...list[index], [field]: value };
    onChangeCvData({ ...cvData, experiences: list });
  };

  // AI Work Experience Enhancer
  const handleEnhanceExperience = async (index) => {
    const item = cvData.experiences[index];
    if (!apiKey) {
      addToast("Harap masukkan API Key Gemini terlebih dahulu.", "error");
      return;
    }
    if (!item.role || !item.description) {
      addToast("Harap isi Judul Pekerjaan dan Deskripsi Pekerjaan terlebih dahulu.", "error");
      return;
    }

    setAiLoading(prev => ({
      ...prev,
      experience: { ...prev.experience, [index]: true }
    }));

    try {
      const enhancedText = await enhanceWorkExperience(apiKey, item.role, item.description);
      handleUpdateExperience(index, "description", enhancedText);
      addToast("Deskripsi pekerjaan berhasil dioptimalkan dengan STAR method!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setAiLoading(prev => ({
        ...prev,
        experience: { ...prev.experience, [index]: false }
      }));
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    onChangeCvData({
      ...cvData,
      education: [
        ...cvData.education,
        { degree: "", institution: "", duration: "", gpa: "" }
      ]
    });
  };

  const handleRemoveEducation = (index) => {
    const list = [...cvData.education];
    list.splice(index, 1);
    onChangeCvData({ ...cvData, education: list });
  };

  const handleUpdateEducation = (index, field, value) => {
    const list = [...cvData.education];
    list[index] = { ...list[index], [field]: value };
    onChangeCvData({ ...cvData, education: list });
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !cvData.skills.includes(skill)) {
      onChangeCvData({
        ...cvData,
        skills: [...cvData.skills, skill]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onChangeCvData({
      ...cvData,
      skills: cvData.skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="panel animate-fade">
      {/* Wizard Step Navigation */}
      <div className="wizard-header">
        <div className="step-indicator">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`step-dot ${activeStep === s.id ? "active" : activeStep > s.id ? "completed" : ""}`}
            >
              {activeStep > s.id ? <Check size={14} /> : s.id + 1}
              <span className="step-label">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      <hr style={{ borderColor: "var(--border-color)", opacity: 0.5, margin: "8px 0" }} />

      {/* STEP 1: Personal Info */}
      {activeStep === 0 && (
        <div className="form-section animate-slide">
          <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <User size={20} className="logo-icon" /> Data Pribadi
          </h3>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={cvData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                placeholder="cth. Budi Santoso"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Judul Profesional / Posisi</label>
              <input
                type="text"
                value={cvData.personalInfo.title}
                onChange={(e) => updatePersonalInfo("title", e.target.value)}
                placeholder="cth. Senior Frontend Developer"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={cvData.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="cth. budi@email.com"
              />
            </div>

            <div className="form-group">
              <label>Nomor Telepon</label>
              <input
                type="text"
                value={cvData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="cth. +62 812-3456-7890"
              />
            </div>

            <div className="form-group">
              <label>Lokasi / Alamat</label>
              <input
                type="text"
                value={cvData.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                placeholder="cth. Jakarta, Indonesia"
              />
            </div>

            <div className="form-group">
              <label>Website / LinkedIn</label>
              <input
                type="text"
                value={cvData.personalInfo.website}
                onChange={(e) => updatePersonalInfo("website", e.target.value)}
                placeholder="cth. linkedin.com/in/budi"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Summary */}
      {activeStep === 1 && (
        <div className="form-section animate-slide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <Award size={20} className="logo-icon" /> Ringkasan Karir
            </h3>
            
            <button
              onClick={handleGenerateSummary}
              disabled={aiLoading.summary}
              className="btn-ai-sparkle"
            >
              {aiLoading.summary ? (
                <>
                  <span className="ai-spinner" /> Membuat...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Tuliskan via AI
                </>
              )}
            </button>
          </div>
          
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Ringkasan karir adalah 3-4 kalimat pembuka yang menggambarkan kualifikasi terbaik Anda. Klik tombol "Tuliskan via AI" di atas untuk membuat profil otomatis berdasarkan data riwayat kerja Anda.
          </p>

          <div className="form-group">
            <textarea
              value={cvData.personalInfo.summary}
              onChange={(e) => updatePersonalInfo("summary", e.target.value)}
              placeholder="Ceritakan secara singkat kualifikasi terbaik Anda, keahlian utama, dan pencapaian profesional Anda..."
              rows={8}
            />
          </div>
        </div>
      )}

      {/* STEP 3: Experience */}
      {activeStep === 2 && (
        <div className="form-section animate-slide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase size={20} className="logo-icon" /> Riwayat Pekerjaan
            </h3>
            
            <button
              onClick={handleAddExperience}
              className="btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px" }}
            >
              <Plus size={14} /> Tambah Pekerjaan
            </button>
          </div>

          <div className="dynamic-list">
            {cvData.experiences.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                Belum ada riwayat pekerjaan. Klik tombol di atas untuk menambah.
              </p>
            ) : (
              cvData.experiences.map((exp, index) => (
                <div key={index} className="dynamic-item-card animate-fade">
                  <div className="card-header-actions">
                    <span className="card-title">Pekerjaan #{index + 1}</span>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="btn-remove"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Posisi / Peran</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleUpdateExperience(index, "role", e.target.value)}
                        placeholder="cth. Fullstack Engineer"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nama Perusahaan</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                        placeholder="cth. PT. Teknologi Maju"
                      />
                    </div>
                    <div className="form-group">
                      <label>Masa Kerja (Durasi)</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleUpdateExperience(index, "duration", e.target.value)}
                        placeholder="cth. Jan 2022 - Sekarang"
                      />
                    </div>
                    <div className="form-group" style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                      <button
                        onClick={() => handleEnhanceExperience(index)}
                        disabled={aiLoading.experience[index]}
                        className="btn-ai-sparkle"
                        style={{ alignSelf: "unset", width: "100%", justifyContent: "center" }}
                      >
                        {aiLoading.experience[index] ? (
                          <>
                            <span className="ai-spinner" /> Mengoptimalkan...
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} /> Optimalkan Bullet Points (AI)
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="form-group full-width">
                      <label>Tugas & Pencapaian Pekerjaan</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(index, "description", e.target.value)}
                        placeholder="Deskripsikan tanggung jawab utama dan pencapaian Anda. Gunakan bullet points '•' agar rapi..."
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* STEP 4: Education */}
      {activeStep === 3 && (
        <div className="form-section animate-slide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <GraduationCap size={20} className="logo-icon" /> Pendidikan
            </h3>
            
            <button
              onClick={handleAddEducation}
              className="btn-secondary"
              style={{ padding: "8px 14px", fontSize: "13px" }}
            >
              <Plus size={14} /> Tambah Pendidikan
            </button>
          </div>

          <div className="dynamic-list">
            {cvData.education.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                Belum ada riwayat pendidikan. Klik tombol di atas untuk menambah.
              </p>
            ) : (
              cvData.education.map((edu, index) => (
                <div key={index} className="dynamic-item-card animate-fade">
                  <div className="card-header-actions">
                    <span className="card-title">Pendidikan #{index + 1}</span>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="btn-remove"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Gelar / Program Studi</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                        placeholder="cth. S1 Teknik Informatika"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nama Instansi / Kampus</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(index, "institution", e.target.value)}
                        placeholder="cth. Universitas Indonesia"
                      />
                    </div>
                    <div className="form-group">
                      <label>Durasi Pendidikan</label>
                      <input
                        type="text"
                        value={edu.duration}
                        onChange={(e) => handleUpdateEducation(index, "duration", e.target.value)}
                        placeholder="cth. 2018 - 2022"
                      />
                    </div>
                    <div className="form-group">
                      <label>IPK / Nilai Akhir (Opsional)</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleUpdateEducation(index, "gpa", e.target.value)}
                        placeholder="cth. 3.75 / 4.00"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* STEP 5: Skills */}
      {activeStep === 4 && (
        <div className="form-section animate-slide">
          <h3 style={{ fontSize: "18px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
            <Settings size={20} className="logo-icon" /> Keahlian (Skills)
          </h3>

          <div className="form-group">
            <label>Keahlian (Skills)</label>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              Tulis keahlian Anda (cth. React, Project Management, Figma) lalu tekan Enter.
            </p>
            <div className="tag-container">
              {cvData.skills.map((skill, index) => (
                <span key={index} className="tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
              <form onSubmit={handleAddSkill} style={{ display: "contents" }}>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ketik skill + tekan enter..."
                  className="tag-input"
                />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="wizard-footer">
        <button
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          className="btn-secondary"
        >
          <ChevronLeft size={16} /> Kembali
        </button>

        {activeStep < steps.length - 1 ? (
          <button
            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
            className="btn-primary"
          >
            Lanjut <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => addToast("Semua data siap dicetak! Periksa live preview di kanan.", "success")}
            className="btn-primary"
            style={{ background: "linear-gradient(135deg, var(--accent-color), #16a34a)", boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)" }}
          >
            Selesai & Cetak <Check size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
