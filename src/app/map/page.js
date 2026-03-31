'use client';

import dynamic from 'next/dynamic';
import styles from './page.module.css';

// Critical: Leaflet uses `window` object — must disable SSR
const WaveMap = dynamic(() => import('@/components/WaveMap'), {
  ssr: false,
  loading: () => (
    <div className={styles.loading}>
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner} />
        <span className={styles.loadingText}>Memuat peta gelombang...</span>
        <span className={styles.loadingSubtext}>Menginisialisasi Leaflet & data geospasial</span>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className={styles.mapPage}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>🗺️ Peta Energi Gelombang</h1>
          <p>
            Visualisasi potensi energi gelombang pesisir selatan Pulau Jawa —
            data Samudra Hindia
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>6</span>
            <span className={styles.headerStatLabel}>Lokasi Survey</span>
          </div>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>~20</span>
            <span className={styles.headerStatLabel}>kW/m avg</span>
          </div>
        </div>
      </div>
      <WaveMap />
    </div>
  );
}
