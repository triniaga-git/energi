'use client';

import { useState, useEffect } from 'react';
import { getComponents, createComponent, deleteComponent, validateComponentId, getTKDNStats, seedDemoData, VALID_CATEGORIES, CATEGORY_LABELS } from '@/lib/store';
import styles from './page.module.css';

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [tkdn, setTkdn] = useState({ total: 0, local: 0, principal: 0, percentage: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ componentId: '', name: '', description: '', isLocal: false, isMissionCritical: false, supplier: '', status: 'Design' });
  const [formError, setFormError] = useState('');
  const [mounted, setMounted] = useState(false);

  const refresh = () => {
    const filters = {};
    if (filter !== 'all') filters.category = filter;
    if (search) filters.search = search;
    setComponents(getComponents(filters));
    setTkdn(getTKDNStats());
  };

  useEffect(() => { seedDemoData(); setMounted(true); }, []);
  useEffect(() => { if (mounted) refresh(); }, [mounted, filter, search]);

  const handleCreate = () => {
    setFormError('');
    const validation = validateComponentId(formData.componentId);
    if (!validation.valid) { setFormError(validation.error); return; }
    if (!formData.name.trim()) { setFormError('Nama komponen wajib diisi.'); return; }
    createComponent(formData);
    refresh();
    setShowForm(false);
    setFormData({ componentId: '', name: '', description: '', isLocal: false, isMissionCritical: false, supplier: '', status: 'Design' });
  };

  const handleDelete = (id) => {
    if (confirm(`Hapus komponen ${id}?`)) { deleteComponent(id); refresh(); }
  };

  if (!mounted) return <div className={styles.loading}>Memuat registry...</div>;

  return (
    <div className={styles.registry}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>🔧 Component Registry</h1>
          <p>Database komponen "Perahu Pegas" — format ID: <code>[3HURUF][3DIGIT]</code></p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Komponen Baru'}
        </button>
      </div>

      {/* TKDN Stats */}
      <div className={styles.tkdnBar}>
        <div className={styles.tkdnInfo}>
          <span className={styles.tkdnLabel}>TKDN Progress</span>
          <span className={styles.tkdnValue}>{tkdn.percentage}%</span>
        </div>
        <div className={styles.tkdnTrack}>
          <div className={styles.tkdnFill} style={{ width: `${tkdn.percentage}%` }} />
          <div className={styles.tkdnTarget} style={{ left: '70%' }}>
            <span>Target 70%</span>
          </div>
        </div>
        <div className={styles.tkdnDetails}>
          <span>🟢 Lokal: {tkdn.local}</span>
          <span>🔴 Principal: {tkdn.principal}</span>
          <span>📦 Total: {tkdn.total}</span>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className={`glass-card ${styles.formCard}`}>
          <h3>Registrasi Komponen Baru</h3>
          {formError && <div className={styles.formError}>⚠️ {formError}</div>}
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>ID Komponen *</label>
              <input className="input" placeholder="HYD001" value={formData.componentId}
                onChange={e => setFormData({ ...formData, componentId: e.target.value.toUpperCase() })}
                maxLength={6} style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }} />
              <span className={styles.hint}>Format: BRG/HYD/SPR/SEN/GEN/ELC/STR + 3 digit</span>
            </div>
            <div className={styles.formField}>
              <label>Nama Komponen *</label>
              <input className="input" placeholder="Pompa Hidrolik Presisi" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Deskripsi</label>
              <textarea className={`input ${styles.textareaSmall}`} rows={3} placeholder="Deskripsi teknis komponen..."
                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className={styles.formField}>
              <label>Supplier</label>
              <input className="input" placeholder="Nama supplier / vendor" value={formData.supplier}
                onChange={e => setFormData({ ...formData, supplier: e.target.value })} />
            </div>
            <div className={styles.formField}>
              <label>Status</label>
              <select className="input" value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Design">Design</option>
                <option value="Prototype">Prototype</option>
                <option value="Testing">Testing</option>
                <option value="Production">Production</option>
              </select>
            </div>
            <div className={styles.checkboxRow}>
              <label className={styles.checkbox}>
                <input type="checkbox" checked={formData.isLocal}
                  onChange={e => setFormData({ ...formData, isLocal: e.target.checked })} />
                <span>🇮🇩 Produksi Lokal (TKDN)</span>
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" checked={formData.isMissionCritical}
                  onChange={e => setFormData({ ...formData, isMissionCritical: e.target.checked })} />
                <span>⚡ Mission-Critical</span>
              </label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button className="btn btn-primary" onClick={handleCreate}>💾 Registrasi</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Batal</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterTabs}>
          <button className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
            onClick={() => setFilter('all')}>Semua</button>
          {VALID_CATEGORIES.map(cat => (
            <button key={cat}
              className={`${styles.filterTab} ${filter === cat ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <input className={`input ${styles.searchInput}`} placeholder="🔍 Cari komponen..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Lokal</th>
              <th>Kritis</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {components.length === 0 ? (
              <tr><td colSpan={8} className={styles.emptyRow}>Tidak ada komponen ditemukan.</td></tr>
            ) : components.map(comp => (
              <tr key={comp.componentId}>
                <td><code className={styles.compId}>{comp.componentId}</code></td>
                <td>
                  <div className={styles.compName}>{comp.name}</div>
                  {comp.description && <div className={styles.compDesc}>{comp.description.slice(0, 60)}...</div>}
                </td>
                <td><span className={styles.catBadge}>{CATEGORY_LABELS[comp.category] || comp.category}</span></td>
                <td className={styles.supplier}>{comp.supplier || '—'}</td>
                <td><span className={`${styles.statusBadge} ${styles[`status${comp.status}`]}`}>{comp.status}</span></td>
                <td>{comp.isLocal ? '🟢' : '🔴'}</td>
                <td>{comp.isMissionCritical ? '⚡' : '—'}</td>
                <td><button className={styles.deleteBtn} onClick={() => handleDelete(comp.componentId)}>🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
