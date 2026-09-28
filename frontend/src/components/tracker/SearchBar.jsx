import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, Plus, Loader2 } from 'lucide-react';

export default function SearchBar({ onAddUniversity }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch German universities on component mount
  useEffect(() => {
    // This routes the insecure HTTP request through a secure HTTPS proxy
    axios.get('https://api.allorigins.win/raw?url=http%3A%2F%2Funiversities.hipolabs.com%2Fsearch%3Fcountry%3DGermany')
      .then(res => {
        setUniversities(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching universities:", err);
        setError("Failed to load university list. You can still type and add manually.");
        setLoading(false);
      });
  }, []);

  // Filter universities based on search query
  const autocompleteResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return universities
      .filter(uni => uni.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5); // Limit to top 5 results for a clean UI
  }, [searchQuery, universities]);

  const handleSelect = (uniName) => {
    onAddUniversity(uniName);
    setSearchQuery(''); // Clear search after adding
  };

  const handleKeyDown = (e) => {
    // Allows pressing 'Enter' to add whatever custom name is typed if API doesn't list it
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
          placeholder={loading ? "Loading German universities..." : "Search university or type custom name & press Enter..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm disabled:bg-gray-50 disabled:text-gray-400"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 animate-spin" />
        )}
      </div>

      {error && (
        <p className="text-xs text-amber-600 mt-2">{error}</p>
      )}

      {/* Autocomplete Dropdown with Custom Add Option */}
      {searchQuery.trim().length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Option to add whatever the user explicitly typed as a custom entry */}
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

          {/* API Results */}
          {autocompleteResults.map((uni, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(uni.name)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center justify-between group transition-colors"
            >
              <span className="font-medium text-gray-800 group-hover:text-black text-sm">{uni.name}</span>
              <div className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-black font-medium">
                <span>Add</span>
                <Plus className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
