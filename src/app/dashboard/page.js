'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLogbookEntries, getComponents, getTKDNStats, seedDemoData, CATEGORY_LABELS } from '@/lib/store';
import { WAVE_LOCATIONS, TECH_COMPARISON, wavePower, classifyPotential } from '@/lib/wave-data';
import styles from './page.module.css';

export default function DashboardPage() {
  const [logEntries, setLogEntries] = useState([]);
  const [components, setComponents] = useState([]);
  const [tkdn, setTkdn] = useState({ total: 0, local: 0, principal: 0, percentage: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedDemoData();
    setLogEntries(getLogbookEntries());
    setComponents(getComponents());
    setTkdn(getTKDNStats());
    setMounted(true);
  }, []);

  const criticalComps = components.filter(c => c.isMissionCritical);
  const localComps = components.filter(c => c.isLocal);
  const categoryCounts = components.reduce((acc, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {});

  if (!mounted) return <div className={styles.loading}>Memuat dashboard...</div>;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>📊 Dashboard RD101</h1>
          <p>Overview proyek Wave-Spring Hydraulic Converter — Fase 1</p>
        </div>
        <div className={styles.headerBadge}>
          <span className={styles.pulseDot} />
          Fase 1 — Aktif
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`glass-card ${styles.kpiCard}`}>
          <div className={styles.kpiIcon}>📓</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{logEntries.length}</span>
            <span className={styles.kpiLabel}>Entri Logbook</span>
          </div>
          <Link href="/logbook" className={styles.kpiLink}>Lihat →</Link>
        </div>

        <div className={`glass-card ${styles.kpiCard}`}>
          <div className={styles.kpiIcon}>🔧</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{components.length}</span>
            <span className={styles.kpiLabel}>Komponen Terdaftar</span>
          </div>
          <Link href="/components" className={styles.kpiLink}>Lihat →</Link>
        </div>

        <div className={`glass-card ${styles.kpiCard}`}>
          <div className={styles.kpiIcon}>🇮🇩</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue} style={{ color: tkdn.percentage >= 70 ? 'var(--foam-400)' : tkdn.percentage >= 30 ? 'var(--ocean-300)' : 'var(--coral-400)' }}>
              {tkdn.percentage}%
            </span>
            <span className={styles.kpiLabel}>TKDN</span>
          </div>
          <span className={styles.kpiTarget}>Target: 70%</span>
        </div>

        <div className={`glass-card ${styles.kpiCard}`}>
          <div className={styles.kpiIcon}>📍</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{WAVE_LOCATIONS.length}</span>
            <span className={styles.kpiLabel}>Lokasi Survey</span>
          </div>
          <Link href="/map" className={styles.kpiLink}>Peta →</Link>
        </div>

        <div className={`glass-card ${styles.kpiCard}`}>
          <div className={styles.kpiIcon}>⚡</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{criticalComps.length}</span>
            <span className={styles.kpiLabel}>Mission-Critical</span>
          </div>
          <span className={styles.kpiSub}>dari {components.length} total</span>
        </div>

        <div className={`glass-card ${styles.kpiCard}`}>
          <div className={styles.kpiIcon}>🏭</div>
          <div className={styles.kpiContent}>
            <span className={styles.kpiValue}>{TECH_COMPARISON.length}</span>
            <span className={styles.kpiLabel}>Teknologi Terkatalog</span>
          </div>
          <Link href="/knowledge" className={styles.kpiLink}>Katalog →</Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        {/* Recent Logbook */}
        <div className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h3>📓 Logbook Terbaru</h3>
            <Link href="/logbook" className={styles.sectionLink}>Semua →</Link>
          </div>
          {logEntries.slice(0, 5).map(entry => (
            <Link key={entry.slug} href={`/logbook/${entry.slug}`} className={styles.activityItem}>
              <div className={styles.activityDot} />
              <div className={styles.activityContent}>
                <span className={styles.activityTitle}>{entry.title}</span>
                <span className={styles.activityDate}>
                  {new Date(entry.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {entry.category && ` · ${entry.category}`}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Component by Category */}
        <div className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h3>🔧 Komponen per Kategori</h3>
            <Link href="/components" className={styles.sectionLink}>Detail →</Link>
          </div>
          <div className={styles.catGrid}>
            {Object.entries(categoryCounts).sort(([,a],[,b]) => b-a).map(([cat, count]) => (
              <div key={cat} className={styles.catItem}>
                <div className={styles.catBar}>
                  <div className={styles.catBarFill} style={{ width: `${(count / components.length) * 100}%` }} />
                </div>
                <div className={styles.catInfo}>
                  <code className={styles.catCode}>{cat}</code>
                  <span className={styles.catName}>{CATEGORY_LABELS[cat] || cat}</span>
                  <span className={styles.catCount}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Energy Overview */}
        <div className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h3>🌊 Potensi Energi per Lokasi</h3>
            <Link href="/map" className={styles.sectionLink}>Peta →</Link>
          </div>
          {WAVE_LOCATIONS.sort((a,b) => a.priority - b.priority).map(loc => {
            const power = wavePower(loc.waveData.hsAvg, loc.waveData.tpAvg);
            const potential = classifyPotential(power);
            return (
              <div key={loc.id} className={styles.locItem}>
                <div className={styles.locInfo}>
                  <span className={styles.locPriority}>P{loc.priority}</span>
                  <span className={styles.locName}>{loc.name}</span>
                </div>
                <div className={styles.locBar}>
                  <div className={styles.locBarFill} style={{
                    width: `${Math.min((power / 40) * 100, 100)}%`,
                    background: potential.color,
                  }} />
                </div>
                <span className={styles.locPower} style={{ color: potential.color }}>
                  {power.toFixed(1)} kW/m
                </span>
              </div>
            );
          })}
        </div>

        {/* TKDN Detail */}
        <div className={`glass-card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h3>🇮🇩 TKDN Breakdown</h3>
          </div>
          <div className={styles.tkdnDonut}>
            <svg viewBox="0 0 120 120" className={styles.donutSvg}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--sand-700)" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--ocean-400)" strokeWidth="12"
                strokeDasharray={`${(tkdn.percentage / 100) * 314} 314`}
                strokeLinecap="round" transform="rotate(-90 60 60)" />
              <text x="60" y="55" textAnchor="middle" fill="var(--text-primary)" fontSize="24" fontWeight="800" fontFamily="var(--font-mono)">{tkdn.percentage}%</text>
              <text x="60" y="72" textAnchor="middle" fill="var(--text-muted)" fontSize="9">TKDN</text>
            </svg>
          </div>
          <div className={styles.tkdnLegend}>
            <div className={styles.tkdnLegendItem}>
              <span className={styles.tkdnDot} style={{ background: 'var(--ocean-400)' }} />
              <span>Produksi Lokal</span>
              <strong>{tkdn.local}</strong>
            </div>
            <div className={styles.tkdnLegendItem}>
              <span className={styles.tkdnDot} style={{ background: 'var(--sand-600)' }} />
              <span>Principal</span>
              <strong>{tkdn.principal}</strong>
            </div>
          </div>
          <div className={styles.tkdnTimeline}>
            <span className={styles.tkdnTimelineLabel}>Roadmap TKDN</span>
            {[
              { year: 'Tahun 1–2', pct: 30 },
              { year: 'Tahun 3', pct: 50 },
              { year: 'Tahun 4', pct: 60 },
              { year: 'Tahun 5', pct: 70 },
            ].map((item, i) => (
              <div key={i} className={styles.tkdnStep}>
                <span className={styles.tkdnYear}>{item.year}</span>
                <div className={styles.tkdnStepBar}>
                  <div style={{ width: `${item.pct}%`, background: item.pct >= 70 ? 'var(--foam-400)' : 'var(--ocean-500)' }} />
                </div>
                <span className={styles.tkdnPct}>{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
