import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

mapboxgl.accessToken = MAPBOX_TOKEN;

interface LocationData {
  name: string;
  lng: number;
  lat: number;
}

interface TripMapProps {
  origin: LocationData | null;
  destination: LocationData | null;
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  rainChance: number;
  windSpeed: number;
  weatherCode: number;
}

export function TripMap({
  origin,
  destination,
}: TripMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const [trafficLevel, setTrafficLevel] = useState('Checking traffic...');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const originMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);

  // Create map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/standard',
      center: [72.8777, 19.076],
      zoom: 7,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add traffic layer
  useEffect(() => {
    const currentMap = map.current;

    if (!currentMap) return;

    const addTrafficLayer = () => {
      if (currentMap.getSource('tripforge-traffic')) return;

      currentMap.addSource('tripforge-traffic', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-traffic-v1',
      });

      currentMap.addLayer({
        id: 'tripforge-traffic-layer',
        type: 'line',
        source: 'tripforge-traffic',
        'source-layer': 'traffic',
        minzoom: 7,
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-width': 2.5,
          'line-opacity': 0.75,
          'line-color': [
            'match',
            ['get', 'congestion'],
            'low',
            '#22c55e',
            'moderate',
            '#eab308',
            'heavy',
            '#f97316',
            'severe',
            '#ef4444',
            '#94a3b8',
          ],
        },
      });
    };

    if (currentMap.isStyleLoaded()) {
      addTrafficLayer();
    } else {
      currentMap.once('load', addTrafficLayer);
    }
  }, []);

  // Update markers and route
  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;

    // Remove old markers
    originMarker.current?.remove();
    destinationMarker.current?.remove();

    if (origin) {
      originMarker.current = new mapboxgl.Marker({
        color: '#7f1d3a',
      })
        .setLngLat([origin.lng, origin.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>Origin</strong><br/>${origin.name}`
          )
        )
        .addTo(currentMap);
    }

    if (destination) {
      destinationMarker.current = new mapboxgl.Marker({
        color: '#c85f72',
      })
        .setLngLat([destination.lng, destination.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>Destination</strong><br/>${destination.name}`
          )
        )
        .addTo(currentMap);
    }

    // If only one location is selected
    if (!origin || !destination) {
      const location = origin || destination;

      if (location) {
        currentMap.flyTo({
          center: [location.lng, location.lat],
          zoom: 10,
          duration: 1000,
        });
      }

      return;
    }

    // Both locations selected
    loadRoute(origin, destination);
    loadWeather(destination);

  }, [origin, destination]);

  async function loadRoute(
    start: LocationData,
    end: LocationData
  ) {
    try {
      setTrafficLevel('Checking traffic...');

      const coordinates =
        `${start.lng},${start.lat};${end.lng},${end.lat}`;

      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordinates}` +
        `?alternatives=true` +
        `&geometries=geojson` +
        `&overview=full` +
        `&steps=true` +
        `&annotations=congestion` +
        `&access_token=${MAPBOX_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Route request failed');
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        setRouteInfo(null);
        setTrafficLevel('Route unavailable');
        return;
      }

      const route = data.routes[0];

      setRouteInfo({
        distance: route.distance,
        duration: route.duration,
      });

      // Calculate traffic status
      const typicalDuration =
        route.duration_typical || route.duration;

      const delay =
        route.duration - typicalDuration;

      if (delay > 20 * 60) {
        setTrafficLevel('Heavy traffic');
      } else if (delay > 8 * 60) {
        setTrafficLevel('Moderate traffic');
      } else {
        setTrafficLevel('Light traffic');
      }

      const currentMap = map.current;

      if (!currentMap) return;

      const routeGeoJSON = {
        type: 'Feature',
        properties: {},
        geometry: route.geometry,
      };

      if (currentMap.getSource('tripforge-route')) {
        (
          currentMap.getSource(
            'tripforge-route'
          ) as mapboxgl.GeoJSONSource
        ).setData(routeGeoJSON as any);
      } else {
        currentMap.addSource('tripforge-route', {
          type: 'geojson',
          data: routeGeoJSON as any,
        });

        currentMap.addLayer({
          id: 'tripforge-route-layer',
          type: 'line',
          source: 'tripforge-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#c85f72',
            'line-width': 5,
            'line-opacity': 0.9,
          },
        });
      }

      // Fit map around both locations
      const bounds = new mapboxgl.LngLatBounds();

      bounds.extend([start.lng, start.lat]);
      bounds.extend([end.lng, end.lat]);

      currentMap.fitBounds(bounds, {
        padding: 70,
        duration: 1000,
      });

    } catch (error) {
      console.error('Route error:', error);
      setTrafficLevel('Traffic unavailable');
    }
  }

  async function loadWeather(location: LocationData) {
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${location.lat}` +
        `&longitude=${location.lng}` +
        `&current=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m` +
        `&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Weather request failed');
      }

      const data = await response.json();

      setWeather({
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        rainChance:
          data.current.precipitation_probability,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
      });

    } catch (error) {
      console.error('Weather error:', error);
      setWeather(null);
    }
  }

  function getWeatherText(code: number) {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Cloudy';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain showers';
    if (code <= 86) return 'Snow showers';
    if (code >= 95) return 'Thunderstorm';

    return 'Mixed weather';
  }

  function formatDistance(meters: number) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }

    return `${(meters / 1000).toFixed(1)} km`;
  }

  function formatDuration(seconds: number) {
    const minutes = Math.round(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-[#e8d8dc] bg-white shadow-sm">

      {/* Map */}
      <div
        ref={mapContainer}
        className="w-full h-[420px]"
      />

      {/* Route information */}
      {routeInfo && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border-t border-[#eadde0]">

          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">
              Distance
            </div>
            <div className="font-semibold text-[#3a1a22]">
              {formatDistance(routeInfo.distance)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">
              ETA
            </div>
            <div className="font-semibold text-[#3a1a22]">
              {formatDuration(routeInfo.duration)}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">
              Traffic
            </div>
            <div className="font-semibold text-[#3a1a22]">
              {trafficLevel}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500">
              Weather
            </div>

            {weather ? (
              <div>
                <div className="font-semibold text-[#3a1a22]">
                  {Math.round(weather.temperature)}°C
                </div>

                <div className="text-[10px] text-gray-500">
                  {getWeatherText(weather.weatherCode)}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Loading...
              </div>
            )}
          </div>

        </div>
      )}

      {/* Weather details */}
      {weather && (
        <div className="px-4 pb-4">
          <div className="rounded-xl bg-[#faf5f6] border border-[#eadde0] p-3">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500">
                  Destination Weather
                </div>

                <div className="font-semibold text-[#3a1a22] mt-1">
                  {getWeatherText(weather.weatherCode)}
                </div>
              </div>

              <div className="text-2xl font-bold text-[#7f1d3a]">
                {Math.round(weather.temperature)}°C
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3 mt-3 text-xs text-gray-600">

              <div>
                Feels like
                <div className="font-semibold text-[#3a1a22]">
                  {Math.round(weather.feelsLike)}°C
                </div>
              </div>

              <div>
                Rain chance
                <div className="font-semibold text-[#3a1a22]">
                  {weather.rainChance}%
                </div>
              </div>

              <div>
                Wind
                <div className="font-semibold text-[#3a1a22]">
                  {Math.round(weather.windSpeed)} km/h
                </div>
              </div>

            </div>

          </div>

          <div className="text-[9px] text-gray-400 mt-2">
            Weather data by Open-Meteo
          </div>
        </div>
      )}

    </div>
  );
}