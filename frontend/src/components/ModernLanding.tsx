import { ArrowDown, ArrowUpRight, Check, ChevronRight, Database, FileText, MapPin, Satellite, ShieldCheck, Sparkles, Thermometer, Trees, Users, Wind, Zap } from "lucide-react"

const workflow = [
  ["01", "Define the event", "Select a city, ward boundaries, and an officially declared IMD heatwave window."],
  ["02", "Read the landscape", "Retrieve Landsat thermal scenes and compute LST, NDVI, and NDBI per ward."],
  ["03", "Build the evidence", "Join population, built environment, and cooling infrastructure into one transparent report."],
]

const evidence = [
  { icon: Thermometer, label: "Thermal signal", value: "41.8°C", note: "Ward mean LST during event" },
  { icon: Trees, label: "Green cover", value: "3.8%", note: "NDVI-derived vegetation" },
  { icon: Users, label: "Population exposed", value: "18,420", note: "Estimated residents in hot zones" },
  { icon: MapPin, label: "Infrastructure gap", value: "1.5 km", note: "Nearest listed cooling centre" },
]

export default function ModernLanding() {
  return (
    <div className="heat-site">
      <header className="heat-nav">
        <a className="heat-brand" href="#top" aria-label="Heat Doesn't Wait home"><span className="heat-mark"><Thermometer /></span><span>HEAT DOESN&apos;T <b>WAIT</b></span></a>
        <nav aria-label="Main navigation"><a href="#platform">Platform</a><a href="#method">Method</a><a href="#evidence">Evidence</a><a href="#scope">Scope</a></nav>
        <a className="nav-action" href="#demo">Explore a report <ArrowUpRight /></a>
      </header>

      <main id="top">
        <section className="heat-hero">
          <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
          <div className="heat-hero-copy">
            <div className="heat-eyebrow"><span /> Ward-level heat evidence for real events</div>
            <h1>Heat doesn&apos;t<br /><em>wait.</em></h1>
            <p>When a city-wide alert is not enough, turn satellite data into a clear, explainable picture of who is exposed, where, and why.</p>
            <div className="hero-buttons"><a className="hot-button" href="#platform">See how it works <ArrowUpRight /></a><a className="quiet-link" href="#method"><span className="scroll-icon"><ArrowDown /></span> Explore the method</a></div>
            <div className="hero-meta"><span>REMOTE SENSING</span><i /> <span>GEOSPATIAL ANALYTICS</span><i /> <span>URBAN CLIMATE EQUITY</span></div>
          </div>
          <div className="heat-hero-visual" aria-label="Stylized ward heat map visualization">
            <div className="map-grid" /><div className="map-rings"><span /><span /><span /></div>
            <div className="map-card"><div className="map-card-head"><span>EVENT WINDOW / JUNE 2026</span><strong><i /> ANALYZING</strong></div><div className="heat-map"><div className="ward ward-a" /><div className="ward ward-b" /><div className="ward ward-c" /><div className="ward ward-d" /><div className="ward ward-e" /><div className="map-pin pin-a"><span>14</span></div><div className="map-pin pin-b"><span>08</span></div><div className="map-legend"><span><i className="legend-hot" /> Higher exposure</span><span><i className="legend-cool" /> Lower exposure</span></div></div><div className="map-card-foot"><span>WARD PRIORITY INDEX</span><b>87.4 <small>/ 100</small></b></div></div>
            <div className="visual-note note-a"><Thermometer /> 42.0°C <small>+6.0° vs city median</small></div><div className="visual-note note-b"><Satellite /> LANDSAT 8/9 <small>Cloud-free scene</small></div>
          </div>
          <div className="hero-scroll">SCROLL TO EXPLORE <ArrowDown /></div>
        </section>

        <section className="statement" id="platform"><div className="section-label">01 / THE EVIDENCE GAP</div><div className="statement-grid"><h2>A city average can&apos;t show <em>who is being left behind.</em></h2><div><p>Heat Action Plans save lives. But a single threshold from a few weather stations treats every neighbourhood as the same.</p><p className="muted">Heat Doesn&apos;t Wait adds the missing layer: an event-scoped, ward-level view of exposure, population, and access to cooling.</p><a className="line-link" href="#evidence">Meet the evidence engine <ChevronRight /></a></div></div></section>

        <section className="evidence-section" id="evidence"><div className="section-label">02 / A WARD IN FOCUS</div><div className="evidence-heading"><div><p className="event-tag"><span /> DECLARED HEATWAVE / 14–18 JUNE 2026</p><h2>Evidence, not<br /><em>assumptions.</em></h2></div><p>Every priority is backed by visible, traceable factors. No black-box score. No invented measurements.</p></div><div className="evidence-layout"><div className="evidence-feature"><div className="feature-top"><span>WARD 14 / HIGH PRIORITY</span><span className="priority">87.4 <small>PRIORITY INDEX</small></span></div><div className="feature-chart"><div className="chart-axis"><span>45°</span><span>40°</span><span>35°</span><span>30°</span></div><svg viewBox="0 0 720 240" preserveAspectRatio="none" aria-hidden="true"><path className="area" d="M0 186 C80 180 120 170 180 178 S280 152 340 162 S430 54 485 48 S580 64 630 86 S690 130 720 138 V240 H0Z" /><path className="line" d="M0 186 C80 180 120 170 180 178 S280 152 340 162 S430 54 485 48 S580 64 630 86 S690 130 720 138" /></svg><div className="event-marker"><span>EVENT WINDOW</span><i /></div></div><div className="feature-footer"><span>10 DAYS BEFORE <b>34.1°</b></span><span>PEAK DAY <b>41.8°</b></span><span>10 DAYS AFTER <b>34.6°</b></span></div></div><div className="evidence-list">{evidence.map(({ icon: Icon, label, value, note }) => <div className="evidence-row" key={label}><Icon /><div><span>{label}</span><small>{note}</small></div><strong>{value}</strong></div>)}</div></div></section>

        <section className="method-section" id="method"><div className="section-label">03 / THE METHOD</div><div className="method-heading"><h2>From satellite signal<br />to <em>grounded action.</em></h2><p>A one-directional pipeline keeps the science deterministic and the explanation accountable.</p></div><div className="workflow-grid">{workflow.map(([number, title, text], index) => <article key={number} className="workflow-card"><span className="workflow-number">{number}</span><div className="workflow-icon">{index === 0 ? <Database /> : index === 1 ? <Satellite /> : <FileText />}</div><h3>{title}</h3><p>{text}</p><ArrowUpRight className="workflow-arrow" /></article>)}</div></section>

        <section className="copilot-section"><div className="copilot-glow" /><div className="section-label">04 / RESPONSIBLE AI</div><div className="copilot-grid"><div><h2>An Evidence<br /><em>Copilot.</em></h2><p>AI explains what the pipeline has already measured. It does not calculate LST, decide priority, or invent a number.</p><a className="hot-button" href="#scope">See the guardrails <ArrowUpRight /></a></div><div className="explain-card"><div className="explain-head"><Sparkles /> GROUNDED EXPLANATION <span>●</span></div><p className="question">Why is Ward 14 flagged as high priority?</p><div className="answer"><Check /> <p>Ward 14 recorded <b>42°C</b> during the June event window, about <b>6°C above</b> the city median. Population density is among the highest in the city, green cover is under 4%, and no listed cooling centre is within 1.5 km.</p></div><div className="source-line"><ShieldCheck /> Answer generated from structured evidence</div></div></div></section>

        <section className="scope-section" id="scope"><div className="section-label">05 / CLEAR BOUNDARIES</div><div className="scope-grid"><h2>Evidence that supports<br /><em>better decisions.</em></h2><div className="scope-list"><div><Check /><span>Complements IMD warnings and official HAP triggers.</span></div><div><Check /><span>Shows exposure, access, and uncertainty transparently.</span></div><div><Check /><span>Does not predict individual health risk or assign blame.</span></div></div></div></section>

        <section className="demo-section" id="demo"><div className="section-label">06 / START WITH A CITY</div><h2>Make heat visible<br /><em>where it matters.</em></h2><p>Explore a ward-level Heat Equity Evidence Report for a declared heatwave event.</p><a className="hot-button" href="mailto:hello@heatdoesntwait.org">Request a demonstration <ArrowUpRight /></a></section>
      </main>
      <footer className="heat-footer"><a className="heat-brand" href="#top"><span className="heat-mark"><Thermometer /></span><span>HEAT DOESN&apos;T <b>WAIT</b></span></a><span>Evidence for more equitable urban heat action.</span><span>© 2026 / A research prototype</span></footer>
    </div>
  )
}
