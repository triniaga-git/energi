/**
 * RD101 — Wave Energy Data & Calculator
 * 
 * Data lokasi potensi energi gelombang pesisir selatan Jawa
 * dan fungsi kalkulasi daya teoritis.
 */

// ============================================================
// Wave Power Physics
// ============================================================

/**
 * Calculate theoretical wave power per meter of wavefront.
 * P = (ρ × g² × T × H²) / (64π)
 *
 * @param {number} Hs - Significant wave height (m)
 * @param {number} Tp - Peak period (s)
 * @param {number} rho - Sea water density (kg/m³), default 1025
 * @param {number} g - Gravitational acceleration (m/s²), default 9.81
 * @returns {number} Power in kW/m
 */
export function wavePower(Hs, Tp, rho = 1025, g = 9.81) {
  const P = (rho * g * g * Tp * Hs * Hs) / (64 * Math.PI);
  return P / 1000; // Convert W/m to kW/m
}

/**
 * Estimate annual energy yield per meter of wavefront.
 * @param {number} powerKwM - Power in kW/m
 * @param {number} hoursPerYear - Operating hours, default 8760
 * @param {number} capacityFactor - Capacity factor, default 0.3
 * @returns {number} Energy in MWh/m/year
 */
export function annualEnergy(powerKwM, hoursPerYear = 8760, capacityFactor = 0.3) {
  return (powerKwM * hoursPerYear * capacityFactor) / 1000;
}

/**
 * Estimate power output of a converter unit.
 * @param {number} powerKwM - Incoming wave power (kW/m)
 * @param {number} captureWidth - Effective capture width (m)
 * @param {number} efficiency - Conversion efficiency (0-1)
 * @returns {number} Electrical output in kW
 */
export function converterOutput(powerKwM, captureWidth = 5, efficiency = 0.3) {
  return powerKwM * captureWidth * efficiency;
}

// ============================================================
// Wave Quality Classification
// ============================================================

/**
 * Classify wave energy potential.
 * @param {number} powerKwM - Wave power in kW/m
 * @returns {{ level: string, color: string, label: string }}
 */
export function classifyPotential(powerKwM) {
  if (powerKwM >= 30) return { level: 'excellent', color: '#10b981', label: 'Sangat Tinggi' };
  if (powerKwM >= 20) return { level: 'high', color: '#0091cc', label: 'Tinggi' };
  if (powerKwM >= 10) return { level: 'moderate', color: '#ffc926', label: 'Sedang' };
  if (powerKwM >= 5)  return { level: 'low', color: '#f97316', label: 'Rendah' };
  return { level: 'minimal', color: '#ef4444', label: 'Minimal' };
}

// ============================================================
// Location Database — Southern Java Coast
// ============================================================

