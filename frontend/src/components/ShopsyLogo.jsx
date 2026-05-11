
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

export default ShopsyLogo;
