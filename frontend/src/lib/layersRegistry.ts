import { LayerConfig, LayerId } from '@/types/mapTypes';

// Helper to interpolate between color stops
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateColor(
  value: number | null | undefined,
  min: number,
  max: number,
  stops: { stop: number; color: string }[],
  fallback = '#1e211e'
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  const clampedVal = Math.max(min, Math.min(max, value));
  const t = max === min ? 0 : (clampedVal - min) / (max - min);

  // Find bounding stops
  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].stop && t <= stops[i + 1].stop) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.stop - lower.stop;
  const localT = range === 0 ? 0 : (t - lower.stop) / range;

  const rgb1 = hexToRgb(lower.color);
  const rgb2 = hexToRgb(upper.color);

  const r = rgb1[0] + (rgb2[0] - rgb1[0]) * localT;
  const g = rgb1[1] + (rgb2[1] - rgb1[1]) * localT;
  const b = rgb1[2] + (rgb2[2] - rgb1[2]) * localT;

  return rgbToHex(r, g, b);
}

export const LAYERS_REGISTRY: Record<LayerId, LayerConfig> = {
  avg_temperature_c: {
    id: 'avg_temperature_c',
    label: 'Temperature',
    shortLabel: 'TEMPERATURE',
    field: 'avg_temperature_c',
    unit: '°C',
    type: 'ward_choropleth',
    description: 'Average ward-level temperature derived from thermal remote sensing and calibration.',
    min: 35.4,
    max: 40.0,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}°C` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#fbe083', label: '35.4°' },
      { stop: 0.25, color: '#f7b045', label: '36.5°' },
      { stop: 0.55, color: '#ec6f30', label: '37.8°' },
      { stop: 0.8, color: '#c93427', label: '39.0°' },
      { stop: 1.0, color: '#881216', label: '40.0°' },
    ],
    getColor: (v) =>
      interpolateColor(v, 35.4, 40.0, [
        { stop: 0.0, color: '#fbe083' },
        { stop: 0.25, color: '#f7b045' },
        { stop: 0.55, color: '#ec6f30' },
        { stop: 0.8, color: '#c93427' },
        { stop: 1.0, color: '#881216' },
      ]),
    sourceLabel: 'Landsat 8/9 TIRS & In-Situ Calibration',
    resolutionLabel: 'Ward aggregated (100m raw)',
    yearLabel: '2026 Event Window',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  pop_density: {
    id: 'pop_density',
    label: 'Population Density',
    shortLabel: 'POPULATION',
    field: 'pop_density',
    unit: '/km²',
    type: 'ward_choropleth',
    description: 'Ward population per square kilometer, highlighting dense exposure epicenters.',
    min: 1800,
    max: 34500,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${Math.round(v).toLocaleString()} / km²` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#c7b6df', label: '1.8k' },
      { stop: 0.3, color: '#9d79c3', label: '11.5k' },
      { stop: 0.6, color: '#c24b8e', label: '21.0k' },
      { stop: 0.85, color: '#c82855', label: '29.0k' },
      { stop: 1.0, color: '#6d0c32', label: '34.5k' },
    ],
    getColor: (v) =>
      interpolateColor(v, 1800, 34500, [
        { stop: 0.0, color: '#c7b6df' },
        { stop: 0.3, color: '#9d79c3' },
        { stop: 0.6, color: '#c24b8e' },
        { stop: 0.85, color: '#c82855' },
        { stop: 1.0, color: '#6d0c32' },
      ]),
    sourceLabel: 'Delhi SEC 2022 Census Harmonization',
    resolutionLabel: 'Ward polygon census boundaries',
    yearLabel: '2022 / 2026 Model',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  green_cover_pct: {
    id: 'green_cover_pct',
    label: 'Green Cover',
    shortLabel: 'GREEN COVER',
    field: 'green_cover_pct',
    unit: '%',
    type: 'ward_choropleth',
    description: 'Percentage of total ward land classified as vegetative cover from multispectral NDVI.',
    min: 4.0,
    max: 42.0,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}%` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#824823', label: '4%' },
      { stop: 0.3, color: '#b97a3c', label: '15%' },
      { stop: 0.6, color: '#a2ab4d', label: '26%' },
      { stop: 0.85, color: '#57964b', label: '35%' },
      { stop: 1.0, color: '#276832', label: '42%' },
    ],
    getColor: (v) =>
      interpolateColor(v, 4.0, 42.0, [
        { stop: 0.0, color: '#824823' },
        { stop: 0.3, color: '#b97a3c' },
        { stop: 0.6, color: '#a2ab4d' },
        { stop: 0.85, color: '#57964b' },
        { stop: 1.0, color: '#276832' },
      ]),
    sourceLabel: 'Sentinel-2 & Landsat NDVI Composite',
    resolutionLabel: 'Ward aggregated (10m/30m raw)',
    yearLabel: '2026 Seasonal Median',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  built_up_pct: {
    id: 'built_up_pct',
    label: 'Built-up Density',
    shortLabel: 'BUILT-UP',
    field: 'built_up_pct',
    unit: '%',
    type: 'ward_choropleth',
    description: 'Share of impervious surface, buildings, and concrete infrastructure (NDBI).',
    min: 40.0,
    max: 98.0,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}%` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#2b302c', label: '40%' },
      { stop: 0.35, color: '#684a3c', label: '60%' },
      { stop: 0.65, color: '#b3542a', label: '78%' },
      { stop: 0.85, color: '#db4924', label: '88%' },
      { stop: 1.0, color: '#961a15', label: '98%' },
    ],
    getColor: (v) =>
      interpolateColor(v, 40.0, 98.0, [
        { stop: 0.0, color: '#2b302c' },
        { stop: 0.35, color: '#684a3c' },
        { stop: 0.65, color: '#b3542a' },
        { stop: 0.85, color: '#db4924' },
        { stop: 1.0, color: '#961a15' },
      ]),
    sourceLabel: 'Landsat NDBI & OpenStreetMap Footprints',
    resolutionLabel: 'Ward aggregated (30m raw)',
    yearLabel: '2026 Surface Model',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  AQI: {
    id: 'AQI',
    label: 'Air Quality Index',
    shortLabel: 'AQI',
    field: 'AQI',
    unit: 'AQI',
    type: 'ward_choropleth',
    description: 'Continuous Air Quality Index across wards during the heatwave window.',
    min: 70,
    max: 210,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${Math.round(v)}` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#528e6a', label: '70' },
      { stop: 0.3, color: '#b3a846', label: '110' },
      { stop: 0.6, color: '#e07f38', label: '150' },
      { stop: 0.85, color: '#c93b32', label: '185' },
      { stop: 1.0, color: '#791823', label: '210' },
    ],
    getColor: (v) =>
      interpolateColor(v, 70, 210, [
        { stop: 0.0, color: '#528e6a' },
        { stop: 0.3, color: '#b3a846' },
        { stop: 0.6, color: '#e07f38' },
        { stop: 0.85, color: '#c93b32' },
        { stop: 1.0, color: '#791823' },
      ]),
    sourceLabel: 'CPCB & Ground Sensor Network Interpolation',
    resolutionLabel: 'Ward surface interpolation',
    yearLabel: '2026 Event Window',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  heat_index_c: {
    id: 'heat_index_c',
    label: 'Heat Index',
    shortLabel: 'HEAT INDEX',
    field: 'heat_index_c',
    unit: '°C',
    type: 'ward_choropleth',
    description: 'Apparent "feels-like" temperature combining ambient surface heat and relative humidity.',
    min: 36.0,
    max: 44.0,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}°C` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#faea92', label: '36.0°' },
      { stop: 0.3, color: '#f7a844', label: '38.5°' },
      { stop: 0.6, color: '#ee622c', label: '40.8°' },
      { stop: 0.85, color: '#d2272a', label: '42.5°' },
      { stop: 1.0, color: '#880c1a', label: '44.0°' },
    ],
    getColor: (v) =>
      interpolateColor(v, 36.0, 44.0, [
        { stop: 0.0, color: '#faea92' },
        { stop: 0.3, color: '#f7a844' },
        { stop: 0.6, color: '#ee622c' },
        { stop: 0.85, color: '#d2272a' },
        { stop: 1.0, color: '#880c1a' },
      ]),
    sourceLabel: 'Steadman Formula on LST & Humidity',
    resolutionLabel: 'Ward composite metric',
    yearLabel: '2026 Peak Day',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  heat_risk_score: {
    id: 'heat_risk_score',
    label: 'Heat Risk',
    shortLabel: 'HEAT RISK',
    field: 'heat_risk_score',
    unit: '/ 100',
    type: 'ward_choropleth',
    description: 'Composite equity-weighted vulnerability score prioritizing cooling interventions.',
    min: 0,
    max: 100,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#2d3b34', label: '0 Low' },
      { stop: 0.4, color: '#4a6d59', label: '40' },
      { stop: 0.6, color: '#d3982e', label: '60 Mod' },
      { stop: 0.8, color: '#e25e2a', label: '80 High' },
      { stop: 1.0, color: '#d9272b', label: '100 Hotspot' },
    ],
    getColor: (v) => {
      if (v === null || v === undefined || isNaN(v)) return '#1e211e';
      if (v < 40) {
        return interpolateColor(v, 0, 40, [
          { stop: 0.0, color: '#25322b' },
          { stop: 1.0, color: '#456a57' },
        ]);
      }
      if (v < 60) {
        return interpolateColor(v, 40, 60, [
          { stop: 0.0, color: '#577864' },
          { stop: 1.0, color: '#d3982e' },
        ]);
      }
      if (v < 80) {
        return interpolateColor(v, 60, 80, [
          { stop: 0.0, color: '#d3982e' },
          { stop: 1.0, color: '#e25e2a' },
        ]);
      }
      return interpolateColor(v, 80, 100, [
        { stop: 0.0, color: '#e25e2a' },
        { stop: 1.0, color: '#d9272b' },
      ]);
    },
    sourceLabel: 'Random Forest Equity Scoring Pipeline',
    resolutionLabel: 'Ward-level priority index',
    yearLabel: '2026 Model Run',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  tree_cover_pct: {
    id: 'tree_cover_pct',
    label: 'Tree Cover',
    shortLabel: 'TREE COVER',
    field: 'tree_cover_pct',
    unit: '%',
    type: 'ward_choropleth',
    description: 'Mature canopy tree coverage providing localized shade and microclimate attenuation.',
    min: 1.5,
    max: 28.0,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}%` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#212521', label: '1.5%' },
      { stop: 0.35, color: '#3d523c', label: '10%' },
      { stop: 0.7, color: '#498c4d', label: '19%' },
      { stop: 1.0, color: '#259942', label: '28%' },
    ],
    getColor: (v) =>
      interpolateColor(v, 1.5, 28.0, [
        { stop: 0.0, color: '#212521' },
        { stop: 0.35, color: '#3d523c' },
        { stop: 0.7, color: '#498c4d' },
        { stop: 1.0, color: '#259942' },
      ]),
    sourceLabel: 'High-Resolution Canopy Height Model (GLAD/Tree)',
    resolutionLabel: 'Ward aggregate',
    yearLabel: '2026 Canopy Baseline',
    dataStatus: 'MULTI-SOURCE DATASET · HARMONIZED WARD VALUES',
  },

  relative_humidity_pct: {
    id: 'relative_humidity_pct',
    label: 'Humidity',
    shortLabel: 'HUMIDITY',
    field: 'relative_humidity_pct',
    unit: '%',
    type: 'ward_choropleth',
    description: 'Atmospheric moisture level recorded during the heatwave window.',
    min: 36.0,
    max: 60.0,
    formatValue: (v) => (v !== null && v !== undefined && !isNaN(v) ? `${v.toFixed(1)}%` : 'Insufficient data'),
    gradientStops: [
      { stop: 0.0, color: '#34454d', label: '36%' },
      { stop: 0.35, color: '#3f6978', label: '44%' },
      { stop: 0.7, color: '#4a95a8', label: '52%' },
      { stop: 1.0, color: '#68c4d8', label: '60%' },
    ],
    getColor: (v) =>
      interpolateColor(v, 36.0, 60.0, [
        { stop: 0.0, color: '#34454d' },
        { stop: 0.35, color: '#3f6978' },
        { stop: 0.7, color: '#4a95a8' },
        { stop: 1.0, color: '#68c4d8' },
      ]),
    sourceLabel: 'IMD Synoptic Station Network (Regional Aggregate)',
    resolutionLabel: 'City-scale regional context',
    yearLabel: '2026 Event Window',
    dataStatus: 'CITY-SCALE CONTEXT · NOT WARD-RESOLVED',
    isCityContext: true,
    contextNote: 'Humidity is provided as contextual data and is not ward-resolved.',
  },
};

export const LAYER_IDS: LayerId[] = [
  'avg_temperature_c',
  'pop_density',
  'green_cover_pct',
  'built_up_pct',
  'AQI',
  'heat_index_c',
  'heat_risk_score',
  'tree_cover_pct',
  'relative_humidity_pct',
];
