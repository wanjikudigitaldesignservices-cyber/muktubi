// ============================================================
// MUKTUBI — HQ Catalog Page
// Global book catalog with AI auto-fill
// ============================================================

import { useState } from 'react';
import { DEMO_BOOKS } from '@/lib/demo-data';
import { BOOK_CATEGORIES, LANGUAGES } from '@/lib/constants';
import {
  Search,
  Plus,
  Library,
  Sparkles,
  Filter,
  Edit,
  Archive,
} from 'lucide-react';

export default function HQCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  const filteredBooks = DEMO_BOOKS.filter((book) => {
    const matchesSearch = searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || book.category === categoryFilter;
    const matchesLanguage = languageFilter === '' || book.language === languageFilter;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Book Catalog</h1>
          <p className="page-desc">{DEMO_BOOKS.length} titles across all MOHI centers</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Add Book
          <Sparkles size={14} style={{ marginLeft: 4 }} />
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {BOOK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <span style={{ fontSize: 13, color: '#64748B' }}>
          {filteredBooks.length} books
        </span>
      </div>

      <div className="chart-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">Title</th>
                <th className="table-th">Author</th>
                <th className="table-th">Category</th>
                <th className="table-th">Language</th>
                <th className="table-th">Grade Range</th>
                <th className="table-th">ISBN</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="table-row">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="book-thumb">
                        <Library size={14} />
                      </div>
                      <div>
                        <span className="font-medium">{book.title}</span>
                        {book.ai_tags && book.ai_tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                            {book.ai_tags.slice(0, 2).map((tag) => (
                              <span key={tag} style={{
                                fontSize: 10,
                                padding: '1px 6px',
                                borderRadius: 4,
                                background: '#F1F5F9',
                                color: '#64748B',
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-td text-muted">{book.author}</td>
                  <td className="table-td">
                    <span className="category-badge">{book.category}</span>
                  </td>
                  <td className="table-td">
                    <span className="category-badge" style={{
                      background: book.language === 'Swahili' ? '#FEF3C7' : '#F1F5F9',
                      color: book.language === 'Swahili' ? '#92400E' : '#475569',
                    }}>
                      {book.language}
                    </span>
                  </td>
                  <td className="table-td text-muted">{book.grade_range || '—'}</td>
                  <td className="table-td" style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>
                    {book.isbn}
                  </td>
                  <td className="table-td text-right">
                    <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn btn-sm btn-secondary" title="Edit">
                        <Edit size={12} />
                      </button>
                      <button className="btn btn-sm btn-secondary" title="Archive">
                        <Archive size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
