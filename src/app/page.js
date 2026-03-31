import styles from './page.module.css';
import WaveAnimation from '@/components/WaveAnimation';

export default function HomePage() {
  return (
    <div className={styles.home}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroOrb3} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>RD101 — Engineering Sovereignty</span>
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>Portal Riset</span>
            <span className={styles.heroTitleLine2}>Nusantara</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Mewujudkan <strong>Kedaulatan Energi</strong> berbasis karakteristik
            geografis Indonesia melalui teknologi konverter gelombang laut
          </p>

          <div className={styles.heroActions}>
            <a href="/logbook" className={`btn btn-primary btn-lg ${styles.heroBtn}`}>
              📓 Mulai Eksplorasi
            </a>
            <a href="#arsitektur" className={`btn btn-secondary btn-lg ${styles.heroBtn}`}>
              🔍 Pelajari Lebih Lanjut
            </a>
          </div>

          {/* Quick Stats */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>~20</span>
              <span className={styles.heroStatLabel}>kW/m daya teoritis</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>1.5–4m</span>
              <span className={styles.heroStatLabel}>tinggi gelombang Hs</span>
            </div>
            <div className={styles.heroStatDivider} />
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>8–14s</span>
              <span className={styles.heroStatLabel}>periode gelombang</span>
            </div>
          </div>
        </div>

        <WaveAnimation height={140} className={styles.heroWave} />
      </section>

      {/* ===== FILOSOFI SECTION ===== */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className="badge badge-gold">Fondasi</span>
          <h2>Filosofi & Visi</h2>
          <p>Dunia Satu Keluarga — Laut bukan musuh, melainkan saudara penyedia energi</p>
        </div>

        <div className={styles.pancasilaGrid}>
          {[
            { sila: 'Sila 1 & 2', icon: '🌿', title: 'Menghormati Alam', desc: 'Teknologi yang menghormati alam & harkat manusia' },
            { sila: 'Sila 3', icon: '🇮🇩', title: 'Kemandirian', desc: 'Kemandirian teknologi melalui Local Core Integration' },
            { sila: 'Sila 4', icon: '📖', title: 'Transparansi', desc: 'Riset kolaboratif & Open-Journaling untuk semua' },
            { sila: 'Sila 5', icon: '⚡', title: 'Keadilan Energi', desc: 'Distribusi energi adil untuk pesisir & pulau terluar' },
          ].map((item, i) => (
            <div key={i} className={`glass-card ${styles.pancasilaCard} fade-in-up delay-${i + 1}`}>
              <span className={styles.pancasilaIcon}>{item.icon}</span>
              <span className={styles.pancasilaSila}>{item.sila}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ARSITEKTUR PRODUK ===== */}
      <div className="section-divider" />
      <section className={styles.section} id="arsitektur">
        <div className={styles.sectionHeader}>
          <span className="badge badge-ocean">Produk</span>
          <h2>&ldquo;Perahu Pegas&rdquo;</h2>
          <p>Wave-Spring Hydraulic Converter — Arsitektur konversi energi gelombang</p>
        </div>

        <div className={styles.architectureFlow}>
          {[
            { icon: '🌊', label: 'Gelombang Laut', sub: 'Samudra Hindia', detail: 'Gaya besar, frekuensi rendah' },
            { icon: '🛥️', label: 'The Absorber', sub: 'Gerak Vertikal', detail: 'Pelampung hidrodinamis' },
            { icon: '🔩', label: 'Sistem Pegas', sub: 'Spring Mechanism', detail: 'Restoring force management' },
            { icon: '⚙️', label: 'Sistem Hidrolik', sub: 'Power Take-Off', detail: 'Piston → Pompa → Akumulator' },
            { icon: '🔋', label: 'Power Conversion', sub: 'Generator AC/DC', detail: 'Motor hidrolik → generator' },
            { icon: '⚡', label: 'Listrik Output', sub: 'Distribusi', detail: 'Nelayan / Pelabuhan / Grid' },
          ].map((step, i) => (
            <div key={i} className={styles.archStep}>
              <div className={`glass-card interactive ${styles.archCard}`}>
                <span className={styles.archIcon}>{step.icon}</span>
                <div className={styles.archInfo}>
                  <strong>{step.label}</strong>
                  <span className={styles.archSub}>{step.sub}</span>
                  <span className={styles.archDetail}>{step.detail}</span>
                </div>
              </div>
              {i < 5 && <div className={styles.archArrow}>▼</div>}
            </div>
          ))}
        </div>

        {/* Formula */}
        <div className={`glass-card ${styles.formulaCard}`}>
          <div className={styles.formulaHeader}>
            <span className="font-mono">📐 Formula Daya Teoritis</span>
          </div>
          <div className={styles.formulaBody}>
            <code className={styles.formula}>
              P = (ρ × g² × T × H²) / (64π)
            </code>
            <div className={styles.formulaParams}>
              <span>ρ = 1025 kg/m³ (densitas air laut)</span>
              <span>g = 9.81 m/s² (gravitasi)</span>
              <span>T = 10s, H = 2m → <strong>≈ 20 kW/m</strong></span>
            </div>
            <div className={styles.formulaTarget}>
              Target efisiensi konversi: <strong>η = 25–40%</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIGA PILAR ===== */}
      <div className="section-divider" />
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className="badge badge-foam">Strategi</span>
          <h2>Tiga Pilar Strategis</h2>
        </div>

        <div className={`grid grid-3 ${styles.pilarGrid}`}>
          {[
            {
              icon: '🔬',
              title: 'Teknologi Tepat Guna',
              items: ['Desain spesifik ombak Hindia', 'Open journal untuk transparansi', 'Sistem modular & maintainable'],
              color: 'ocean',
            },
            {
              icon: '🤝',
              title: 'Komunitas Sebagai Pusat',
              items: ['Nelayan = co-owner energi', 'Model bagi hasil (60/25/15)', 'Edukasi & pelatihan lokal'],
              color: 'gold',
            },
            {
              icon: '🇮🇩',
              title: 'Kedaulatan Bertahap',
              items: ['TKDN 30% → 70% dalam 5 tahun', 'Max 2 principal teknis', 'Transfer of Technology wajib'],
              color: 'foam',
            },
          ].map((pilar, i) => (
            <div key={i} className={`glass-card interactive ${styles.pilarCard}`}>
              <div className={`${styles.pilarIconBg} ${styles[`pilar${pilar.color}`]}`}>
                <span className={styles.pilarIcon}>{pilar.icon}</span>
              </div>
              <h3>{pilar.title}</h3>
              <ul className={styles.pilarList}>
                {pilar.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===== KOMPARASI TEKNOLOGI ===== */}
      <div className="section-divider" />
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className="badge badge-coral">Analisis</span>
          <h2>Komparasi Teknologi</h2>
          <p>Perbandingan sistem konversi energi gelombang untuk pesisir selatan Jawa</p>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Sistem</th>
                <th>Biaya</th>
                <th>Efektivitas</th>
                <th>Selatan Jawa?</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.selectedRow}>
                <td><code>IDX101</code></td>
                <td><strong>Point Absorber</strong> ⭐</td>
                <td>Sedang</td>
                <td>⭐⭐⭐⭐</td>
                <td>✅ Dipilih</td>
              </tr>
              <tr>
                <td><code>IDX102</code></td>
                <td>Attenuator (Ular Laut)</td>
                <td>Tinggi</td>
                <td>⭐⭐⭐</td>
                <td>⚠️ Pertimbangkan</td>
              </tr>
              <tr>
                <td><code>IDX103</code></td>
                <td>OWC (Kolom Beton)</td>
                <td>Tinggi awal</td>
                <td>⭐⭐⭐⭐⭐</td>
                <td>✅ Cilacap fixed</td>
              </tr>
              <tr>
                <td><code>IDX104</code></td>
                <td>Overtopping (Reservoir)</td>
                <td>Sangat tinggi</td>
                <td>⭐⭐</td>
                <td>❌ Over-engineering</td>
              </tr>
              <tr>
                <td><code>IDX105</code></td>
                <td>Surge Converter (Sirip)</td>
                <td>Sedang</td>
                <td>⭐⭐⭐⭐</td>
                <td>✅ Dekat nelayan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== ROADMAP ===== */}
      <div className="section-divider" />
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className="badge badge-ocean">Roadmap</span>
          <h2>Roadmap Pengembangan</h2>
          <p>4 fase menuju kedaulatan energi laut Indonesia</p>
        </div>

        <div className={styles.roadmap}>
          {[
            {
              fase: 'Fase 1',
              title: 'Fondasi Digital & Riset',
              period: 'Bulan 1–6',
              status: 'active',
              items: ['Platform engineering journal', 'Pemetaan geospasial', 'Studi mekanika pegas & hidrolik'],
              budget: 'Rp 150–300 jt',
            },
            {
              fase: 'Fase 2',
              title: 'Pemerintah + Principal',
              period: 'Bulan 7–12',
              status: 'upcoming',
              items: ['Proposal BRIN & LPDP', 'Penjajakan 2 principal teknis', 'Desain PTO System'],
              budget: 'Rp 500 jt – 1 M',
            },
            {
              fase: 'Fase 3',
              title: 'Prototipe Skala Pilot',
              period: 'Bulan 13–24',
              status: 'upcoming',
              items: ['Fabrikasi "Perahu Pegas" 1:5', 'Sensor & monitoring real-time', 'Pengujian 10.000 siklus'],
              budget: 'Rp 2–5 M',
            },
            {
              fase: 'Fase 4',
              title: 'Implementasi Lapangan',
              period: 'Bulan 25–36+',
              status: 'upcoming',
              items: ['Deployment Cilacap', 'Model bagi hasil energi', 'Target TKDN 70%'],
              budget: 'Rp 10–25 M',
            },
          ].map((phase, i) => (
            <div key={i} className={`${styles.roadmapPhase} ${styles[phase.status]}`}>
              <div className={styles.roadmapTimeline}>
                <div className={styles.roadmapDot}>
                  {phase.status === 'active' && <span className={styles.roadmapPulse} />}
                </div>
                {i < 3 && <div className={styles.roadmapLine} />}
              </div>
              <div className={`glass-card ${styles.roadmapCard}`}>
                <div className={styles.roadmapHeader}>
                  <span className={`badge ${phase.status === 'active' ? 'badge-foam' : 'badge-ocean'}`}>
                    {phase.fase}
                  </span>
                  <span className={styles.roadmapPeriod}>{phase.period}</span>
                </div>
                <h3>{phase.title}</h3>
                <ul className={styles.roadmapItems}>
                  {phase.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
                <div className={styles.roadmapBudget}>
                  <span>💰 Estimasi:</span>
                  <strong>{phase.budget}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <div className="section-divider" />
      <section className={styles.ctaSection}>
        <div className={`glass-card ${styles.ctaCard}`}>
          <div className={styles.ctaContent}>
            <h2>Siap Berkontribusi?</h2>
            <p>
              Platform ini menganut prinsip <strong>open-journaling</strong> — setiap
              eksperimen, keberhasilan, dan kegagalan didokumentasikan secara transparan
              untuk kemajuan riset bersama.
            </p>
            <div className={styles.ctaActions}>
              <a href="/logbook" className="btn btn-primary btn-lg">
                📓 Buka Logbook
              </a>
              <a href="/components" className="btn btn-secondary btn-lg">
                🔧 Registry Komponen
              </a>
            </div>
          </div>
          <div className={styles.ctaQuote}>
            <blockquote>
              &ldquo;Laut yang ganas bukanlah musuh, melainkan saudara yang siap
              menyediakan energi bagi kehidupan, jika kita mau belajar merangkulnya
              dengan kebijaksanaan dan gotong royong.&rdquo;
            </blockquote>
          </div>
        </div>
        <WaveAnimation height={100} />
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerMain}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>🌊 RD101</span>
              <p>Portal Riset Nusantara — Kedaulatan Energi Berbasis Karakteristik Geografis Indonesia</p>
            </div>
            <div className={styles.footerMeta}>
              <span>Blueprint v1.2 — Living Document</span>
              <span>Lisensi: Open Research — Non-Komersial Indonesia</span>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 RD101 Engineering Sovereignty. Gotong royong sebagai metodologi.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
