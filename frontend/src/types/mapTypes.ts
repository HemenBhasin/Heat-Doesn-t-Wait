export interface WardRecord {
  ward_id: number;
  ward_name: string;
  population: number;
  area_km2: number;
  pop_density: number;
  avg_temperature_c: number;
  AQI: number;
  green_cover_pct: number;
  tree_cover_pct: number;
  built_up_pct: number;
  relative_humidity_pct: number;
  heat_index_c: number;
  heat_risk_score: number;
  centroid?: [number, number];
  source_basis?: string;
}

export type LayerId =
  | 'avg_temperature_c'
  | 'pop_density'
  | 'green_cover_pct'
  | 'built_up_pct'
  | 'AQI'
  | 'heat_index_c'
  | 'heat_risk_score'
  | 'tree_cover_pct'
  | 'relative_humidity_pct';

export type LayerType = 'ward_choropleth' | 'raster';

export interface LayerConfig {
  id: LayerId;
  label: string;
  shortLabel: string;
  field: keyof WardRecord;
  unit: string;
  type: LayerType;
  description: string;
  min: number;
  max: number;
  formatValue: (val: number | null | undefined) => string;
  getColor: (val: number | null | undefined) => string;
  gradientStops: { stop: number; color: string; label?: string }[];
  sourceLabel: string;
  resolutionLabel: string;
  yearLabel: string;
  dataStatus: string;
  isCityContext?: boolean;
  contextNote?: string;
}

export type RiskClass = 'ALL' | 'HOTSPOT' | 'HIGH' | 'MODERATE' | 'LOW';

export interface GeoJSONFeature {
  type: 'Feature';
  id?: number | string;
  properties: WardRecord & Record<string, any>;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any[];
  };
}

export interface WardGeoJSON {
  type: 'FeatureCollection';
  name?: string;
  features: GeoJSONFeature[];
}
