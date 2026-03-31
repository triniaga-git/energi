import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'RD101 — Portal Riset Nusantara | Energi Gelombang Laut',
  description: 'Platform riset dan dokumentasi engineering untuk pengembangan energi gelombang laut Indonesia. Wave-Spring Hydraulic Converter — Kedaulatan Energi Berbasis Karakteristik Geografis.',
  keywords: 'energi gelombang, wave energy, Indonesia, riset, engineering, Samudra Hindia, energi terbarukan',
  openGraph: {
    title: 'RD101 — Portal Riset Nusantara',
    description: 'Mewujudkan Kedaulatan Energi Berbasis Karakteristik Geografis Indonesia',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="page-layout">
          <Sidebar />
          <main className="page-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