export const WAVE_LOCATIONS = [
  {
    id: 'cilacap',
    name: 'Cilacap',
    province: 'Jawa Tengah',
    coords: [-7.74, 109.01],
    waveData: {
      hsMin: 1.5,
      hsMax: 3.0,
      hsAvg: 2.0,
      tpMin: 8,
      tpMax: 12,
      tpAvg: 10,
    },
    priority: 1,
    status: 'primary',
    description: 'Lokasi prioritas #1. Terlindungi oleh Pulau Nusakambangan dari gelombang ekstrem. Infrastruktur pelabuhan sudah tersedia. Komunitas nelayan aktif.',
    advantages: [
      'Terlindungi Pulau Nusakambangan',
      'Infrastruktur pelabuhan ada',
      'Komunitas nelayan aktif',
      'Akses logistik baik',
    ],
    risks: [
      'Zona Megathrust',
      'Arus kuat di selat',
    ],
    nearestGrid: 'PLN Cilacap',
    waterDepth: '15-30 m',
    seabedType: 'Pasir & lumpur',
    recommendedSystem: 'IDX101 — Point Absorber',
    installationType: 'Pilot deployment',
  },
  {
    id: 'pangandaran',
    name: 'Pangandaran',
    province: 'Jawa Barat',
    coords: [-7.70, 108.65],
    waveData: {
      hsMin: 1.5,
      hsMax: 3.5,
      hsAvg: 2.2,
      tpMin: 8,
      tpMax: 12,
      tpAvg: 10,
    },
    priority: 3,
    status: 'candidate',
    description: 'Teluk semi-protected dengan potensi gelombang moderat-tinggi. Area wisata pantai yang berkembang — dual benefit dengan eco-tourism.',
    advantages: [
      'Teluk semi-protected',
      'Potensi eco-tourism',
      'Komunitas pesisir berkembang',
    ],
    risks: [
      'Riwayat tsunami 2006',
      'Perlu kajian AMDAL wisata',
    ],
    nearestGrid: 'PLN Pangandaran',
    waterDepth: '10-25 m',
    seabedType: 'Pasir & karang',
    recommendedSystem: 'IDX105 — Surge Converter',
    installationType: 'Nearshore pilot',
  },
  {
    id: 'bantul',
    name: 'Pantai Selatan Bantul',
    province: 'DI Yogyakarta',
    coords: [-8.02, 110.33],
    waveData: {
      hsMin: 2.0,
      hsMax: 4.0,
      hsAvg: 2.8,
      tpMin: 10,
      tpMax: 14,
      tpAvg: 12,
    },
    priority: 2,
    status: 'candidate',
    description: 'Eksposur penuh Samudra Hindia — potensi energi gelombang tertinggi. Ombak besar dan konsisten sepanjang tahun. Ideal untuk unit skala penuh.',
    advantages: [
      'Potensi energi tertinggi',
      'Ombak konsisten sepanjang tahun',
      'Dekat pusat akademik (UGM, UNY)',
    ],
    risks: [
      'Ombak sangat kuat — tantangan engineering',
      'Garis pantai terjal',
      'Risiko badai La Niña tinggi',
    ],
    nearestGrid: 'PLN Bantul',
    waterDepth: '20-40 m',
    seabedType: 'Batu kapur & pasir',
    recommendedSystem: 'IDX101 — Point Absorber (heavy-duty)',
    installationType: 'Full-scale future',
  },
  {
    id: 'pacitan',
    name: 'Pacitan',
    province: 'Jawa Timur',
    coords: [-8.20, 111.10],
    waveData: {
      hsMin: 2.0,
      hsMax: 4.0,
      hsAvg: 2.7,
      tpMin: 10,
      tpMax: 14,
      tpAvg: 11,
    },
    priority: 4,
    status: 'candidate',
    description: 'Potensi tinggi dengan garis pantai panjang. Teluk-teluk kecil memberikan variasi kondisi gelombang untuk riset komparatif.',
    advantages: [
      'Garis pantai panjang',
      'Variasi teluk untuk riset',
      'Komunitas nelayan tradisional',
    ],
    risks: [
      'Akses logistik terbatas',
      'Infrastruktur grid lemah',
    ],
    nearestGrid: 'PLN Pacitan (terbatas)',
    waterDepth: '15-35 m',
    seabedType: 'Batu kapur',
    recommendedSystem: 'IDX101 — Point Absorber',
    installationType: 'Research station',
  },
  {
    id: 'kebumen',
    name: 'Kebumen',
    province: 'Jawa Tengah',
    coords: [-7.72, 109.58],
    waveData: {
      hsMin: 1.8,
      hsMax: 3.5,
      hsAvg: 2.4,
      tpMin: 9,
      tpMax: 13,
      tpAvg: 11,
    },
    priority: 5,
    status: 'future',
    description: 'Area potensial antara Cilacap dan Yogyakarta. Pantai Ayah dan sekitarnya memiliki kondisi gelombang yang baik.',
    advantages: [
      'Lokasi strategis antara Cilacap-Yogya',
      'Pantai relatif terbuka',
      'Potensi nelayan lokal',
    ],
    risks: [
      'Infrastruktur terbatas',
      'Data gelombang minim',
    ],
    nearestGrid: 'PLN Kebumen',
    waterDepth: '15-30 m',
    seabedType: 'Pasir & batu',
    recommendedSystem: 'IDX105 — Surge Converter',
    installationType: 'Future expansion',
  },
  {
    id: 'trenggalek',
    name: 'Trenggalek',
    province: 'Jawa Timur',
    coords: [-8.16, 111.70],
    waveData: {
      hsMin: 1.8,
      hsMax: 3.8,
      hsAvg: 2.5,
      tpMin: 9,
      tpMax: 13,
      tpAvg: 11,
    },
    priority: 6,
    status: 'future',
    description: 'Pantai Prigi dan sekitarnya memiliki pelabuhan perikanan. Potensi integrasi dengan infrastruktur perikanan.',
    advantages: [
      'Pelabuhan perikanan Prigi',
      'Integrasi infrastruktur nelayan',
      'Ombak cukup kuat',
    ],
    risks: [
      'Topografi terjal',
      'Akses jalan terbatas',
    ],
    nearestGrid: 'PLN Trenggalek',
    waterDepth: '15-30 m',
    seabedType: 'Batu kapur & pasir',
    recommendedSystem: 'IDX101 — Point Absorber',
    installationType: 'Future expansion',
  },
];

