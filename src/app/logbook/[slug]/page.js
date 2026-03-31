'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLogbookEntry, updateLogbookEntry, seedDemoData } from '@/lib/store';
import styles from './page.module.css';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^- \[x\] (.+)$/gm, '<div class="' + styles.checkItem + ' ' + styles.checked + '">✅ $1</div>')
    .replace(/^- \[ \] (.+)$/gm, '<div class="' + styles.checkItem + '">⬜ $1</div>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return '';
      const tag = 'td';
      return '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>)/gs, '<table>$1</table>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[huptld])/gm, '')
    ;
}

export default function LogbookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedDemoData();
    const found = getLogbookEntry(params.slug);
    if (found) {
      setEntry(found);
      setEditContent(found.content || '');
    }
    setMounted(true);
  }, [params.slug]);

  const handleSave = () => {
    const updated = updateLogbookEntry(entry.slug, { content: editContent });
    setEntry(updated);
    setEditing(false);
  };

  if (!mounted) return <div className={styles.loading}>Memuat...</div>;
  if (!entry) return (
    <div className={styles.notFound}>
      <h2>Entri tidak ditemukan</h2>
      <p>Slug: {params.slug}</p>
      <Link href="/logbook" className="btn btn-primary">← Kembali ke Logbook</Link>
    </div>
  );

  const formatDate = (iso) => new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={styles.detail}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/logbook">📓 Logbook</Link>
        <span>/</span>
        <span>{entry.title}</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.date}>{formatDate(entry.createdAt)}</span>
          {entry.updatedAt !== entry.createdAt && (
            <span className={styles.updated}>· diubah {new Date(entry.updatedAt).toLocaleDateString('id-ID')}</span>
          )}
        </div>
        <h1>{entry.title}</h1>
        {entry.tags?.length > 0 && (
          <div className={styles.tags}>
            {entry.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => editing ? handleSave() : setEditing(true)}>
          {editing ? '💾 Simpan' : '✏️ Edit'}
        </button>
        {editing && <button className="btn btn-ghost" onClick={() => { setEditing(false); setEditContent(entry.content); }}>Batal</button>}
      </div>

      {/* Content */}
      {editing ? (
        <div className={styles.editor}>
          <textarea className={`input ${styles.editorTextarea}`} value={editContent}
            onChange={e => setEditContent(e.target.value)} rows={20} />
          <div className={styles.editorHint}>Format Markdown didukung: ## heading, **bold**, *italic*, `code`, - list</div>
        </div>
      ) : (
        <article className={styles.content} dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.content) }} />
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <Link href="/logbook" className="btn btn-ghost">← Kembali ke Logbook</Link>
        <span className={styles.footerMeta}>ID: {entry.id}</span>
      </div>
    </div>
  );
}
