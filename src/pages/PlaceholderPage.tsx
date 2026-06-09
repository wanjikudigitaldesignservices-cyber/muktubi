import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Construction size={48} style={{ color: 'var(--mohi-amber)', marginBottom: 24 }} />
      <h1 className="page-title">{title}</h1>
      <p className="page-desc" style={{ marginTop: 8 }}>
        This module is currently under development.
      </p>
    </div>
  );
}
