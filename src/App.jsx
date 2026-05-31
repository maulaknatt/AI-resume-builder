import React, { useState, useEffect } from "react";
import { 
  Sparkles, FileText, LayoutGrid, Sun, Moon, 
  Eye, Edit3, Smartphone, Laptop 
} from "lucide-react";
import CVForm from "./components/CVForm";
import CVPreview from "./components/CVPreview";
import CoverLetter from "./components/CoverLetter";
import "./App.css";

// Premium Initial Mock Data to "Wow" the User instantly
const INITIAL_CV_DATA = {
  personalInfo: {
    fullName: "Budi Santoso, S.Kom.",
    title: "Senior Software Engineer",
    email: "budi.santoso@email.com",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    website: "linkedin.com/in/budisantoso",
    summary: "Software Engineer berpengalaman lebih dari 5 tahun dalam merancang dan mengembangkan aplikasi web skala besar berkinerja tinggi. Memiliki keahlian mendalam dalam ekosistem React, Node.js, dan arsitektur cloud AWS. Berdedikasi tinggi untuk memimpin tim teknis, memecahkan masalah kompleks, dan menghasilkan solusi perangkat lunak yang bersih, optimal, dan berorientasi pengguna."
  },
  experiences: [
    {
      role: "Senior Software Engineer",
      company: "PT. Teknologi Digital Nusantara",
      duration: "Jan 2022 - Sekarang",
      description: "• Memimpin migrasi arsitektur monolith ke micro-frontend berbasis React, mempercepat waktu pemuatan halaman sebesar 40%.\n• Merancang dan membangun dashboard analitik real-time menggunakan WebSockets dan Canvas API, menangani lebih dari 50,000 pengguna aktif bulanan.\n• Mengembangkan CI/CD pipeline otomatis dengan GitHub Actions dan Docker, memangkas waktu deployment sebesar 25%.\n• Mengadakan sesi code review dan mentoring rutin bagi 5 developer junior guna menjaga standar penulisan kode bersih (clean code)."
    },
    {
      role: "Software Developer",
      company: "PT. Solusi Finansial Pratama",
      duration: "Agt 2019 - Des 2021",
      description: "• Mengembangkan modul transaksi aman untuk sistem pembayaran fintech terintegrasi, memproses volume transaksi harian sebesar Rp2 Miliar secara stabil.\n• Berkolaborasi erat dengan tim UI/UX untuk membangun library design system internal menggunakan CSS Modules, memangkas waktu rilis fitur baru hingga 35%.\n• Mengoptimalkan performa SEO situs utama, mendongkrak skor Core Web Vitals dari 55 menjadi 92 poin."
    }
  ],
  education: [
    {
      degree: "S1 Teknik Informatika",
      institution: "Universitas Indonesia",
      duration: "2015 - 2019",
      gpa: "3.82 / 4.00 (Lulusan Terbaik)"
    }
  ],
  skills: [
    "React.js",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "HTML5 & CSS3",
    "GraphQL",
    "Docker",
    "Git",
    "RESTful API",
    "Tailwind CSS"
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState("cv"); // "cv" | "coverletter"
  const [cvData, setCvData] = useState(() => {
    const saved = localStorage.getItem("ai_cv_builder_data");
    return saved ? JSON.parse(saved) : INITIAL_CV_DATA;
  });
  const [apiKey, setApiKey] = useState(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("ai_cv_builder_key") || "";
  });
  
  // Theme and Customization States
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ai_cv_builder_theme") || "dark";
  });
  const [templateId, setTemplateId] = useState("ats");
  const [fontFamily, setFontFamily] = useState("var(--font-body)");
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [activeStep, setActiveStep] = useState(0);

  // Mobile navigation tabs ("form" or "preview")
  const [mobileActiveView, setMobileActiveView] = useState("form");
  
  // Toast notifications list
  const [toasts, setToasts] = useState([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("ai_cv_builder_data", JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem("ai_cv_builder_key", apiKey);
  }, [apiKey]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ai_cv_builder_theme", theme);
  }, [theme]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    addToast(`Mode ${theme === "dark" ? "Terang" : "Gelap"} diaktifkan`, "success");
  };

  return (
    <div className="app-container">
      {/* Premium Navigation Header */}
      <header className="app-header">
        <div className="logo-section">
          <Sparkles className="logo-icon" size={24} />
          <h1>AI Resume Builder</h1>
        </div>

        <div className="header-actions no-print">
          {/* Main Module Selector (Segmented control style) */}
          <div className="section-selector">
            <button
              onClick={() => setActiveTab("cv")}
              className={`selector-tab ${activeTab === "cv" ? "active" : ""}`}
            >
              <LayoutGrid size={16} /> CV & Resume
            </button>
            <button
              onClick={() => setActiveTab("coverletter")}
              className={`selector-tab ${activeTab === "coverletter" ? "active" : ""}`}
            >
              <FileText size={16} /> Surat Lamaran
            </button>
          </div>

          <hr style={{ height: "24px", border: "none", borderLeft: "1px solid var(--border-color)", margin: "0 8px" }} />

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={`Ubah ke mode ${theme === "dark" ? "Terang" : "Gelap"}`}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher between Form Editor and Live Preview */}
      {activeTab === "cv" && (
        <div className="mobile-tab-switch no-print">
          <button
            onClick={() => setMobileActiveView("form")}
            className={`selector-tab ${mobileActiveView === "form" ? "active" : ""}`}
          >
            <Edit3 size={16} /> Edit Data
          </button>
          <button
            onClick={() => setMobileActiveView("preview")}
            className={`selector-tab ${mobileActiveView === "preview" ? "active" : ""}`}
          >
            <Eye size={16} /> Live Preview
          </button>
        </div>
      )}

      {/* Main Workspace Workspace */}
      <main className="workspace-layout">
        {activeTab === "cv" ? (
          <>
            {/* Form Wizard on Left */}
            <div className={`no-print ${mobileActiveView === "preview" ? "hide-on-mobile" : ""}`}>
              <CVForm
                cvData={cvData}
                onChangeCvData={setCvData}
                apiKey={apiKey}
                onChangeApiKey={setApiKey}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                addToast={addToast}
              />
            </div>

            {/* Paper Preview on Right */}
            <div className={mobileActiveView === "form" ? "hide-on-mobile" : ""}>
              <CVPreview
                cvData={cvData}
                templateId={templateId}
                onChangeTemplate={setTemplateId}
                fontFamily={fontFamily}
                onChangeFont={setFontFamily}
                themeColor={themeColor}
                onChangeColor={setThemeColor}
              />
            </div>
          </>
        ) : (
          <>
            {/* Cover Letter Section (Takes the full-width grid layout by being side-by-side or solo depending on need) */}
            <div style={{ gridColumn: "span 2" }}>
              <CoverLetter
                cvData={cvData}
                apiKey={apiKey}
                addToast={addToast}
                fontFamily={fontFamily}
                themeColor={themeColor}
              />
            </div>
          </>
        )}
      </main>

      {/* Premium Sticky Footer */}
      <footer className="app-footer no-print">
        <div className="footer-left">
          <span>Dibuat dengan</span>
          <span className="footer-heart">♥</span>
          <span>oleh <strong>@maulana bagus</strong></span>
        </div>
        <div className="footer-right">
          <a 
            href="https://github.com/maulaknatt/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-github-link"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="footer-github-icon"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>maulaknatt</span>
          </a>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <div className="toast-container no-print">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
