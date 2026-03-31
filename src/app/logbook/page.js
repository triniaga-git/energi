'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLogbookEntries, createLogbookEntry, deleteLogbookEntry, seedDemoData } from '@/lib/store';
import styles from './page.module.css';

const CATEGORIES = [
  { value: 'all', label: 'Semua', icon: '📋' },
  { value: 'eksperimen', label: 'Eksperimen', icon: '🧪' },
  { value: 'desain', label: 'Desain', icon: '📐' },
  { value: 'observasi', label: 'Observasi', icon: '🔍' },
  { value: 'lapangan', label: 'Lapangan', icon: '🏖️' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
];

export default function LogbookPage() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'observasi', tags: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedDemoData();
    setEntries(getLogbookEntries());
    setMounted(true);
  }, []);

  const filtered = entries.filter(e => {
    if (filter !== 'all' && e.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.content?.toLowerCase().includes(q) || e.tags?.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCreate = () => {
    if (!formData.title.trim()) return;
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const entry = createLogbookEntry({ ...formData, tags });
    setEntries(getLogbookEntries());
    setShowForm(false);
    setFormData({ title: '', content: '', category: 'observasi', tags: '' });
  };

  const handleDelete = (slug) => {
    if (confirm('Hapus entri ini?')) {
      deleteLogbookEntry(slug);
      setEntries(getLogbookEntries());
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryIcon = (cat) => CATEGORIES.find(c => c.value === cat)?.icon || '📋';

  if (!mounted) return <div className={styles.loading}>Memuat logbook...</div>;

  return (
    <div className={styles.logbook}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>📓 Engineering Logbook</h1>
          <p>Jurnal riset terbuka — setiap eksperimen, keberhasilan, dan kegagalan didokumentasikan</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Batal' : '+ Entri Baru'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className={`glass-card ${styles.formCard}`}>
          <h3>Buat Entri Baru</h3>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Judul</label>
              <input className="input" placeholder="Judul entri logbook..." value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className={styles.formField}>
              <label>Kategori</label>
              <select className="input" value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div className={`${styles.formField} ${styles.formFieldFull}`}>
              <label>Konten (Markdown)</label>
              <textarea className={`input ${styles.textarea}`} rows={10}
                placeholder="Tulis dengan format Markdown..." value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })} />
            </div>
            <div className={styles.formField}>
              <label>Tags (pisahkan koma)</label>
              <input className="input" placeholder="gelombang, analisis, Cilacap" value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button className="btn btn-primary" onClick={handleCreate}>💾 Simpan Entri</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Batal</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterTabs}>
          {CATEGORIES.map(c => (
            <button key={c.value}
              className={`${styles.filterTab} ${filter === c.value ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(c.value)}>
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <input className={`input ${styles.searchInput}`} placeholder="🔍 Cari entri..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <span>{filtered.length} entri</span>
        <span className={styles.statDot}>·</span>
        <span>Fase 1 — Riset Konseptual</span>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📓</span>
            <p>Belum ada entri logbook{filter !== 'all' ? ` dengan kategori "${filter}"` : ''}.</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Buat Entri Pertama</button>
          </div>
        ) : (
          filtered.map((entry, i) => (
            <div key={entry.slug} className={styles.timelineItem}>
              <div className={styles.timelineLine}>
                <div className={styles.timelineDot}>{getCategoryIcon(entry.category)}</div>
                {i < filtered.length - 1 && <div className={styles.timelineConnector} />}
              </div>
              <div className={`glass-card interactive ${styles.entryCard}`}>
                <div className={styles.entryHeader}>
                  <div className={styles.entryMeta}>
                    <span className={styles.entryDate}>{formatDate(entry.createdAt)}</span>
                    <span className={styles.entryTime}>{formatTime(entry.createdAt)}</span>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(entry.slug)} title="Hapus">🗑️</button>
                </div>
                <Link href={`/logbook/${entry.slug}`} className={styles.entryLink}>
                  <h3>{entry.title}</h3>
                </Link>
                <p className={styles.entryPreview}>
                  {entry.content?.replace(/[#*`\[\]]/g, '').slice(0, 180)}...
                </p>
                {entry.tags?.length > 0 && (
                  <div className={styles.entryTags}>
                    {entry.tags.map(tag => (
                      <span key={tag} className="tag" onClick={() => setSearch(tag)}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
