
const ShopsyLogo = ({ size = "md" }) => {
  const scales = {
    sm: { circle: 28, sw: 4, fontSize: 20, gap: 8 },
    md: { circle: 44, sw: 5.5, fontSize: 28, gap: 12 },
    lg: { circle: 64, sw: 7,   fontSize: 40, gap: 16 },
  };
  const s = scales[size] || scales.md;
  const r = s.circle / 2;
  const sw = s.sw;

  // S path scaled to circle size
  const pad = r * 0.35;
  const x1 = r - pad, x2 = r + pad;
  const y1 = r - pad * 1.1, y2 = r, y3 = r + pad * 1.1;

  const pathD = [
    `M${x1} ${y1 - sw / 2}`,
    `Q${x1} ${y1 - pad * 0.9} ${r} ${y1 - pad * 0.9}`,
    `L${x2} ${y1 - pad * 0.9}`,
    `Q${x2 + pad * 0.4} ${y1 - pad * 0.9} ${x2 + pad * 0.4} ${y1}`,
    `Q${x2 + pad * 0.4} ${y2 - pad * 0.05} ${r} ${y2}`,
    `Q${x1 - pad * 0.4} ${y2 + pad * 0.05} ${x1 - pad * 0.4} ${y3}`,
    `Q${x1 - pad * 0.4} ${y3 + pad * 0.9} ${r} ${y3 + pad * 0.9}`,
    `L${x2} ${y3 + pad * 0.9}`,
    `Q${x2 + pad * 0.4} ${y3 + pad * 0.9} ${x2 + pad * 0.4} ${y3 + pad * 0.9 + sw * 0.5}`,
  ].join(" ");

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: s.gap }}>
      {/* Icône cercle noir avec S doré */}
      <svg
        width={s.circle}
        height={s.circle}
        viewBox={`0 0 ${s.circle} ${s.circle}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx={r} cy={r} r={r} fill="#111827" />
        <path
          d={pathD}
          stroke="#F59E0B"
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
        <circle
          cx={x2 + pad * 0.4}
          cy={y3 + pad * 0.9 + sw * 0.5}
          r={sw * 0.65}
          fill="#F59E0B"
        />
      </svg>

      {/* Wordmark shop + sy */}
      <span
        style={{
          fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
          fontSize: s.fontSize,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        <span style={{ color: "#111827" }}>shop</span>
        <span style={{ color: "#F59E0B" }}>sy</span>
      </span>
    </div>
  );
};


// ── Demo ─────────────────────────────────────────────────────────────────────

import { useState } from "react";

export default function App() {
  const [bg, setBg] = useState("light");

  const backgrounds = {
    light:  { bg: "#FFFFFF", label: "Fond blanc" },
    dark:   { bg: "#111827", label: "Fond sombre" },
    amber:  { bg: "#FFFBEB", label: "Fond crème" },
    gray:   { bg: "#F3F4F6", label: "Fond gris" },
  };

  const curr = backgrounds[bg];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", background: "var(--bg, #f9fafb)", minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap"
        rel="stylesheet"
      />

      <h2 style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
        Shopsy — Logo Option B
      </h2>

      {/* Sélecteur de fond */}
      <div style={{ display: "flex", gap: 8, marginBottom: "2.5rem", flexWrap: "wrap" }}>
        {Object.entries(backgrounds).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setBg(key)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: bg === key ? "2px solid #F59E0B" : "1.5px solid #e5e7eb",
              background: bg === key ? "#FEF3C7" : "#fff",
              color: bg === key ? "#92400E" : "#374151",
              fontSize: 12,
              fontWeight: bg === key ? 600 : 400,
              cursor: "pointer",
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Showcase 3 tailles */}
      <div
        style={{
          background: curr.bg,
          borderRadius: 16,
          padding: "3rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
          transition: "background 0.3s ease",
          border: "1px solid #e5e7eb",
        }}
      >
        {["sm", "md", "lg"].map((size) => (
          <div key={size} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <ShopsyLogo size={size} />
            <span style={{
              fontSize: 11,
              color: bg === "dark" ? "#6b7280" : "#9ca3af",
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}>
              {size === "sm" ? "Small — navbar mobile" : size === "md" ? "Medium — navbar desktop" : "Large — splash / hero"}
            </span>
          </div>
        ))}
      </div>

      {/* Aperçu navbar réelle */}
      <div style={{ marginTop: "2.5rem" }}>
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12, fontWeight: 500 }}>Aperçu dans une navbar</p>
        <nav style={{
          background: bg === "dark" ? "#1f2937" : "#FFFBEB",
          borderRadius: 12,
          padding: "0 1.5rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #FDE68A",
        }}>
          <ShopsyLogo size="sm" />
          <div style={{ display: "flex", gap: 24 }}>
            {["Home", "Top Rated", "Womens Wear", "Mens Wear"].map((item) => (
              <span key={item} style={{
                fontSize: 13,
                color: bg === "dark" ? "#d1d5db" : "#374151",
                fontWeight: 500,
                cursor: "pointer",
              }}>{item}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 20, cursor: "pointer" }}>🛒</span>
            <span style={{ fontSize: 20, cursor: "pointer" }}>🔍</span>
          </div>
        </nav>
      </div>

      {/* Code snippet */}
      <div style={{ marginTop: "2.5rem" }}>
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, fontWeight: 500 }}>Usage dans ton code</p>
        <pre style={{
          background: "#111827",
          color: "#d1fae5",
          padding: "1.2rem 1.5rem",
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.7,
          overflowX: "auto",
        }}>
{`import ShopsyLogo from './ShopsyLogo';

// Dans ta navbar :
<ShopsyLogo size="sm" />  // mobile
<ShopsyLogo size="md" />  // desktop (défaut)
<ShopsyLogo size="lg" />  // hero / splash`}
        </pre>
      </div>
    </div>
  );
}
