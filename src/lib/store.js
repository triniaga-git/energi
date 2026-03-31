/**
 * RD101 — Local Storage CRUD Library
 * 
 * Simple localStorage-based persistence for logbook entries
 * and component registry. Will be migrated to Supabase later.
 */

const isBrowser = typeof window !== 'undefined';

function getStore(key) {
  if (!isBrowser) return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore(key, data) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ============================================================
// Logbook CRUD
// ============================================================

const LOGBOOK_KEY = 'rd101_logbook';

export function getLogbookEntries() {
  return getStore(LOGBOOK_KEY).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getLogbookEntry(slug) {
  const entries = getStore(LOGBOOK_KEY);
  return entries.find(e => e.slug === slug) || null;
}

export function createLogbookEntry(entry) {
  const entries = getStore(LOGBOOK_KEY);
  const now = new Date().toISOString();
  const slug = generateSlug(entry.title, now);
  const newEntry = {
    ...entry,
    slug,
    createdAt: now,
    updatedAt: now,
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
  entries.push(newEntry);
  setStore(LOGBOOK_KEY, entries);
  return newEntry;
}

export function updateLogbookEntry(slug, updates) {
  const entries = getStore(LOGBOOK_KEY);
  const index = entries.findIndex(e => e.slug === slug);
  if (index === -1) return null;
  entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() };
  setStore(LOGBOOK_KEY, entries);
  return entries[index];
}

export function deleteLogbookEntry(slug) {
  const entries = getStore(LOGBOOK_KEY);
  const filtered = entries.filter(e => e.slug !== slug);
  setStore(LOGBOOK_KEY, filtered);
}

// ============================================================
// Component Registry CRUD
// ============================================================

const COMPONENTS_KEY = 'rd101_components';

const VALID_CATEGORIES = ['BRG', 'HYD', 'SPR', 'SEN', 'GEN', 'ELC', 'STR'];

const CATEGORY_LABELS = {
  BRG: 'Bearing',
  HYD: 'Komponen Hidrolik',
  SPR: 'Spring Mechanism',
  SEN: 'Sensor',
  GEN: 'Generator',
  ELC: 'Elektrikal',
  STR: 'Struktural',
};

export { VALID_CATEGORIES, CATEGORY_LABELS };

export function validateComponentId(id) {
  const regex = /^[A-Z]{3}\d{3}$/;
  if (!regex.test(id)) {
    return { valid: false, error: 'Format ID: 3 huruf kapital + 3 digit (contoh: HYD001). Tanpa spasi atau minus.' };
  }
  const prefix = id.slice(0, 3);
  if (!VALID_CATEGORIES.includes(prefix)) {
    return { valid: false, error: `Kategori "${prefix}" tidak valid. Gunakan: ${VALID_CATEGORIES.join(', ')}` };
  }
  // Check duplicate
  const existing = getStore(COMPONENTS_KEY);
  if (existing.some(c => c.componentId === id)) {
    return { valid: false, error: `ID "${id}" sudah terdaftar.` };
  }
  return { valid: true, error: null };
}

export function getComponents(filters = {}) {
  let components = getStore(COMPONENTS_KEY);
  if (filters.category) {
    components = components.filter(c => c.category === filters.category);
  }
  if (filters.isLocal !== undefined) {
    components = components.filter(c => c.isLocal === filters.isLocal);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    components = components.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.componentId.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  }
  return components.sort((a, b) => a.componentId.localeCompare(b.componentId));
}

export function getComponent(componentId) {
  const components = getStore(COMPONENTS_KEY);
  return components.find(c => c.componentId === componentId) || null;
}

export function createComponent(component) {
  const components = getStore(COMPONENTS_KEY);
  const now = new Date().toISOString();
  const newComp = {
    ...component,
    category: component.componentId.slice(0, 3),
    createdAt: now,
    updatedAt: now,
  };
  components.push(newComp);
  setStore(COMPONENTS_KEY, components);
  return newComp;
}

export function updateComponent(componentId, updates) {
  const components = getStore(COMPONENTS_KEY);
  const index = components.findIndex(c => c.componentId === componentId);
  if (index === -1) return null;
  components[index] = { ...components[index], ...updates, updatedAt: new Date().toISOString() };
  setStore(COMPONENTS_KEY, components);
  return components[index];
}

export function deleteComponent(componentId) {
  const components = getStore(COMPONENTS_KEY);
  const filtered = components.filter(c => c.componentId !== componentId);
  setStore(COMPONENTS_KEY, filtered);
}

// TKDN Statistics
export function getTKDNStats() {
  const components = getStore(COMPONENTS_KEY);
  const total = components.length;
  if (total === 0) return { total: 0, local: 0, principal: 0, percentage: 0 };
  const local = components.filter(c => c.isLocal).length;
  return {
    total,
    local,
    principal: total - local,
    percentage: Math.round((local / total) * 100),
  };
}

// ============================================================
// Helpers
// ============================================================

function generateSlug(title, date) {
  const dateStr = new Date(date).toISOString().slice(0, 10);
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);
  return `${dateStr}-${titleSlug}`;
}

// ============================================================
// Seed Data (for demo)
// ============================================================

export function seedDemoData() {
  if (!isBrowser) return;

  // Seed logbook if empty
  if (getStore(LOGBOOK_KEY).length === 0) {
    const demoEntries = [
      {
        title: 'Analisis Awal Parameter Gelombang Selatan Jawa',
        content: `## Ringkasan\n\nMelakukan analisis awal data gelombang dari BMKG dan NOAA untuk pesisir selatan Jawa.\n\n## Parameter Kunci\n\n- **Hs (Significant Wave Height):** 1.5 - 4.0 m\n- **Tp (Peak Period):** 8 - 14 detik\n- **Daya Teoritis (T=10s, H=2m):** ~20 kW/m\n\n## Observasi\n\nGelombang Samudra Hindia memiliki karakteristik **gaya besar, frekuensi rendah** — sangat berbeda dari laut utara Jawa. Ini menjadi dasar pemilihan Point Absorber dengan mekanisme pegas.\n\n## Langkah Selanjutnya\n\n- [ ] Validasi data dengan pengukuran langsung\n- [ ] Simulasi respons pegas pada frekuensi dominan\n- [ ] Konsultasi dengan tim oseanografi BRIN`,
        category: 'observasi',
        tags: ['gelombang', 'analisis', 'BMKG', 'parameter'],
      },
      {
        title: 'Desain Awal PTO System — Spring + Hydraulic',
        content: `## Power Take-Off System Design\n\nIterasi pertama desain PTO untuk "Perahu Pegas".\n\n## Konfigurasi\n\n\`\`\`\nSilinder Piston → Pompa Hidrolik → Check Valves\n  → Akumulator Bertekanan → Pressure Relief Valve\n    → Motor Hidrolik → Generator AC/DC\n\`\`\`\n\n## Parameter Target\n\n| Parameter | Nilai |\n|-----------|-------|\n| Tekanan kerja | 150–250 bar |\n| Kapasitas akumulator | 50–100L |\n| Safety factor pegas | ≥ 3 |\n| Target efisiensi | η = 25–40% |\n\n## Catatan\n\nKonstanta pegas (k) harus disesuaikan dengan periode dominan gelombang T agar tercapai resonansi optimal.`,
        category: 'desain',
        tags: ['PTO', 'hidrolik', 'pegas', 'desain'],
      },
      {
        title: 'Site Survey Cilacap — Evaluasi Lokasi Pilot',
        content: `## Tujuan\n\nEvaluasi Cilacap sebagai lokasi pilot deployment "Perahu Pegas".\n\n## Temuan Lapangan\n\n### Keunggulan\n- ✅ Terlindungi Pulau Nusakambangan dari gelombang ekstrem\n- ✅ Infrastruktur pelabuhan sudah tersedia\n- ✅ Komunitas nelayan aktif dan kooperatif\n- ✅ Akses logistik baik (jalan, pelabuhan)\n\n### Risiko\n- ⚠️ Zona Megathrust — perlu desain anti-gempa\n- ⚠️ Arus kuat di selat Nusakambangan\n\n## Rekomendasi\n\nCilacap tetap menjadi **lokasi prioritas #1** untuk pilot deployment. Desain mooring harus mengakomodasi risiko seismik.\n\n## Dokumentasi Foto\n\n*Foto-foto lapangan akan ditambahkan setelah digitalisasi.*`,
        category: 'lapangan',
        tags: ['Cilacap', 'survey', 'lokasi', 'pilot'],
      },
    ];

    demoEntries.forEach((entry, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (i * 5 + 1));
      const isoDate = date.toISOString();
      const slug = generateSlug(entry.title, isoDate);
      const full = {
        ...entry,
        slug,
        createdAt: isoDate,
        updatedAt: isoDate,
        id: `demo-${i}`,
      };
      const entries = getStore(LOGBOOK_KEY);
      entries.push(full);
      setStore(LOGBOOK_KEY, entries);
    });
  }

  // Seed components if empty
  if (getStore(COMPONENTS_KEY).length === 0) {
    const demoComponents = [
      { componentId: 'HYD001', name: 'Pompa Hidrolik Presisi', description: 'Pompa piston aksial untuk tekanan kerja 150-250 bar. Mission-critical component.', isLocal: false, isMissionCritical: true, supplier: 'Principal Hidrolik', status: 'Design' },
      { componentId: 'HYD002', name: 'Akumulator Hidrolik', description: 'Akumulator bladder 50-100L untuk buffer tekanan fluida.', isLocal: false, isMissionCritical: true, supplier: 'Principal Hidrolik', status: 'Design' },
      { componentId: 'HYD003', name: 'Check Valve Assembly', description: 'Katup satu arah untuk sirkuit hidrolik PTO.', isLocal: false, isMissionCritical: true, supplier: 'Principal Hidrolik', status: 'Design' },
      { componentId: 'SPR001', name: 'Coil Spring Assembly', description: 'Pegas utama restoring force — konstanta k disesuaikan dengan T gelombang dominan.', isLocal: false, isMissionCritical: true, supplier: 'Lokal (dikembangkan)', status: 'Design' },
      { componentId: 'STR001', name: 'Lambung Pelampung', description: 'Badan apung HDPE marine-grade / composite hidrodinamis.', isLocal: true, isMissionCritical: false, supplier: 'Galangan Kapal Cilacap', status: 'Prototype' },
      { componentId: 'STR002', name: 'Frame Struktur PTO', description: 'Rangka baja galvanis untuk housing sistem PTO.', isLocal: true, isMissionCritical: false, supplier: 'Vendor Lokal Semarang', status: 'Design' },
      { componentId: 'GEN001', name: 'Generator AC 10kW', description: 'Generator AC untuk konversi energi mekanis ke elektrikal.', isLocal: true, isMissionCritical: false, supplier: 'PT Generator Indonesia', status: 'Design' },
      { componentId: 'SEN001', name: 'Sensor Tekanan Hidrolik', description: 'Sensor tekanan 0-400 bar untuk monitoring tekanan fluida.', isLocal: false, isMissionCritical: true, supplier: 'Principal Elektronik', status: 'Design' },
      { componentId: 'SEN002', name: 'Akselerometer 3-Axis', description: 'Sensor gerak 3-axis untuk monitoring heave motion pelampung.', isLocal: false, isMissionCritical: true, supplier: 'Principal Elektronik', status: 'Design' },
      { componentId: 'ELC001', name: 'Controller Edge IoT', description: 'Edge controller untuk data acquisition dan transmisi 4G/LoRa.', isLocal: false, isMissionCritical: false, supplier: 'Principal Elektronik', status: 'Design' },
      { componentId: 'BRG001', name: 'Bearing Marine-Grade', description: 'Bearing tahan korosi untuk pivot point sistem PTO.', isLocal: false, isMissionCritical: true, supplier: 'Principal Hidrolik', status: 'Design' },
      { componentId: 'ELC002', name: 'Kabel Marine Submersible', description: 'Kabel listrik tahan air laut untuk transmisi daya.', isLocal: true, isMissionCritical: false, supplier: 'PT Kabel Indonesia', status: 'Design' },
    ];

    demoComponents.forEach(comp => {
      const now = new Date().toISOString();
      const full = { ...comp, category: comp.componentId.slice(0, 3), createdAt: now, updatedAt: now };
      const components = getStore(COMPONENTS_KEY);
      components.push(full);
      setStore(COMPONENTS_KEY, components);
    });
  }
}
