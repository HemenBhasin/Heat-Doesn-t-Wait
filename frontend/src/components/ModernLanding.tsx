"use client";

import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip-card";
import LiquidMetalButtonPlus from "@/components/ui/LiquidMetalButton";
import { ArrowDown, ArrowUpRight, Check, ChevronRight, Database, FileText, MapPin, Satellite, ShieldCheck, Sparkles, Thermometer, Trees, Users, Wind, Zap } from "lucide-react"

const workflow = [
  ["01", "Define the event", <>Select a city, ward boundaries, and an officially declared <Tooltip content="India Meteorological Department (IMD) is the principal agency for meteorological observations and heatwave warnings in India.">IMD</Tooltip> heatwave window.</>],
  ["02", "Read the landscape", <>Retrieve Landsat thermal scenes and compute <Tooltip content="Land Surface Temperature (LST) is how hot the surface of the Earth feels to the touch, heavily influenced by concrete and vegetation.">LST</Tooltip>, <Tooltip content="Normalized Difference Vegetation Index (NDVI) is a satellite metric used to identify the density of green vegetation, which provides natural cooling.">NDVI</Tooltip>, and <Tooltip content="Normalized Difference Built-up Index (NDBI) highlights urban areas and concrete density, which trap heat.">NDBI</Tooltip> per ward.</>],
  ["03", "Build the evidence", "Join population, built environment, and cooling infrastructure into one transparent report."],
]

