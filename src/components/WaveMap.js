'use client';

import { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  WAVE_LOCATIONS,
  MAP_CONFIG,
  wavePower,
  annualEnergy,
  converterOutput,
  classifyPotential,
  generateHeatmapPoints,
} from '@/lib/wave-data';
import styles from './WaveMap.module.css';

// ============================================================
// Sub-components
// ============================================================

function FitBoundsButton() {
  const map = useMap();
  const handleClick = () => {
    map.fitBounds(MAP_CONFIG.bounds, { padding: [30, 30] });
  };
  return (
    <button className={styles.mapControl} onClick={handleClick} title="Reset tampilan peta">
      🔄
    </button>
  );
}

function LocationPopupContent({ location }) {
  const power = wavePower(location.waveData.hsAvg, location.waveData.tpAvg);
  const energy = annualEnergy(power);
  const output = converterOutput(power);
  const potential = classifyPotential(power);

  return (
    <div className={styles.popup}>
      <div className={styles.popupHeader}>
        <h3>{location.name}</h3>
        <span className={styles.popupProvince}>{location.province}</span>
      </div>

      <div className={styles.popupBadge} style={{ background: `${potential.color}22`, color: potential.color, borderColor: `${potential.color}44` }}>
        ⚡ Potensi: {potential.label}
      </div>

      <p className={styles.popupDesc}>{location.description}</p>

      <div className={styles.popupSection}>
        <h4>📊 Parameter Gelombang</h4>
        <div className={styles.popupGrid}>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Hs (range)</span>
            <span className={styles.popupStatValue}>{location.waveData.hsMin}–{location.waveData.hsMax} m</span>
          </div>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Hs (avg)</span>
            <span className={styles.popupStatValue}>{location.waveData.hsAvg} m</span>
          </div>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Tp (range)</span>
            <span className={styles.popupStatValue}>{location.waveData.tpMin}–{location.waveData.tpMax} s</span>
          </div>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Tp (avg)</span>
            <span className={styles.popupStatValue}>{location.waveData.tpAvg} s</span>
          </div>
        </div>
      </div>

      <div className={styles.popupSection}>
        <h4>⚡ Estimasi Daya</h4>
        <div className={styles.popupGrid}>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Wave Power</span>
            <span className={styles.popupStatValue}>{power.toFixed(1)} kW/m</span>
          </div>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Converter Output</span>
            <span className={styles.popupStatValue}>{output.toFixed(1)} kW</span>
          </div>
          <div className={styles.popupStat}>
            <span className={styles.popupStatLabel}>Annual Energy</span>
            <span className={styles.popupStatValue}>{energy.toFixed(1)} MWh/m/yr</span>
          </div>
        </div>
      </div>

      <div className={styles.popupSection}>
        <h4>📋 Detail Lokasi</h4>
        <div className={styles.popupDetails}>
          <div><span>Kedalaman:</span> <span>{location.waterDepth}</span></div>
          <div><span>Dasar laut:</span> <span>{location.seabedType}</span></div>
          <div><span>Grid terdekat:</span> <span>{location.nearestGrid}</span></div>
          <div><span>Sistem rekomendasi:</span> <span>{location.recommendedSystem}</span></div>
          <div><span>Tipe instalasi:</span> <span>{location.installationType}</span></div>
        </div>
      </div>

      {location.advantages.length > 0 && (
        <div className={styles.popupSection}>
          <h4>✅ Keunggulan</h4>
          <ul className={styles.popupList}>
            {location.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
          </ul>
        </div>
      )}

      {location.risks.length > 0 && (
        <div className={styles.popupSection}>
          <h4>⚠️ Risiko</h4>
          <ul className={`${styles.popupList} ${styles.popupListRisk}`}>
            {location.risks.map((risk, i) => <li key={i}>{risk}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Main Map Component
// ============================================================

export default function WaveMap() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [activeLocation, setActiveLocation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Calculator state
  const [calcHs, setCalcHs] = useState(2.0);
  const [calcTp, setCalcTp] = useState(10);
  const [calcWidth, setCalcWidth] = useState(5);
  const [calcEfficiency, setCalcEfficiency] = useState(30);

  const heatmapPoints = useMemo(() => generateHeatmapPoints(), []);

  const filteredLocations = useMemo(() => {
    if (filterStatus === 'all') return WAVE_LOCATIONS;
    return WAVE_LOCATIONS.filter(loc => loc.status === filterStatus);
  }, [filterStatus]);

  // Calculator results
  const calcPower = wavePower(calcHs, calcTp);
  const calcOutput = converterOutput(calcPower, calcWidth, calcEfficiency / 100);
  const calcAnnual = annualEnergy(calcPower);
  const calcPotential = classifyPotential(calcPower);

  const getMarkerStyle = useCallback((location) => {
    const power = wavePower(location.waveData.hsAvg, location.waveData.tpAvg);
    const potential = classifyPotential(power);
    const isActive = activeLocation === location.id;

    const radiusMap = { primary: 12, candidate: 10, future: 8 };
    return {
      radius: isActive ? (radiusMap[location.status] || 8) + 4 : radiusMap[location.status] || 8,
      fillColor: potential.color,
      color: isActive ? '#ffffff' : potential.color,
      weight: isActive ? 3 : 2,
      opacity: 1,
      fillOpacity: isActive ? 0.9 : 0.7,
    };
  }, [activeLocation]);

  return (
    <div className={styles.mapWrapper}>
      {/* Sidebar Panel */}
      <div className={styles.panel}>
        {/* Filter Controls */}
        <div className={styles.panelSection}>
          <h3 className={styles.panelTitle}>🗺️ Peta Energi Gelombang</h3>
          <p className={styles.panelSubtitle}>Pesisir Selatan Jawa — Samudra Hindia</p>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Filter Lokasi</label>
            <div className={styles.filterButtons}>
              {[
                { value: 'all', label: 'Semua' },
                { value: 'primary', label: 'Prioritas' },
                { value: 'candidate', label: 'Kandidat' },
                { value: 'future', label: 'Masa Depan' },
              ].map(filter => (
                <button
                  key={filter.value}
                  className={`${styles.filterBtn} ${filterStatus === filter.value ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilterStatus(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch} />
            <span>Heatmap energi</span>
          </label>
        </div>

        {/* Location List */}
        <div className={styles.panelSection}>
          <h4 className={styles.panelSectionTitle}>📍 Lokasi ({filteredLocations.length})</h4>
          <div className={styles.locationList}>
            {filteredLocations.map(loc => {
              const power = wavePower(loc.waveData.hsAvg, loc.waveData.tpAvg);
              const potential = classifyPotential(power);
              const isActive = activeLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  className={`${styles.locationItem} ${isActive ? styles.locationItemActive : ''}`}
                  onClick={() => setActiveLocation(isActive ? null : loc.id)}
                >
                  <div className={styles.locationDot} style={{ background: potential.color }} />
                  <div className={styles.locationInfo}>
                    <span className={styles.locationName}>{loc.name}</span>
                    <span className={styles.locationMeta}>
                      {power.toFixed(1)} kW/m · P{loc.priority}
                    </span>
                  </div>
                  <span className={styles.locationBadge} style={{
                    color: potential.color,
                    background: `${potential.color}15`,
                    borderColor: `${potential.color}30`,
                  }}>
                    {potential.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wave Power Calculator */}
        <div className={styles.panelSection}>
          <h4 className={styles.panelSectionTitle}>📐 Kalkulator Daya</h4>
          <div className={styles.calcGrid}>
            <div className={styles.calcField}>
              <label>Hs (m)</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={calcHs}
                onChange={e => setCalcHs(parseFloat(e.target.value))}
                className={styles.calcSlider}
              />
              <span className={styles.calcValue}>{calcHs.toFixed(1)}</span>
            </div>
            <div className={styles.calcField}>
              <label>Tp (s)</label>
              <input
                type="range"
                min="4"
                max="18"
                step="0.5"
                value={calcTp}
                onChange={e => setCalcTp(parseFloat(e.target.value))}
                className={styles.calcSlider}
              />
              <span className={styles.calcValue}>{calcTp.toFixed(1)}</span>
            </div>
            <div className={styles.calcField}>
              <label>Capture Width (m)</label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={calcWidth}
                onChange={e => setCalcWidth(parseFloat(e.target.value))}
                className={styles.calcSlider}
              />
              <span className={styles.calcValue}>{calcWidth.toFixed(1)}</span>
            </div>
            <div className={styles.calcField}>
              <label>Efisiensi (%)</label>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={calcEfficiency}
                onChange={e => setCalcEfficiency(parseInt(e.target.value))}
                className={styles.calcSlider}
              />
              <span className={styles.calcValue}>{calcEfficiency}%</span>
            </div>
          </div>

          <div className={styles.calcResults}>
            <div className={styles.calcResult}>
              <span>Wave Power</span>
              <strong style={{ color: calcPotential.color }}>{calcPower.toFixed(1)} kW/m</strong>
            </div>
            <div className={styles.calcResult}>
              <span>Converter Output</span>
              <strong>{calcOutput.toFixed(1)} kW</strong>
            </div>
            <div className={styles.calcResult}>
              <span>Annual Energy</span>
              <strong>{calcAnnual.toFixed(1)} MWh/m/yr</strong>
            </div>
            <div className={styles.calcResultBig}>
              <span>Potensi</span>
              <strong style={{ color: calcPotential.color }}>{calcPotential.label}</strong>
            </div>
          </div>

          <div className={styles.calcFormula}>
            <code>P = (ρg²TH²) / (64π)</code>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.panelSection}>
          <h4 className={styles.panelSectionTitle}>🎨 Legenda</h4>
          <div className={styles.legend}>
            {[
              { color: '#10b981', label: 'Sangat Tinggi (≥30 kW/m)' },
              { color: '#0091cc', label: 'Tinggi (20–30 kW/m)' },
              { color: '#ffc926', label: 'Sedang (10–20 kW/m)' },
              { color: '#f97316', label: 'Rendah (5–10 kW/m)' },
              { color: '#ef4444', label: 'Minimal (<5 kW/m)' },
            ].map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.legendMarkers}>
            <div className={styles.legendItem}>
              <span className={styles.legendCircle} style={{ width: 16, height: 16 }} />
              <span>Prioritas utama</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendCircle} style={{ width: 12, height: 12 }} />
              <span>Kandidat</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendCircle} style={{ width: 8, height: 8 }} />
              <span>Masa depan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={styles.mapContainer}>
        <MapContainer
          center={MAP_CONFIG.center}
          zoom={MAP_CONFIG.zoom}
          minZoom={MAP_CONFIG.minZoom}
          maxZoom={MAP_CONFIG.maxZoom}
          className={styles.leafletMap}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <FitBoundsButton />

          {/* Heatmap Layer (simplified as circles) */}
          {showHeatmap && heatmapPoints.map((point, i) => (
            <Circle
              key={`heat-${i}`}
              center={[point.lat, point.lng]}
              radius={5000}
              pathOptions={{
                fillColor: classifyPotential(point.intensity).color,
                fillOpacity: 0.12,
                stroke: false,
              }}
            />
          ))}

          {/* Location Markers */}
          {filteredLocations.map(location => (
            <CircleMarker
              key={location.id}
              center={location.coords}
              {...getMarkerStyle(location)}
              eventHandlers={{
                click: () => setActiveLocation(location.id === activeLocation ? null : location.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} className={styles.markerTooltip}>
                <strong>{location.name}</strong> — {wavePower(location.waveData.hsAvg, location.waveData.tpAvg).toFixed(1)} kW/m
              </Tooltip>
              <Popup maxWidth={420} className={styles.leafletPopup}>
                <LocationPopupContent location={location} />
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
