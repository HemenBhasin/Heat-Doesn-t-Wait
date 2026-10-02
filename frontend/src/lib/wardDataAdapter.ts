import { WardRecord, WardGeoJSON, GeoJSONFeature, RiskClass } from '@/types/mapTypes';

// Bounding box for Delhi NCT
export const DELHI_BBOX = {
  minLng: 76.83877,
  maxLng: 77.34747,
  minLat: 28.40425,
  maxLat: 28.88350,
};

// SVG canvas dimensions
export const SVG_WIDTH = 800;
export const SVG_HEIGHT = 840;
export const SVG_PADDING = 30;

/**
 * Projects (lng, lat) coordinates to SVG space with latitude-aspect-ratio correction.
 */
export function projectCoord(lng: number, lat: number): [number, number] {
  const { minLng, maxLng, minLat, maxLat } = DELHI_BBOX;
  const latFactor = Math.cos((28.64 * Math.PI) / 180); // ~0.8776

  const normX = (lng - minLng) / (maxLng - minLng);
  // Invert Y because latitude increases northward while SVG Y increases downward
  const normY = (maxLat - lat) / (maxLat - minLat);

  const innerW = SVG_WIDTH - SVG_PADDING * 2;
  const innerH = SVG_HEIGHT - SVG_PADDING * 2;

  // Preserve geographic aspect ratio
  const geoW = (maxLng - minLng) * latFactor;
  const geoH = maxLat - minLat;
  const scale = Math.min(innerW / geoW, innerH / geoH);

  const offsetX = SVG_PADDING + (innerW - geoW * scale) / 2;
  const offsetY = SVG_PADDING + (innerH - geoH * scale) / 2;

  const x = offsetX + (lng - minLng) * latFactor * scale;
  const y = offsetY + (maxLat - lat) * scale;

  return [x, y];
}

/**
 * Converts a GeoJSON Polygon or MultiPolygon coordinate ring into an SVG path string.
 */
export function coordinatesToSvgPath(geometry: GeoJSONFeature['geometry']): string {
  if (!geometry || !geometry.coordinates) return '';

  function ringToPath(ring: [number, number][]): string {
    if (!ring || ring.length === 0) return '';
    const points = ring.map(([lng, lat]) => projectCoord(lng, lat));
    return points.reduce((acc, [x, y], idx) => {
      const sx = x.toFixed(1);
      const sy = y.toFixed(1);
      return idx === 0 ? `M ${sx},${sy}` : `${acc} L ${sx},${sy}`;
    }, '') + ' Z';
  }

  if (geometry.type === 'Polygon') {
    return geometry.coordinates.map(ringToPath).join(' ');
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates
      .map((polygonRings) => polygonRings.map(ringToPath).join(' '))
      .join(' ');
  }

  return '';
}

/**
 * Categorizes heat_risk_score into standard risk classes.
 */
export function getRiskClass(score: number | null | undefined): 'HOTSPOT' | 'HIGH' | 'MODERATE' | 'LOW' {
  if (score === null || score === undefined || isNaN(score)) return 'LOW';
  if (score >= 80) return 'HOTSPOT';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MODERATE';
  return 'LOW';
}

export function matchesRiskClass(score: number | null | undefined, filter: RiskClass): boolean {
  if (filter === 'ALL') return true;
  const actualClass = getRiskClass(score);
  return actualClass === filter;
}

/**
 * Realistic vector path of the Yamuna River flowing through Delhi.
 */
export const YAMUNA_RIVER_COORDS: [number, number][] = [
  [77.206, 28.878],
  [77.214, 28.845],
  [77.220, 28.805],
  [77.228, 28.756],
  [77.234, 28.718],
  [77.231, 28.694],
  [77.242, 28.673],
  [77.249, 28.656],
  [77.254, 28.638],
  [77.258, 28.618],
  [77.262, 28.595],
  [77.275, 28.575],
  [77.302, 28.553],
  [77.318, 28.532],
  [77.329, 28.508],
  [77.338, 28.485],
  [77.345, 28.455],
];

export function getYamunaSvgPath(): string {
  const projected = YAMUNA_RIVER_COORDS.map(([lng, lat]) => projectCoord(lng, lat));
  return projected.reduce((acc, [x, y], idx) => {
    return idx === 0 ? `M ${x.toFixed(1)},${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)},${y.toFixed(1)}`;
  }, '');
}

/**
 * Fetch ward GeoJSON with synthetic fallback.
 */
export async function loadWardGeoJSON(): Promise<WardGeoJSON> {
  try {
    const res = await fetch('/data/delhi_250_wards.geojson');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data: WardGeoJSON = await res.json();
    return data;
  } catch (err) {
    console.warn('Could not load /data/delhi_250_wards.geojson, trying JSON dataset fallback...', err);
    return loadFallbackGeoJSON();
  }
}

/**
 * Fallback generator for 250 grid wards if GeoJSON file is temporarily unavailable.
 */
export async function loadFallbackGeoJSON(): Promise<WardGeoJSON> {
  let wardsData: WardRecord[] = [];
  try {
    const res = await fetch('/data/delhi_250_wards_synthetic_dataset.json');
    if (res.ok) {
      wardsData = await res.json();
    }
  } catch (e) {
    console.error('Failed to load synthetic dataset json', e);
  }

  // Generate synthetic polygonal cells covering Delhi bounds
  const cols = 16;
  const rows = 16;
  const { minLng, maxLng, minLat, maxLat } = DELHI_BBOX;
  const stepX = (maxLng - minLng) / cols;
  const stepY = (maxLat - minLat) / rows;

  const features: GeoJSONFeature[] = [];

  for (let i = 0; i < 250; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);

    const x1 = minLng + c * stepX;
    const x2 = x1 + stepX * 0.95;
    const y1 = maxLat - r * stepY;
    const y2 = y1 - stepY * 0.95;

    const baseRecord = wardsData[i] || {
      ward_id: i + 1,
      ward_name: `Ward ${String(i + 1).padStart(3, '0')}`,
      population: 40000 + Math.floor(Math.sin(i) * 20000),
      area_km2: 6.0,
      pop_density: 8000,
      avg_temperature_c: 37.5,
      AQI: 120,
      green_cover_pct: 18.0,
      tree_cover_pct: 9.0,
      built_up_pct: 72.0,
      relative_humidity_pct: 46.0,
      heat_index_c: 39.5,
      heat_risk_score: 50.0,
    };

    features.push({
      type: 'Feature',
      id: baseRecord.ward_id,
      properties: {
        ...baseRecord,
        centroid: [(x1 + x2) / 2, (y1 + y2) / 2],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [x1, y1],
            [x2, y1],
            [x2, y2],
            [x1, y2],
            [x1, y1],
          ],
        ],
      },
    });
  }

  return {
    type: 'FeatureCollection',
    name: 'Delhi_250_Wards_Fallback',
    features,
  };
}