// ============================================================
// Technology Catalog — v1.3 Full Detail
// ============================================================

export const TECH_COMPARISON = [
  {
    code: 'IDX101',
    name: 'Point Absorber',
    nickname: 'Perahu Pegas',
    description: 'Pelampung/badan apung bergerak naik-turun mengikuti gerak vertikal gelombang (heave motion), mentransmisikan gerakan ke PTO pegas + piston hidrolik.',
    mechanism: 'Gelombang → Pelampung naik-turun → Pegas + Piston → Fluida bertekanan → Motor → Generator',
    selected: true,
    priority: 1,
    status: 'SISTEM UTAMA RD101',
    costLevel: 'Sedang',
    effectiveness: 4,
    suitability: 'offshore',
    depthZone: '> 20m (offshore)',
    color: '#0091cc',
    components: [
      'Pelampung: HDPE marine-grade / composite hidrodinamis',
      'PTO: Coil spring + gas accumulator → silinder piston → pompa hidrolik',
      'Akumulator: 50–100L per unit (buffer energi)',
      'Generator: AC/DC sesuai beban lokal',
      'Mooring: Tension leg mooring atau catenary',
    ],
    designParams: {
      workingPressure: '150–250 bar',
      springSafetyFactor: '≥ 3',
      resonanceFreq: 'T = 8–14 detik',
      targetEfficiency: 'η = 25–40%',
    },
    advantages: [
      'Omni-directional — tangkap energi dari berbagai sudut',
      'Modular dan skalabel',
      'Cocok untuk gelombang gaya besar frekuensi rendah',
      'Bisa di-deploy satu per satu',
    ],
    challenges: [
      'Butuh komponen hidrolik presisi tinggi',
      'Sistem mooring kompleks',
      'Biofouling pada pelampung',
    ],
    tkdnPotential: '30% awal → 70% Tahun 5',
    recommendation: 'Prototipe offshore fase awal — paling skalabel dan modular',
    southJava: '✅ Dipilih — cocok untuk gelombang Hindia',
  },
  {
    code: 'IDX102',
    name: 'Attenuator',
    nickname: 'Ular Laut',
    description: 'Segmen tabung baja silindris (10–200m) terhubung dalam rangkaian panjang mengapung sejajar arah gelombang, bergerak "menggeliat" menciptakan gerakan relatif antar segmen.',
    mechanism: 'Gelombang lewat sepanjang tubuh → Tiap segmen berayun → PTO di tiap sambungan → Generator terpusat',
    selected: false,
    priority: 5,
    status: 'Kandidat Jangka Panjang',
    costLevel: 'Tinggi',
    effectiveness: 3,
    suitability: 'offshore',
    depthZone: 'Skala nasional besar',
    color: '#f97316',
    components: [
      'Segmen tabung baja marine-grade silindris',
      'Sambungan engsel (joints) dengan PTO di tiap sendi',
      'Piston hidrolik di setiap sambungan',
      'Generator terpusat di segmen utama',
      'Mooring system skala besar',
    ],
    designParams: {
      length: '10–200m per unit',
      segments: '3–5 segmen',
      jointType: 'Engsel hidrolik presisi',
    },
    advantages: [
      'Output energi sangat besar pada gelombang panjang',
      'Cocok untuk instalasi skala besar offshore',
      'Dampak visual minimal dari pantai',
    ],
    challenges: [
      'Biaya fabrikasi sangat tinggi (baja marine-grade skala besar)',
      'Perawatan sambungan (joints) menjadi titik kritis dan mahal',
      'Setiap engsel = potensi kegagalan fatigue',
      'Kompleksitas distribusi PTO',
    ],
    tkdnPotential: '20–35% (baja lokal, engsel presisi butuh principal)',
    recommendation: 'Tidak untuk fase pilot. Pertimbangkan pasca Tahun 5 jika ada investor skala besar.',
    southJava: '⚠️ Jangka panjang',
  },
  {
    code: 'IDX103',
    name: 'OWC',
    nickname: 'Kolom Air Berosilasi',
    description: 'Struktur beton semi-tertutup di tepi pantai/breakwater. Gelombang menggerakkan kolom air naik-turun, mengompresi dan menghisap udara melalui turbin Wells yang berputar dua arah.',
    mechanism: 'Gelombang masuk → Air naik → Udara tertekan → Turbin → Listrik | Gelombang keluar → Air turun → Udara terhisap → Turbin → Listrik',
    selected: false,
    priority: 3,
    status: 'Prioritas 3 — Infrastruktur Permanen Cilacap',
    costLevel: 'Tinggi (awal)',
    effectiveness: 5,
    suitability: 'fixed-shore',
    depthZone: 'Tepi pantai (fixed)',
    color: '#10b981',
    components: [
      'Struktur beton semi-tertutup (chamber)',
      'Turbin Wells / turbin impuls (berputar dua arah)',
      'Generator konvensional (di darat)',
      'Sistem kontrol tekanan udara',
      'Pondasi breakwater / dermaga',
    ],
    designParams: {
      lifespan: '40+ tahun',
      mainMaterial: 'Beton + besi beton + turbin konvensional',
      maintenance: 'Sangat rendah — tidak ada komponen bawah air bergerak',
    },
    advantages: [
      'Tidak ada komponen bergerak di bawah air — hanya beton',
      'Biaya operasional & perawatan sangat rendah',
      'Masa pakai 40+ tahun',
      'Turbin & generator di darat — mudah diakses',
      'TKDN tertinggi — material utama bisa lokal',
      'Bisa diintegrasikan ke breakwater/dermaga (cost-sharing)',
    ],
    challenges: [
      'Biaya konstruksi sipil awal sangat besar',
      'Tidak dapat dipindahkan',
      'Butuh studi gelombang panjang sebelum desain final',
      'Performa menurun pada gelombang tidak teratur',
    ],
    tkdnPotential: '65–80% (beton + besi lokal, turbin Wells bisa dikembangkan bersama BRIN)',
    recommendation: 'Ideal untuk Cilacap — terlindungi Nusakambangan, infrastruktur ada. Cocok hibah PUPR/ESDM atau investasi BUMN.',
    southJava: '✅ Cilacap fixed — infrastruktur permanen',
    synergy: 'Proyek OWC = infrastruktur negara, bukan startup. Cocok PLN Nusantara Power.',
  },
  {
    code: 'IDX104',
    name: 'Overtopping Device',
    nickname: 'Wave Dragon',
    description: 'Platform terapung besar dengan "lengan" reflektor mengarahkan ombak memanjat ramp ke reservoir elevasi tinggi, lalu air turun melalui turbin air Kaplan — prinsip PLTA miniatur.',
    mechanism: 'Ombak → Lengan reflektor → Ramp (memanjat) → Reservoir → Turbin air Kaplan → Generator',
    selected: false,
    priority: 4,
    status: 'Potensial untuk Kepulauan Terpencil',
    costLevel: 'Sangat tinggi',
    effectiveness: 3,
    suitability: 'offshore',
    depthZone: 'Kepulauan terpencil',
    color: '#8b5cf6',
    components: [
      'Platform terapung skala besar (ratusan ton)',
      'Lengan reflektor gelombang (2 unit)',
      'Ramp / bidang miring',
      'Reservoir air elevasi tinggi (buffer)',
      'Turbin air Kaplan / propeller (tekanan rendah)',
      'Generator konvensional',
      'Mooring system heavy-duty',
    ],
    designParams: {
      platformWeight: 'Ratusan ton',
      turbineType: 'Kaplan (matang, murah, bisa lokal)',
      bufferEffect: 'Reservoir = output stabil meski ombak sesaat berhenti',
    },
    advantages: [
      'Output sangat stabil karena efek buffer reservoir',
      'Teknologi turbin Kaplan sangat matang dan murah',
      'Tidak ada komponen presisi di bawah air',
      'Suplai energi stabil untuk daerah terisolasi',
    ],
    challenges: [
      'Platform terapung sangat besar dan berat — fabrikasi & mooring mahal',
      'Efisiensi bergantung pada konsistensi tinggi ombak',
      'Kurang fleksibel untuk variasi tinggi ombak besar',
      'Membutuhkan galangan kapal besar untuk fabrikasi',
    ],
    tkdnPotential: '45–55% (turbin Kaplan lokal, platform butuh galangan besar)',
    recommendation: 'Lebih cocok untuk kepulauan terpencil NTT, Maluku, Papua. Varian produk untuk elektrifikasi kepulauan pemerintah.',
    southJava: '⚠️ Over-engineering untuk fase awal',
  },
  {
    code: 'IDX105',
    name: 'OWSC / Surge Converter',
    nickname: 'Sirip Laut',
    description: 'Sirip/pintu raksasa di dasar laut dangkal, berayun maju-mundur oleh dorongan horizontal ombak (surge), menggerakkan piston hidrolik dengan generator di darat.',
    mechanism: 'Dorongan horizontal ombak (surge) → Sirip berayun → Batang piston → Silinder hidrolik → Motor hidrolik (di darat) → Generator',
    selected: false,
    priority: 2,
    status: 'Prioritas 2 — Nearshore Dekat Nelayan',
    costLevel: 'Sedang',
    effectiveness: 4,
    suitability: 'nearshore',
    depthZone: '2–15m (nearshore)',
    color: '#ffc926',
    components: [
      'Sirip / flap: baja marine-grade SS316 + anti-fouling coating',
      'Engsel pivot: pondasi beton di dasar laut',
      'Batang piston: terhubung dari ujung sirip ke silinder hidrolik',
      'Silinder hidrolik + akumulator: di bangunan kecil di darat/pier',
      'Generator: di darat — mudah diakses nelayan untuk perawatan',
    ],
    designParams: {
      flapSize: 'Lebar 1–5m, tinggi sesuai kedalaman',
      depthRange: '2–15m',
      maintenance: 'Anti-fouling setiap 6–12 bulan',
      foundation: 'Pondasi beton di dasar laut',
    },
    advantages: [
      'Tidak ada komponen di permukaan laut — tidak ganggu navigasi nelayan',
      'Fabrikasi sirip baja bisa di galangan lokal Cilacap',
      'TKDN tinggi dari awal (60-70%)',
      'Generator di darat — perawatan mudah oleh teknisi lokal',
      'Sangat cocok untuk program energi komunitas nelayan',
      'Distribusi listrik tidak butuh kabel panjang',
    ],
    challenges: [
      'Hanya efektif di zona perairan dangkal tertentu',
      'Butuh survei batimetri detail',
      'Pondasi beton di dasar laut butuh konstruksi bawah air',
      'Biofouling pada sirip perlu penanganan rutin',
    ],
    tkdnPotential: '60–70% dari awal (sirip + pondasi beton = komponen terbesar, bisa lokal)',
    recommendation: 'Cocok untuk kawasan nelayan nearshore. Perwujudan Sila ke-5 — perawatan bisa oleh teknisi lokal.',
    southJava: '✅ Prioritas 2 — dekat nelayan',
    synergy: 'Komunitas tidak merasa laut "diblokir" — unit tidak terlihat dari permukaan.',
  },
];

