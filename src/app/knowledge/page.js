'use client';

import { useState } from 'react';
import { TECH_COMPARISON, DEPTH_ZONE_MATRIX } from '@/lib/wave-data';
import styles from './page.module.css';

export default function TechCatalogPage() {
  const [activeTech, setActiveTech] = useState('IDX101');
  const active = TECH_COMPARISON.find(t => t.code === activeTech);

  return (
    <div className={styles.catalog}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>Blueprint v1.3</span>
        <h1>Katalog Teknologi Energi Gelombang</h1>
        <p>
          5 sistem konversi energi gelombang yang relevan untuk Indonesia —
          analisis mendalam dari mekanisme, komponen, TKDN, hingga rekomendasi kontekstual.
        </p>
      </div>

      {/* Depth Zone Matrix */}
      <div className={styles.matrixCard}>
        <h3>🌊 Matriks Zona Kedalaman</h3>
        <p className={styles.matrixSubtitle}>Pemilihan teknologi berdasarkan kondisi deployment</p>
        <div className={styles.matrixGrid}>
          {DEPTH_ZONE_MATRIX.map((item, i) => {
            const tech = TECH_COMPARISON.find(t => t.code === item.tech);
            return (
              <button
                key={i}
                className={`${styles.matrixItem} ${activeTech === item.tech ? styles.matrixItemActive : ''}`}
                onClick={() => setActiveTech(item.tech)}
                style={{ '--tech-color': tech?.color }}
              >
                <span className={styles.matrixZone}>{item.zone}</span>
                <span className={styles.matrixLabel} style={{ color: tech?.color }}>{item.label}</span>
                <span className={styles.matrixPriority}>{item.priority}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Technology Tabs */}
      <div className={styles.tabs}>
        {TECH_COMPARISON.map(tech => (
          <button
            key={tech.code}
            className={`${styles.tab} ${activeTech === tech.code ? styles.tabActive : ''}`}
            onClick={() => setActiveTech(tech.code)}
            style={{ '--tab-color': tech.color }}
          >
            <span className={styles.tabCode}>{tech.code}</span>
            <span className={styles.tabName}>{tech.nickname || tech.name}</span>
            {tech.selected && <span className={styles.tabSelectedBadge}>Utama</span>}
          </button>
        ))}
      </div>

      {/* Active Technology Detail */}
      {active && (
        <div className={styles.detail} style={{ '--tech-color': active.color }}>
          {/* Header */}
          <div className={styles.detailHeader}>
            <div className={styles.detailHeaderLeft}>
              <div className={styles.detailCode} style={{ background: `${active.color}20`, color: active.color }}>
                {active.code}
              </div>
              <div>
                <h2>{active.name}</h2>
                {active.nickname && <span className={styles.detailNickname}>&ldquo;{active.nickname}&rdquo;</span>}
              </div>
            </div>
            <div className={styles.detailStatus}>
              <span className={styles.statusBadge} style={{
                background: active.selected ? '#10b98120' : `${active.color}15`,
                color: active.selected ? '#10b981' : active.color,
                borderColor: active.selected ? '#10b98140' : `${active.color}30`,
              }}>
                {active.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className={styles.detailDesc}>{active.description}</p>

          {/* Mechanism */}
          <div className={styles.mechanismCard}>
            <h4>⚙️ Prinsip Kerja</h4>
            <div className={styles.mechanismFlow}>
              {active.mechanism.split('→').map((step, i, arr) => (
                <span key={i} className={styles.mechanismStep}>
                  <span className={styles.mechanismText}>{step.trim()}</span>
                  {i < arr.length - 1 && <span className={styles.mechanismArrow}>→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className={styles.detailGrid}>
            {/* Components */}
            {active.components && (
              <div className={styles.detailSection}>
                <h4>🔩 Komponen Utama</h4>
                <ul className={styles.componentList}>
                  {active.components.map((comp, i) => (
                    <li key={i}>{comp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Design Parameters */}
            {active.designParams && (
              <div className={styles.detailSection}>
                <h4>📐 Parameter Desain</h4>
                <div className={styles.paramGrid}>
                  {Object.entries(active.designParams).map(([key, val]) => (
                    <div key={key} className={styles.paramItem}>
                      <span className={styles.paramKey}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={styles.paramVal}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Advantages & Challenges */}
          <div className={styles.prosConsGrid}>
            {active.advantages && (
              <div className={styles.prosCard}>
                <h4>✅ Keunggulan</h4>
                <ul>
                  {active.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
            )}

            {active.challenges && (
              <div className={styles.consCard}>
                <h4>⚠️ Tantangan</h4>
                <ul>
                  {active.challenges.map((ch, i) => (
                    <li key={i}>{ch}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Metrics */}
          <div className={styles.metricsRow}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Biaya</span>
              <span className={styles.metricValue}>{active.costLevel}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Efektivitas</span>
              <span className={styles.metricValue}>{'⭐'.repeat(active.effectiveness)}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Zona</span>
              <span className={styles.metricValue}>{active.depthZone}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>TKDN Potensial</span>
              <span className={styles.metricValue} style={{ color: active.color }}>{active.tkdnPotential}</span>
            </div>
          </div>

          {/* Recommendation */}
          <div className={styles.recommendCard}>
            <h4>💡 Rekomendasi RD101</h4>
            <p>{active.recommendation}</p>
            {active.synergy && (
              <p className={styles.synergy}>🤝 {active.synergy}</p>
            )}
            <div className={styles.southJava}>
              <span>Selatan Jawa:</span> <strong>{active.southJava}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Strategy */}
      <div className={styles.strategyCard}>
        <h3>🗺️ Strategi Portofolio Teknologi RD101</h3>
        <p className={styles.strategyDesc}>
          Proyek ini menggunakan pendekatan <strong>portofolio bertahap</strong> berdasarkan
          zona geografis dan skala — bukan memilih satu teknologi selamanya.
        </p>
        <div className={styles.strategyFlow}>
          {[
            { code: 'IDX101', label: 'Prototipe offshore', phase: 'Fase Awal' },
            { code: 'IDX105', label: 'Nearshore nelayan', phase: 'Fase Menengah' },
            { code: 'IDX103', label: 'Infrastruktur permanen', phase: 'Fase Matang' },
            { code: 'IDX104', label: 'Kepulauan terpencil', phase: 'Fase Ekspansi' },
          ].map((item, i) => {
            const tech = TECH_COMPARISON.find(t => t.code === item.code);
            return (
              <div key={i} className={styles.strategyStep}>
                <div
                  className={styles.strategyDot}
                  style={{ background: tech?.color, boxShadow: `0 0 12px ${tech?.color}40` }}
                />
                <div className={styles.strategyInfo}>
                  <span className={styles.strategyPhase}>{item.phase}</span>
                  <strong style={{ color: tech?.color }}>{tech?.nickname || tech?.name}</strong>
                  <span>{item.label}</span>
                </div>
                {i < 3 && <div className={styles.strategyLine} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
