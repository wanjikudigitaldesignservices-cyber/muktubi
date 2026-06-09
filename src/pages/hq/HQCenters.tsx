// ============================================================
// MUKTUBI — HQ Centers Page
// Table of all 38 MOHI centers with details
// ============================================================

import { useState } from 'react';
import { DEMO_CENTERS, DEMO_PROFILES } from '@/lib/demo-data';
import { formatNumber } from '@/lib/utils';
import {
  Search,
  Plus,
  Building2,
  MapPin,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function HQCenters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  const regions = [...new Set(DEMO_CENTERS.map((c) => c.region))].sort();

  const filteredCenters = DEMO_CENTERS.filter((center) => {
    const matchesSearch = searchQuery === '' ||
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === '' || center.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  // Get librarian for each center
  const getLibrarian = (centerId: string) => {
    return DEMO_PROFILES.find(p => p.center_id === centerId && p.role === 'center_librarian');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">MOHI Centers</h1>
          <p className="page-desc">All {DEMO_CENTERS.length} school centers across Kenya</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Add Center
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search centers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        <span style={{ fontSize: 13, color: '#64748B' }}>
          Showing {filteredCenters.length} of {DEMO_CENTERS.length} centers
        </span>
      </div>

      <div className="chart-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">Center Name</th>
                <th className="table-th">Location</th>
                <th className="table-th">Region</th>
                <th className="table-th text-right">Total Books</th>
                <th className="table-th text-right">Members</th>
                <th className="table-th">Librarian</th>
                <th className="table-th text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCenters.map((center) => {
                const librarian = getLibrarian(center.id);
                return (
                  <tr key={center.id} className="table-row" style={{ cursor: 'pointer' }}>
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: 'var(--mohi-green-50)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--mohi-green)',
                          flexShrink: 0,
                        }}>
                          <Building2 size={16} />
                        </div>
                        <span className="font-medium">{center.name}</span>
                      </div>
                    </td>
                    <td className="table-td text-muted">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} />
                        {center.location}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className="category-badge">{center.region}</span>
                    </td>
                    <td className="table-td text-right font-semibold">{formatNumber(center.total_books)}</td>
                    <td className="table-td text-right font-semibold">{formatNumber(center.active_members)}</td>
                    <td className="table-td text-muted">{librarian?.full_name || '—'}</td>
                    <td className="table-td text-right">
                      <ChevronRight size={16} style={{ color: '#94A3B8' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
