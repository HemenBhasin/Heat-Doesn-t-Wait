# Heat Doesn't Wait

**Heat Doesn't Wait** is a geospatial AI/ML platform that detects urban heat hotspots at the ward level, computes Land Surface Temperature, and generates equity-weighted evidence reports to support Heat Action Plans across Indian cities.

This repository contains the work for our Final Year B.Tech CSE group project.

## Team
- **Shruti Dewasker**
- **Ishaan**
- **Purushrut Pandey**
- **Padam Gupta**
- **Hemen Bhasin**

## Project Overview

Heat Action Plans (HAPs) save lives, but they typically rely on a single, city-wide temperature threshold read from a few weather stations. This approach treats every neighborhood the same, ignoring the reality that intra-city Land Surface Temperature (LST) can vary by 5–8°C on the same afternoon due to factors like tree canopy, building density, and surface albedo.

**Heat Doesn't Wait** fills this evidence gap. We use an automated geospatial intelligence pipeline to:
1. Turn satellite signals (Landsat 8/9) into precise ward-level heat maps.
2. Overlay contextual data like population density and proximity to cooling centers.
3. Use a Random Forest model to classify heat drivers per ward (e.g., low greenery, concrete dominance, dense traffic).
4. Output a ranked Heat Equity Evidence Report.

## Repository Structure

- `/frontend` - The Next.js (App Router) web application featuring a modern, monolithic Bento-grid design.
- *(More directories will be added as the backend/ML pipeline is developed)*

## Getting Started (Frontend)

To run the platform preview locally:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the platform.

## Technology Stack

- **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons.
- **Geospatial & ML (Pipeline):** Google Earth Engine (GEE), OpenStreetMap (OSM), GeoPandas, Scikit-Learn (Random Forest), Folium.

## License
© 2026 Heat Doesn't Wait — A research prototype.
