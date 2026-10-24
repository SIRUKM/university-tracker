import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Plus, Loader2 } from 'lucide-react';

export default function SearchBar({ onAddUniversity }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch German universities directly from HipoLabs' official HTTPS GitHub CDN
  useEffect(() => {
    axios
      .get('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json')
      .then((res) => {
        const germanUnis = res.data.filter((uni) => uni.country === 'Germany');
        setUniversities(germanUnis);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching universities:', err);
        setError('Failed to load university list. You can still type and add manually.');
        setLoading(false);
      });
  }, []);

  // Filter universities based on search query
  const autocompleteResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return universities
      .filter((uni) => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, universities]);

  const handleSelect = (uniOrName) => {
    if (typeof uniOrName === 'string') {
      onAddUniversity(uniOrName, '');
    } else {
      const websiteUrl = uniOrName.web_pages?.[0] || '';
      onAddUniversity(uniOrName.name, websiteUrl);
    }
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSelect(searchQuery.trim());
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          disabled={loading && universities.length === 0}
          placeholder={
            loading
              ? 'Loading German universities...'
              : 'Search university or type custom name & press Enter...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm disabled:bg-gray-50 disabled:text-gray-400"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 animate-spin" />
        )}
      </div>

      {error && <p className="text-xs text-amber-600 mt-2">{error}</p>}

      {/* Autocomplete Dropdown with Custom Add Option */}
      {searchQuery.trim().length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={() => handleSelect(searchQuery.trim())}
            className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border-b border-gray-200 flex items-center justify-between group transition-colors"
          >
            <span className="font-semibold text-black text-sm">
              Add custom: &quot;{searchQuery}&quot;
            </span>
            <div className="flex items-center space-x-1 text-xs text-black font-semibold">
              <span>Create</span>
              <Plus className="h-4 w-4" />
            </div>
          </button>

          {autocompleteResults.map((uni, idx) => {
            const domain = uni.domains?.[0] || '';
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(uni)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2 min-w-0 pr-3">
                  <span className="font-medium text-gray-800 group-hover:text-black text-sm truncate">
                    {uni.name}
                  </span>
                  {domain && (
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono shrink-0">
                      {domain}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-black font-medium shrink-0">
                  <span>Add</span>
                  <Plus className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