// ============================================================
// Depth Zone Decision Matrix (from v1.3)
// ============================================================

export const DEPTH_ZONE_MATRIX = [
  { zone: '> 20m (offshore)', tech: 'IDX101', label: 'Point Absorber', priority: 'Prioritas 1 RD101' },
  { zone: '5–20m (nearshore)', tech: 'IDX105', label: 'OWSC', priority: 'Prioritas 2 RD101' },
  { zone: 'Tepi pantai (fixed)', tech: 'IDX103', label: 'OWC', priority: 'Prioritas 3 (Cilacap)' },
  { zone: 'Kepulauan terpencil', tech: 'IDX104', label: 'Overtopping', priority: 'Varian masa depan' },
  { zone: 'Skala nasional besar', tech: 'IDX102', label: 'Attenuator', priority: 'Jangka panjang' },
];

// ============================================================
// Map Configuration
// ============================================================

export const MAP_CONFIG = {
  center: [-7.9, 109.8],
  zoom: 8,
  minZoom: 7,
  maxZoom: 15,
  bounds: [
    [-9.0, 105.0],  // Southwest
    [-6.5, 114.0],  // Northeast
  ],
};

// ============================================================
// Heatmap Points (Wave Energy Density Grid)
// Simplified grid of wave energy values along the coast
// ============================================================