const evidence = [
  { icon: Thermometer, label: "Thermal signal", value: "41.8°C", note: <>Ward mean <Tooltip content="Land Surface Temperature">LST</Tooltip> during event</> },
  { icon: Trees, label: "Green cover", value: "3.8%", note: <><Tooltip content="Normalized Difference Vegetation Index">NDVI</Tooltip>-derived vegetation</> },
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
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="hero-bg-video"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay" />
          <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
          <motion.div 
            className="heat-hero-copy"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="heat-eyebrow"><span /> Ward-level heat evidence for real events</div>
            <h1>Heat doesn&apos;t<br /><em>wait.</em></h1>
            <p>When a city-wide alert is not enough, turn satellite data into a clear, explainable picture of who is exposed, where, and why.</p>
            <div className="hero-buttons"><a className="hot-button" href="#platform">See how it works <ArrowUpRight /></a><a className="quiet-link" href="#method"><span className="scroll-icon"><ArrowDown /></span> Explore the method</a></div>
            <div className="hero-meta"><span>REMOTE SENSING</span><i /> <span>GEOSPATIAL ANALYTICS</span><i /> <span>URBAN CLIMATE EQUITY</span></div>
          </motion.div>
          <motion.div 
            className="heat-hero-visual" aria-label="Stylized ward heat map visualization"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="map-grid" /><div className="map-rings"><span /><span /><span /></div>
            <div className="map-card"><div className="map-card-head"><span>EVENT WINDOW / JUNE 2026</span><strong><i /> ANALYZING</strong></div><div className="heat-map"><div className="ward ward-a" /><div className="ward ward-b" /><div className="ward ward-c" /><div className="ward ward-d" /><div className="ward ward-e" /><div className="map-pin pin-a"><span>14</span></div><div className="map-pin pin-b"><span>08</span></div><div className="map-legend"><span><i className="legend-hot" /> Higher exposure</span><span><i className="legend-cool" /> Lower exposure</span></div></div><div className="map-card-foot"><span>WARD PRIORITY INDEX</span><b>87.4 <small>/ 100</small></b></div></div>
            <div className="visual-note note-a"><Thermometer /> 42.0°C <small>+6.0° vs city median</small></div><div className="visual-note note-b"><Satellite /> LANDSAT 8/9 <small>Cloud-free scene</small></div>
          </motion.div>
          <div className="hero-scroll">SCROLL TO EXPLORE <ArrowDown /></div>
        </section>

        <motion.section 
          className="statement" id="platform"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        ><div className="section-label">01 / THE EVIDENCE GAP</div><div className="statement-grid"><h2>A city average can&apos;t show <em>who is being left behind.</em></h2><div><p>Heat Action Plans save lives. But a single threshold from a few weather stations treats every neighbourhood as the same.</p><p className="muted">Heat Doesn&apos;t Wait adds the missing layer: an event-scoped, ward-level view of exposure, population, and access to cooling.</p><a className="line-link" href="#evidence">Meet the evidence engine <ChevronRight /></a></div></div></motion.section>

        <motion.section 
          className="evidence-section" id="evidence"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        ><div className="section-label">02 / A WARD IN FOCUS</div><div className="evidence-heading"><div><p className="event-tag"><span /> DECLARED HEATWAVE / 14–18 JUNE 2026</p><h2>Evidence, not<br /><em>assumptions.</em></h2></div><p>Every priority is backed by visible, traceable factors. No black-box score. No invented measurements.</p></div><div className="evidence-layout"><div className="evidence-feature"><div className="feature-top"><span>WARD 14 / HIGH PRIORITY</span><span className="priority">87.4 <small>PRIORITY INDEX</small></span></div><div className="feature-chart"><div className="chart-axis"><span>45°</span><span>40°</span><span>35°</span><span>30°</span></div><svg viewBox="0 0 720 240" preserveAspectRatio="none" aria-hidden="true"><motion.path className="area" d="M0 186 C80 180 120 170 180 178 S280 152 340 162 S430 54 485 48 S580 64 630 86 S690 130 720 138 V240 H0Z" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.5 }} viewport={{ once: true }} /><motion.path className="line" d="M0 186 C80 180 120 170 180 178 S280 152 340 162 S430 54 485 48 S580 64 630 86 S690 130 720 138" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeOut", delay: 0.2 }} viewport={{ once: true }} /></svg><div className="event-marker"><span>EVENT WINDOW</span><i /></div></div><div className="feature-footer"><span>10 DAYS BEFORE <b>34.1°</b></span><span>PEAK DAY <b>41.8°</b></span><span>10 DAYS AFTER <b>34.6°</b></span></div></div><div className="evidence-list">{evidence.map(({ icon: Icon, label, value, note }, idx) => <motion.div className="evidence-row" key={label} whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.03)' }} transition={{ duration: 0.2 }}><Icon /><div><span>{label}</span><small>{note}</small></div><strong>{value}</strong></motion.div>)}</div></div></motion.section>

        <motion.section 
          className="method-section" id="method"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        ><div className="section-label">03 / THE METHOD</div><div className="method-heading"><h2>From satellite signal<br />to <em>grounded action.</em></h2><p>A one-directional pipeline keeps the science deterministic and the explanation accountable.</p></div><div className="workflow-grid">{workflow.map(([number, title, text], index) => <motion.article key={index} className="workflow-card" whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} transition={{ duration: 0.3 }}><span className="workflow-number">{number}</span><div className="workflow-icon">{index === 0 ? <Database /> : index === 1 ? <Satellite /> : <FileText />}</div><h3>{title}</h3><p>{text}</p><ArrowUpRight className="workflow-arrow" /></motion.article>)}</div></motion.section>

        <motion.section 
          className="copilot-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        ><div className="copilot-glow" /><div className="section-label">04 / RESPONSIBLE AI</div><div className="copilot-grid"><div><h2>An Evidence<br /><em>Copilot.</em></h2><p>AI explains what the pipeline has already measured. It does not calculate <Tooltip content="Land Surface Temperature">LST</Tooltip>, decide priority, or invent a number.</p><a className="hot-button" href="#scope">See the guardrails <ArrowUpRight /></a></div><motion.div className="explain-card" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}><div className="explain-head"><Sparkles /> GROUNDED EXPLANATION <span>●</span></div><p className="question">Why is Ward 14 flagged as high priority?</p><div className="answer"><Check /> <p>Ward 14 recorded <b>42°C</b> during the June event window, about <b>6°C above</b> the city median. Population density is among the highest in the city, green cover is under 4%, and no listed cooling centre is within 1.5 km.</p></div><div className="source-line"><ShieldCheck /> Answer generated from structured evidence</div></motion.div></div></motion.section>

        <motion.section 
          className="scope-section" id="scope"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        ><div className="section-label">05 / CLEAR BOUNDARIES</div><div className="scope-grid"><h2>Evidence that supports<br /><em>better decisions.</em></h2><div className="scope-list"><div><Check /><span>Complements <Tooltip content="India Meteorological Department">IMD</Tooltip> warnings and official <Tooltip content="Heat Action Plans (HAPs) are comprehensive early warning systems designed to mitigate the impacts of extreme heat events.">HAP</Tooltip> triggers.</span></div><div><Check /><span>Shows exposure, access, and uncertainty transparently.</span></div><div><Check /><span>Does not predict individual health risk or assign blame.</span></div></div></div></motion.section>

        <motion.section 
          className="demo-section" id="demo"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        ><div className="section-label">06 / START WITH A CITY</div><h2>Make heat visible<br /><em>where it matters.</em></h2><p>Explore a ward-level Heat Equity Evidence Report for a declared heatwave event.</p><div style={{ marginTop: '2rem' }}><LiquidMetalButtonPlus label="Request a demonstration" link="mailto:hello@heatdoesntwait.org" theme="obsidian" textColor="white" icon={{ glyph: "arrow-up-right", color: "white", fill: "var(--hot)" }} hoverStyle={{ tone: "light" }} metal={{ glow: 0.8, warmth: 0.5 }} edge={{ prism: 0.2 }} /></div></motion.section>
      </main>
      <footer className="heat-footer"><a className="heat-brand" href="#top"><span className="heat-mark"><Thermometer /></span><span>HEAT DOESN&apos;T <b>WAIT</b></span></a><span>Evidence for more equitable urban heat action.</span><span>© 2026 / A research prototype</span></footer>
    </div>
  )
}
