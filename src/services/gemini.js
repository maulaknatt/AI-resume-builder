/**
 * Service to interact with the Google Gemini API using direct REST calls.
 * This avoids external dependency issues and ensures lightweight execution.
 */

// List of potential endpoints and model configurations to try sequentially
const GEMINI_CONFIGS = [
  // Stable v1 models (highest production reliability)
  { version: "v1", model: "gemini-1.5-flash" },
  { version: "v1", model: "gemini-1.5-pro" },
  
  // Beta v1beta models
  { version: "v1beta", model: "gemini-1.5-flash" },
  { version: "v1beta", model: "gemini-2.0-flash" },
  { version: "v1beta", model: "gemini-2.5-flash" },
  { version: "v1beta", model: "gemini-1.5-pro" },
  { version: "v1beta", model: "gemini-2.5-pro" }
];

/**
 * Call the Gemini API generateContent endpoint with an adaptive fallback mechanism.
 * @param {string} apiKey - Google Gemini API Key
 * @param {string} prompt - Prompt to send
 * @returns {Promise<string>} Generated text
 */
async function callGemini(apiKey, prompt) {
  if (!apiKey) {
    throw new Error("API Key Gemini belum diatur. Harap masukkan API Key di pengaturan.");
  }

  let lastError = null;

  for (const config of GEMINI_CONFIGS) {
    try {
      const url = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      // If we get a 404 (model or version not found/supported), we try the next configuration
      if (response.status === 404) {
        lastError = new Error(`Model ${config.model} tidak ditemukan di endpoint ${config.version}.`);
        continue; 
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `HTTP error! status: ${response.status}`;
        lastError = new Error(message);
        
        // If the API key itself is dead/invalid, throw immediately. Otherwise, continue to try other models.
        const messageLower = message.toLowerCase();
        const isDeadKey = 
          messageLower.includes("key not found") || 
          messageLower.includes("api key not valid") || 
          (messageLower.includes("api key") && (messageLower.includes("invalid") || messageLower.includes("expired")));

        if (isDeadKey) {
          throw lastError;
        }
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("AI tidak mengembalikan teks hasil. Coba lagi.");
      }

      return text.trim();
    } catch (err) {
      // If we explicitly threw a dead key error, propagate it
      const errLower = err.message.toLowerCase();
      const isDeadKey = 
        errLower.includes("key not found") || 
        errLower.includes("api key not valid") || 
        (errLower.includes("api key") && (errLower.includes("invalid") || errLower.includes("expired")));

      if (isDeadKey) {
        throw err;
      }
      
      lastError = err;
      // Continue trying next config
    }
  }

  // If all configs failed, throw the final aggregated error
  throw new Error(`Gagal memproses dengan AI: ${lastError ? lastError.message : "Semua opsi model tidak tersedia."}`);
}

/**
 * Enhance a job description using action verbs and the STAR method.
 * @param {string} apiKey
 * @param {string} role - Job title/role
 * @param {string} description - Raw job description
 * @returns {Promise<string>} Enhanced text
 */
export async function enhanceWorkExperience(apiKey, role, description) {
  const prompt = `
Anda adalah seorang konsultan karir profesional dan ahli penulisan resume standar ATS internasional.
Tugas Anda adalah memperbagus deskripsi pekerjaan berikut untuk peran "${role}".

Deskripsi Pekerjaan Mentah:
"${description}"

Aturan Penulisan:
1. Gunakan Bahasa Indonesia yang sangat profesional dan elegan.
2. Tuliskan dalam bentuk bullet points (gunakan karakter '•' atau bullet point standar).
3. Gunakan kata kerja aksi yang kuat (misal: "Mengoptimalkan", "Memimpin", "Mengembangkan", "Merancang", "Meningkatkan").
4. Terapkan prinsip STAR (Situation, Task, Action, Result) jika memungkinkan. Tunjukkan pencapaian kuantitatif atau kualitatif yang konkret.
5. Jangan gunakan kalimat pengantar seperti "Berikut adalah versi yang ditingkatkan:". Langsung berikan poin-poin hasil akhirnya saja.
6. Buat sekitar 3-4 bullet points yang padat, berbobot, dan mudah dibaca oleh HRD maupun sistem ATS.
`;

  return callGemini(apiKey, prompt);
}

/**
 * Generate a professional summary based on personal info, experience, and skills.
 * @param {string} apiKey
 * @param {object} cvData - Full CV data
 * @returns {Promise<string>} Compelling professional summary
 */
