'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
  {
    label: 'Beranda',
    href: '/',
    icon: '🏠',
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    label: 'Logbook',
    href: '/logbook',
    icon: '📓',
  },
  {
    label: 'Komponen',
    href: '/components',
    icon: '🔧',
  },
  {
    label: 'Peta Energi',
    href: '/map',
    icon: '🗺️',
  },
  {
    label: 'Knowledge Base',
    href: '/knowledge',
    icon: '📚',
  },
];

const bottomItems = [
  {
    label: 'Tentang RD101',
    href: '/about',
    icon: '💡',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigasi"
      >
        <span className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.mobileOpen : ''}`}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🌊</div>
          {!collapsed && (
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>RD101</span>
              <span className={styles.logoSubtitle}>Portal Riset</span>
            </div>
          )}
        </div>

        {/* Project Badge */}
        {!collapsed && (
          <div className={styles.projectBadge}>
            <div className={styles.pulseIndicator}>
              <span className={styles.pulseDot}></span>
              <span>Fase 1 — Aktif</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {!collapsed && <span className={styles.navLabel}>Menu Utama</span>}
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className={styles.navText}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.navBadge}>{item.badge}</span>
                      )}
                    </>
                  )}
                  {isActive && <span className={styles.activeIndicator} />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navText}>{item.label}</span>}
              </Link>
            );
          })}

          {/* Collapse Toggle */}
          <button
            className={`${styles.navItem} ${styles.collapseBtn}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className={styles.navIcon}>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span className={styles.navText}>Perkecil menu</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
