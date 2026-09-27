import { useEffect, useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationData {
  name: string;
  lng: number;
  lat: number;
}

interface LocationSearchProps {
  label: string;
  value: LocationData | null;
  placeholder: string;
  onSelect: (location: LocationData) => void;
}

export function LocationSearch({
  label,
  value,
  placeholder,
  onSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    setQuery(value?.name || '');
  }, [value]);

  useEffect(() => {
    if (!query.trim() || value?.name === query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const url =
          `https://api.mapbox.com/search/searchbox/v1/forward` +
          `?q=${encodeURIComponent(query)}` +
          `&limit=5` +
          `&language=en` +
          `&country=IN` +
          `&access_token=${TOKEN}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Location search failed');
        }

        const data = await response.json();

        setResults(data.features || []);
      } catch (error) {
        console.error('Location search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, TOKEN, value?.name]);

  const handleSelect = (feature: any) => {
    const coordinates = feature.geometry.coordinates;

    const name =
      feature.properties?.full_address ||
      feature.properties?.name ||
      feature.properties?.place_formatted ||
      'Selected location';

    const location: LocationData = {
      name,
      lng: coordinates[0],
      lat: coordinates[1],
    };

    setQuery(name);
    setResults([]);

    onSelect(location);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-[#3a1a22] uppercase tracking-wider mb-1.5">
        {label}
      </label>

      <div className="relative">
        <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#c85f72]" />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);

            if (value) {
              onSelect({
                name: '',
                lng: 0,
                lat: 0,
              });
            }
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#EF9CA7]/50 text-xs sm:text-sm text-[#3a1a22] bg-[#FCF8F9] focus:outline-none focus:border-[#c85f72]"
        />

        {loading ? (
          <Loader2 className="w-4 h-4 absolute right-3 top-3 text-[#c85f72] animate-spin" />
        ) : (
          <Search className="w-4 h-4 absolute right-3 top-3 text-[#c85f72]/60" />
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-[#EF9CA7]/40 rounded-xl shadow-lg overflow-hidden">
          {results.map((feature, index) => {
            const name =
              feature.properties?.full_address ||
              feature.properties?.name ||
              feature.properties?.place_formatted ||
              'Location';

            return (
              <button
                type="button"
                key={feature.id || index}
                onClick={() => handleSelect(feature)}
                className="w-full text-left px-3 py-3 hover:bg-[#FFF5F6] border-b last:border-b-0 border-[#EF9CA7]/20 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#c85f72] shrink-0" />

                  <div>
                    <div className="text-xs font-semibold text-[#3a1a22]">
                      {feature.properties?.name || name}
                    </div>

                    <div className="text-[10px] text-[#3a1a22]/60 mt-0.5">
                      {feature.properties?.place_formatted || name}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="px-3 py-2 text-[9px] text-gray-400 border-t border-[#EF9CA7]/20">
            Powered by Mapbox
          </div>
        </div>
      )}
    </div>
  );
}