export function generateHeatmapPoints() {
  const points = [];
  // Generate points along the southern Java coastline
  const coastLine = [
    { lng: 105.5, lat: -7.0, base: 8 },
    { lng: 106.0, lat: -7.1, base: 10 },
    { lng: 106.5, lat: -7.2, base: 12 },
    { lng: 107.0, lat: -7.3, base: 14 },
    { lng: 107.5, lat: -7.5, base: 16 },
    { lng: 108.0, lat: -7.55, base: 18 },
    { lng: 108.5, lat: -7.6, base: 20 },
    { lng: 109.0, lat: -7.65, base: 18 }, // Cilacap area (protected)
    { lng: 109.5, lat: -7.7, base: 22 },
    { lng: 110.0, lat: -7.85, base: 26 },
    { lng: 110.3, lat: -7.95, base: 30 }, // Bantul area (highest)
    { lng: 110.7, lat: -8.0, base: 28 },
    { lng: 111.0, lat: -8.1, base: 27 },
    { lng: 111.5, lat: -8.15, base: 25 },
    { lng: 112.0, lat: -8.2, base: 22 },
    { lng: 112.5, lat: -8.3, base: 20 },
    { lng: 113.0, lat: -8.35, base: 18 },
    { lng: 113.5, lat: -8.4, base: 16 },
  ];

  coastLine.forEach(point => {
    // Generate surrounding points with some variation
    for (let dLat = 0; dLat < 5; dLat++) {
      for (let dLng = -1; dLng <= 1; dLng++) {
        const lat = point.lat - (dLat * 0.15); // Go southward into ocean
        const lng = point.lng + (dLng * 0.15);
        const distance = dLat * 0.15; // Distance from coast
        // Energy increases offshore to a point then decreases
        const offshoreMultiplier = distance < 0.3 ? 0.7 + distance : 1.0 - (distance - 0.3) * 0.5;
        const variation = 0.8 + Math.random() * 0.4;
        const intensity = Math.max(0, point.base * offshoreMultiplier * variation);
        points.push({
          lat,
          lng,
          intensity: Math.round(intensity * 10) / 10,
        });
      }
    }
  });

  return points;
}
