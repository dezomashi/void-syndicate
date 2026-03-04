import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { aggression, loyalty, risk, anomaly, alignment, summary } = req.query;
  const status = String(alignment || 'NEUTRAL').toUpperCase();
  
  const isAnti = status === 'ANTI-SYSTEM';
  const isCorp = status === 'CORPORATE';
  const isNeut = status === 'NEUTRAL';

  const theme = {
    bg: isAnti ? '#000000' : (isCorp ? '#FFFFFF' : '#1A1A1A'),
    text: isAnti ? '#FF0000' : (isCorp ? '#000000' : '#888888'),
    accent: isAnti ? '#FF0000' : (isCorp ? '#000000' : '#FFFFFF'),
    border: isAnti ? '#FF0000' : (isCorp ? '#EEEEEE' : '#333333')
  };

  const bar = (v: any) => (Math.min(Math.max(parseInt(String(v)) || 0, 0), 100) / 100) * 330;

  const svg = `
    <svg width="400" height="500" viewBox="0 0 400 500" xmlns="http://www.w3.org">
      <rect width="400" height="500" fill="${theme.bg}"/>
      
      ${isNeut ? `
        <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.05"/>
        </pattern>
        <rect width="400" height="500" fill="url(#g)" />
      ` : ''}

      <rect x="15" y="15" width="370" height="470" fill="none" stroke="${theme.border}" stroke-width="1"/>
      
      <rect x="15" y="15" width="370" height="60" fill="${theme.accent}"/>
      <text x="35" y="55" font-family="sans-serif" font-weight="900" font-size="18" fill="${isCorp ? '#FFF' : (isAnti ? '#000' : '#000')}">
        VOID SYNDICATE // ${isNeut ? 'UNTRACKED' : 'ID'}
      </text>
      
      <text x="35" y="110" font-family="monospace" font-size="9" fill="${theme.text}" opacity="0.5">AUTHORIZATION:</text>
      <text x="35" y="145" font-family="sans-serif" font-weight="900" font-size="34" fill="${theme.text}">${status}</text>

      <g transform="translate(35, 190)">
        ${[
          { l: 'AGR', v: aggression }, { l: 'LOY', v: loyalty },
          { l: 'RSK', v: risk }, { l: 'ANM', v: anomaly }
        ].map((s, i) => `
          <g transform="translate(0, ${i * 45})">
            <text font-family="monospace" font-size="9" fill="${theme.text}" opacity="0.6">${s.l}</text>
            <text x="330" y="0" font-family="monospace" font-size="18" fill="${theme.text}" font-weight="900" text-anchor="end">${parseInt(String(s.v)) || 0}%</text>
            <rect y="8" width="330" height="2" fill="${theme.text}" opacity="0.1"/>
            <rect y="8" width="${bar(s.v)}" height="2" fill="${theme.text}"/>
          </g>
        `).join('')}
      </g>

      <g transform="translate(35, 390)">
        <foreignObject width="330" height="80">
          <div xmlns="http://www.w3.org" style="color:${theme.text};font-family:monospace;font-size:12px;font-weight:bold;text-transform:uppercase;border-left:2px solid ${theme.text};padding-left:10px">
            "${summary || 'NO_DATA'}"
          </div>
        </foreignObject>
      </g>

      <path d="M15 440h370" stroke="${theme.border}" stroke-width="1" opacity="0.5"/>
      <text x="35" y="470" font-family="monospace" font-size="8" fill="${theme.text}" opacity="0.4">NODE_REF: ${Math.random().toString(16).slice(2,8).toUpperCase()}</text>
      
      ${isCorp ? `<circle cx="360" cy="465" r="5" fill="#FF0000"/>` : ''}
      ${isNeut ? `<rect x="300" y="460" width="40" height="10" fill="#FFFFFF" opacity="0.2"/>` : ''}
    </svg>
  `.trim();

  res.status(200).json({
    name: `VOID_ID_${status}`,
    description: summary || "Neural behavioral report by VOID SYNDICATE AI.",
    image: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    attributes: [
      { trait_type: "Alignment", value: status },
      { trait_type: "Aggression", value: parseInt(String(aggression)) || 0 },
      { trait_type: "Anomaly", value: parseInt(String(anomaly)) || 0 }
    ]
  });
}
