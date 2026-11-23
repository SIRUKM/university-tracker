const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const publicDir = path.resolve(__dirname, '../../public');
const artifactDir = '/Users/upkarkumarmahto/.gemini/antigravity/brain/ecd2ca34-d252-45f4-b6d3-761cf381d356';

// 1. App Icon SVG (512x512 and 1024x1024)
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" rx="230" fill="#09090b" />
  <g transform="translate(212, 252) scale(25)" stroke="#ffffff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </g>
  <circle cx="790" cy="280" r="40" fill="#10b981" />
</svg>`;

const icon512Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="115" fill="#09090b" />
  <g transform="translate(106, 126) scale(12.5)" stroke="#ffffff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </g>
  <circle cx="395" cy="140" r="20" fill="#10b981" />
</svg>`;

// 2. Header Style Wordmark (Rotated "uni" + "tracker" with green dot) - Transparent
const headerLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 260" width="800" height="260" fill="none">
  <!-- Rotated 'uni' -->
  <g transform="translate(70, 138)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="46" fill="#000000" text-anchor="middle" transform="rotate(-90)" letter-spacing="-0.02em">uni</text>
  </g>
  <!-- 'tracker' -->
  <text x="105" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="118" fill="#000000" letter-spacing="-0.05em">tracker</text>
  <!-- Emerald accent dot -->
  <circle cx="560" cy="100" r="14" fill="#10b981" />
</svg>`;

// 3. Full Brand Combo Lockup: [App Icon Badge] + [UniTracker] (Transparent)
const comboLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 280" width="1060" height="280" fill="none">
  <!-- Icon squircle -->
  <g transform="translate(40, 40)">
    <rect width="200" height="200" rx="46" fill="#09090b"/>
    <g transform="translate(38, 48) scale(5.2)" stroke="#ffffff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </g>
    <circle cx="156" cy="52" r="9" fill="#10b981"/>
  </g>
  <!-- Wordmark -->
  <g transform="translate(280, 162)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="100" fill="#09090b" letter-spacing="-0.04em">Uni<tspan fill="#10b981">Tracker</tspan></text>
    <text x="4" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="22" fill="#64748b" letter-spacing="0.12em">GERMANY MASTER'S PLATFORM</text>
  </g>
</svg>`;

// 4. Full Brand Combo Lockup for Dark Backgrounds
const comboLogoDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 280" width="1060" height="280" fill="none">
  <rect width="1060" height="280" rx="28" fill="#09090b"/>
  <!-- Icon squircle border -->
  <g transform="translate(40, 40)">
    <rect width="200" height="200" rx="46" fill="#18181b" stroke="#27272a" stroke-width="2"/>
    <g transform="translate(38, 48) scale(5.2)" stroke="#ffffff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </g>
    <circle cx="156" cy="52" r="9" fill="#10b981"/>
  </g>
  <!-- Wordmark -->
  <g transform="translate(280, 162)">
    <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="100" fill="#ffffff" letter-spacing="-0.04em">Uni<tspan fill="#10b981">Tracker</tspan></text>
    <text x="4" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="22" fill="#a1a1aa" letter-spacing="0.12em">GERMANY MASTER'S PLATFORM</text>
  </g>
</svg>`;

// 5. Presentation / Brand Card (1200x630)
const brandCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" fill="none">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="2" y="2" width="1196" height="626" rx="24" fill="#fafafa" stroke="#e4e4e7" stroke-width="2"/>
  
  <!-- Subtle Grid Pattern -->
  <g stroke="#f4f4f5" stroke-width="1">
    <line x1="0" y1="126" x2="1200" y2="126" />
    <line x1="0" y1="252" x2="1200" y2="252" />
    <line x1="0" y1="378" x2="1200" y2="378" />
    <line x1="0" y1="504" x2="1200" y2="504" />
    <line x1="240" y1="0" x2="240" y2="630" />
    <line x1="480" y1="0" x2="480" y2="630" />
    <line x1="720" y1="0" x2="720" y2="630" />
    <line x1="960" y1="0" x2="960" y2="630" />
  </g>

  <!-- Centered Logo Lockup -->
  <g transform="translate(180, 160)">
    <!-- Icon -->
    <rect width="180" height="180" rx="42" fill="#09090b" filter="drop-shadow(0 12px 24px rgba(0,0,0,0.12))"/>
    <g transform="translate(34, 43) scale(4.7)" stroke="#ffffff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </g>
    <circle cx="140" cy="46" r="8" fill="#10b981"/>
    
    <!-- Text -->
    <g transform="translate(225, 120)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="94" fill="#09090b" letter-spacing="-0.04em">Uni<tspan fill="#10b981">Tracker</tspan></text>
      <text x="4" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="20" fill="#10b981" letter-spacing="0.14em">GERMAN ADMISSIONS &amp; RELOCATION</text>
    </g>
  </g>

  <!-- Tagline / URL footer -->
  <g transform="translate(600, 480)" text-anchor="middle">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="500" font-size="22" fill="#71717a">Master's Application Management • Deadline Alerts • Relocation Roadmap</text>
    <text y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="700" font-size="24" fill="#09090b" letter-spacing="0.05em">unitracker.live</text>
  </g>
</svg>`;

const filesToGenerate = [
  { name: 'unitracker-icon-512', svg: icon512Svg },
  { name: 'unitracker-icon-1024', svg: iconSvg },
  { name: 'unitracker-logo', svg: headerLogoSvg },
  { name: 'unitracker-logo-combo', svg: comboLogoSvg },
  { name: 'unitracker-logo-dark', svg: comboLogoDarkSvg },
  { name: 'unitracker-brand-card', svg: brandCardSvg },
];

filesToGenerate.forEach(item => {
  const tmpSvg = path.join('/tmp', `${item.name}.svg`);
  const outPng = path.join(publicDir, `${item.name}.png`);
  const artifactPng = path.join(artifactDir, `${item.name}.png`);
  
  fs.writeFileSync(tmpSvg, item.svg, 'utf8');

  const jxaScript = `
    ObjC.import('AppKit');
    var svgPath = '${tmpSvg}';
    var outPath = '${outPng}';
    var image = $.NSImage.alloc.initWithContentsOfFile(svgPath);
    var tiffData = image.TIFFRepresentation;
    var bitmap = $.NSBitmapImageRep.imageRepWithData(tiffData);
    var pngData = bitmap.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $.NSDictionary.dictionary);
    pngData.writeToFileAtomically(outPath, true);
  `;

  execSync(`osascript -l JavaScript -e "${jxaScript.replace(/\n/g, ' ')}"`);
  
  if (fs.existsSync(outPng)) {
    fs.copyFileSync(outPng, artifactPng);
    console.log(`Generated: ${item.name}.png (${fs.statSync(outPng).size} bytes)`);
  }
});