export async function generateProfessionalSummary(apiKey, cvData) {
  const { personalInfo, experiences = [], education = [], skills = [] } = cvData;

  const expSummary = experiences
    .map((e) => `- ${e.role} di ${e.company} (${e.duration}): ${e.description}`)
    .join("\n");
  const eduSummary = education
    .map((e) => `- ${e.degree} dari ${e.institution}`)
    .join("\n");
  const skillsList = skills.join(", ");

  const prompt = `
Anda adalah konsultan karir profesional tingkat tinggi.
Tugas Anda adalah membuat ringkasan profil profesional (Professional Summary) sepanjang 3-4 kalimat (maksimal 100 kata) yang menarik dan persuasif untuk ditaruh di bagian atas CV.

Berikut data profil pelamar:
- Nama: ${personalInfo.fullName}
- Jabatan/Target Peran: ${personalInfo.title}
- Pengalaman Kerja:
${expSummary || "Belum ada pengalaman kerja"}
- Pendidikan:
${eduSummary || "Belum ada riwayat pendidikan"}
- Keahlian Utama: ${skillsList || "Belum ada keahlian"}

Aturan Penulisan:
1. Gunakan Bahasa Indonesia yang profesional, percaya diri, dan persuasif.
2. Deskripsikan gabungan antara pengalaman terkuat, keahlian utama, dan nilai tambah yang bisa dibawa oleh pelamar ini ke perusahaan target.
3. Langsung berikan teks profil tanpa kalimat pembuka atau tanda kutip tambahan. Jangan ada penjelasan seperti "Berikut ringkasan profil Anda:".
`;

  return callGemini(apiKey, prompt);
}

/**
 * Generate a tailored cover letter.
 * @param {string} apiKey
 * @param {object} cvData - Full CV data
 * @param {object} targetJob - Details about target job
 * @returns {Promise<string>} Cover letter text
 */
export async function generateCoverLetter(apiKey, cvData, targetJob) {
  const { personalInfo, experiences = [], skills = [] } = cvData;
  const { jobTitle, companyName, jobDescription } = targetJob;

  const expSummary = experiences
    .map((e) => `- ${e.role} di ${e.company} (${e.duration}): ${e.description}`)
    .join("\n");
  const skillsList = skills.join(", ");

  const prompt = `
Anda adalah seorang ahli penulisan surat lamaran kerja (Cover Letter) profesional.
Tugas Anda adalah menulis surat lamaran yang sangat menarik, disesuaikan (tailored), dan elegan untuk melamar ke posisi berikut:

Posisi Target: ${jobTitle}
Nama Perusahaan: ${companyName}
Deskripsi Lowongan Pekerjaan:
"${jobDescription || "Mencari kandidat profesional yang kompeten untuk posisi tersebut."}"

Profil Singkat Pelamar:
- Nama: ${personalInfo.fullName}
- Email: ${personalInfo.email}
- Telepon: ${personalInfo.phone}
- Alamat/Lokasi: ${personalInfo.location || "Indonesia"}
- Pengalaman Kerja:
${expSummary || "Belum ada pengalaman kerja"}
- Keahlian Utama: ${skillsList || "Belum ada keahlian"}

Aturan Penulisan:
1. Gunakan Bahasa Indonesia yang sangat sopan, profesional, bersemangat, dan tata bahasanya sempurna.
2. Ikuti format surat lamaran standar:
   - Tanggal (gunakan tanggal hari ini atau placeholder seperti "[Tanggal]")
   - Penerima (Kepada Yth. HRD / Perekrut [Nama Perusahaan])
   - Pembuka yang sopan dan menarik perhatian, sebutkan posisi yang dilamar.
   - Paragraf isi yang menghubungkan pengalaman & keahlian pelamar langsung dengan kebutuhan pekerjaan yang dicantumkan dalam deskripsi lowongan.
   - Paragraf penutup yang menunjukkan antusiasme untuk sesi wawancara dan ucapan terima kasih.
   - Penutup hangat ("Hormat Saya,") dan nama pelamar.
3. Jangan ada penjelasan pembuka/penutup tambahan dari AI. Langsung berikan teks surat lamaran yang siap disalin.
4. PENTING: Jangan menyalin mentah-mentah (verbatim) kalimat dari data pengalaman pelamar agar tidak memicu filter duplikasi otomatis (safety filter/recitation filter) dari API. Parafrase dan tuliskan kembali pengalaman tersebut dengan gaya bahasa baru yang mengalir dan natural.
5. JANGAN gunakan format markdown seperti tanda asterisk (* atau **) atau cetak tebal/miring di dalam surat lamaran resmi. Tuliskan dalam teks polos biasa yang sangat rapi.
6. Tulis surat lamaran secara LENGKAP dari pembuka hingga penutup akhir. Pastikan tulisan tidak terputus atau terpotong di tengah kalimat.
`;

  return callGemini(apiKey, prompt);
}
