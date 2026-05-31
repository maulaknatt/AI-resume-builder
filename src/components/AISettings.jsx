import React, { useState } from "react";
import { Key, CheckCircle, AlertTriangle, Eye, EyeOff, ExternalLink } from "lucide-react";

export default function AISettings({ apiKey, onChangeApiKey }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="ai-settings-card animate-fade">
      <div className="ai-settings-header">
        <Key size={18} className="logo-icon" />
        <h3>Konfigurasi Gemini AI</h3>
      </div>
      
      <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
        Untuk menggunakan fitur AI (meningkatkan deskripsi CV & membuat Surat Lamaran), masukkan API Key Google Gemini Anda.
      </p>

      <div className="form-group" style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: "8px", position: "relative", alignItems: "center" }}>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onChangeApiKey(e.target.value)}
            placeholder="Masukkan AI Gemini API Key Anda..."
            style={{ paddingRight: "40px" }}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="no-print"
            style={{
              position: "absolute",
              right: "10px",
              background: "transparent",
              color: "var(--text-muted)",
              padding: "4px"
            }}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {apiKey ? (
            <span style={{ color: "var(--accent-color)", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
              <CheckCircle size={12} /> AI Aktif
            </span>
          ) : (
            <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600" }}>
              <AlertTriangle size={12} /> AI Tidak Aktif (Masukkan Key)
            </span>
          )}
        </span>

        <a
          href="https://aistudio.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--secondary-color)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "2px",
            fontWeight: "600"
          }}
          className="no-print"
        >
          Dapatkan API Key Gratis <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
