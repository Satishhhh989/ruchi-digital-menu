import { buildSync } from 'esbuild';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

// 1. Extract menu data from typescript source
const bundle = buildSync({
  stdin: {
    contents: `
      export { OFFICIAL_PAGES, OFFICIAL_MENU_DATA, CATEGORY_DISPLAY_NAMES, KANNADA_PAGES, KANNADA_CATEGORY_DISPLAY_NAMES, KANNADA_DISH_NAMES, UI_TEXT } from "./ruchi_s_family_restaurant_official_digital_menu.tsx";
    `,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  loader: { '.png': 'dataurl', '.tsx': 'tsx' },
  bundle: true,
  format: 'esm',
  write: false,
  external: ['react', 'react-dom', 'framer-motion']
});

fs.writeFileSync('temp_menu_data.mjs', bundle.outputFiles[0].text);
const dataModule = await import('./temp_menu_data.mjs');
const { OFFICIAL_PAGES, OFFICIAL_MENU_DATA, CATEGORY_DISPLAY_NAMES, KANNADA_PAGES, KANNADA_CATEGORY_DISPLAY_NAMES, KANNADA_DISH_NAMES, UI_TEXT } = dataModule;
fs.unlinkSync('temp_menu_data.mjs');

const logoBase64 = fs.readFileSync('public/ruchi-logo.png').toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const outputDir = path.resolve('menu');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 2. HTML Generator for Front Cover
function renderCoverHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@500;600;700&family=Noto+Sans+Kannada:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1800px;
      height: 2500px;
      background: #040E08;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
      padding: 40px;
      -webkit-font-smoothing: antialiased;
    }
    .cover-canvas {
      width: 1720px;
      height: 2420px;
      background: linear-gradient(135deg, #184E38 0%, #123E2C 50%, #0A241A 100%);
      border: 8px solid #D4B475;
      box-shadow: 
        0 0 0 5px #0E3324,
        0 0 0 16px #D4B475,
        0 35px 90px rgba(0, 0, 0, 0.95);
      border-radius: 12px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      padding: 70px 80px;
      color: #F8F6EF;
      text-align: center;
      overflow: hidden;
    }
    .inner-gold-frame {
      position: absolute;
      inset: 32px;
      border: 2px solid rgba(212, 180, 117, 0.7);
      border-radius: 8px;
      pointer-events: none;
    }
    .inner-gold-frame-2 {
      position: absolute;
      inset: 40px;
      border: 1px solid rgba(212, 180, 117, 0.35);
      border-radius: 6px;
      pointer-events: none;
    }
    .corner-ornament {
      position: absolute;
      width: 70px;
      height: 70px;
    }
    .top-left { top: 26px; left: 26px; }
    .top-right { top: 26px; right: 26px; transform: rotate(90deg); }
    .bottom-left { bottom: 26px; left: 26px; transform: rotate(-90deg); }
    .bottom-right { bottom: 26px; right: 26px; transform: rotate(180deg); }

    .veg-badge {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      background: #0E3324;
      color: #E8CFA0;
      border: 2px solid #D4B475;
      padding: 12px 32px;
      border-radius: 999px;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .veg-icon {
      width: 18px;
      height: 18px;
      border: 2.2px solid #166534;
      background: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
    }
    .veg-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #166534;
    }

    .hero-logo-box {
      position: relative;
      margin: 10px 0;
    }
    .hero-glow {
      position: absolute;
      inset: -50px;
      background: radial-gradient(circle, rgba(212, 180, 117, 0.5) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-logo-img {
      width: 400px;
      height: auto;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.65));
    }

    .brand-title-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 96px;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: #F8F6EF;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
      line-height: 1.05;
      margin-bottom: 6px;
    }
    .brand-tagline-en {
      font-size: 40px;
      font-weight: 700;
      letter-spacing: 0.32em;
      color: #D4B475;
      text-transform: uppercase;
    }

    .brand-title-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 76px;
      font-weight: 700;
      color: #F8F6EF;
      margin-top: 18px;
      line-height: 1.1;
    }
    .brand-tagline-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #D4B475;
    }

    .section-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      color: #D4B475;
      font-size: 24px;
      width: 100%;
      margin: 10px 0;
    }
    .section-divider span {
      width: 180px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #D4B475, transparent);
    }

    .cuisine-en {
      font-size: 34px;
      font-weight: 700;
      letter-spacing: 0.26em;
      color: #E8CFA0;
      text-transform: uppercase;
    }
    .cuisine-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #D4B475;
      margin-top: 8px;
    }

    .heritage-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 32px;
      font-style: italic;
      color: #C5BBAA;
      margin-top: 14px;
      letter-spacing: 0.06em;
    }
    .heritage-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 24px;
      color: #C5BBAA;
      margin-top: 6px;
    }

    .cover-footer {
      font-size: 15px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #D4B475;
      margin-top: 10px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="cover-canvas">
    <svg class="corner-ornament top-left" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#D4B475" stroke-width="2"/></svg>
    <svg class="corner-ornament top-right" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#D4B475" stroke-width="2"/></svg>
    <svg class="corner-ornament bottom-left" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#D4B475" stroke-width="2"/></svg>
    <svg class="corner-ornament bottom-right" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#D4B475" stroke-width="2"/></svg>
    <div class="inner-gold-frame"></div>
    <div class="inner-gold-frame-2"></div>

    <div class="veg-badge">
      <span class="veg-icon"><span class="veg-dot"></span></span>
      <span>Pure Vegetarian • ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ</span>
    </div>

    <div class="hero-logo-box">
      <div class="hero-glow"></div>
      <img src="${logoDataUri}" alt="Ruchi's Logo" class="hero-logo-img" />
    </div>

    <div>
      <h1 class="brand-title-en">RUCHI’S</h1>
      <div class="brand-tagline-en">FAMILY RESTAURANT</div>
      <div class="brand-title-kn">ರುಚಿಸ್</div>
      <div class="brand-tagline-kn">ಫ್ಯಾಮಿಲಿ ರೆಸ್ಟೋರೆಂಟ್</div>
    </div>

    <div class="section-divider">
      <span></span> ◆ &nbsp; ❖ &nbsp; ◆ <span></span>
    </div>

    <div>
      <div class="cuisine-en">NORTH INDIAN & MARWADI SPECIAL</div>
      <div class="cuisine-kn">ಉತ್ತರ ಭಾರತ ಮತ್ತು ಮಾರ್ವಾಡಿ ಸ್ಪೆಷಲ್</div>
    </div>

    <div>
      <div class="heritage-en">Traditional Warmth • Rich Culinary Heritage</div>
      <div class="heritage-kn">ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿ • ರಾಜಮನೆತನದ ಆತಿಥ್ಯ</div>
    </div>

    <div class="cover-footer">OFFICIAL DIGITAL MENU BOOK • ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಮೆನು ಪುಸ್ತಕ</div>
  </div>
</body>
</html>`;
}

// 3. Dynamic Styling function for Menu Pages (1 to 8)
// Scales font sizes, margins, and row padding dynamically to make text large and readable while filling the page
function getStylesForCount(totalItems) {
  if (totalItems <= 10) { // Page 2 (10 items)
    return {
      dishFontSize: '38px',
      kannadaFontSize: '34px',
      priceFontSize: '36px',
      catFontSize: '42px',
      rowPad: '22px 0',
      catMargin: '30px 0 16px',
      vegBadgeSize: '22px',
      vegDotSize: '10px',
      logoWidth: '130px',
      contentGap: '16px'
    };
  } else if (totalItems <= 15) { // Page 7 (14 items), Page 8 (15 items)
    return {
      dishFontSize: '35px',
      kannadaFontSize: '31px',
      priceFontSize: '33px',
      catFontSize: '38px',
      rowPad: '16px 0',
      catMargin: '24px 0 12px',
      vegBadgeSize: '20px',
      vegDotSize: '9px',
      logoWidth: '125px',
      contentGap: '12px'
    };
  } else if (totalItems <= 22) { // Page 3 (21), Page 4 (19), Page 5 (22), Page 6 (22)
    return {
      dishFontSize: '29.5px',
      kannadaFontSize: '26px',
      priceFontSize: '28px',
      catFontSize: '33px',
      rowPad: '10px 0',
      catMargin: '18px 0 8px',
      vegBadgeSize: '17px',
      vegDotSize: '7.5px',
      logoWidth: '115px',
      contentGap: '8px'
    };
  } else { // Page 1 (30 items)
    return {
      dishFontSize: '24.5px',
      kannadaFontSize: '21.5px',
      priceFontSize: '23.5px',
      catFontSize: '28px',
      rowPad: '6px 0',
      catMargin: '12px 0 5px',
      vegBadgeSize: '14px',
      vegDotSize: '6px',
      logoWidth: '105px',
      contentGap: '4px'
    };
  }
}

// 4. HTML Generator for Menu Pages (1 to 8)
// Bilingual side-by-side layout with large readable typography and NO bottom spotlight boxes
function renderMenuPageHTML(pageMeta, items) {
  const pageKn = KANNADA_PAGES[pageMeta.pageNumber] || {};
  const pageTitleEn = pageMeta.title;
  const pageTitleKn = pageKn.title;
  const pageSubEn = pageMeta.subtitle;
  const pageSubKn = pageKn.subtitle;

  const categories = pageMeta.categories;
  const grouped = {};
  for (const cat of categories) {
    grouped[cat] = items.filter(i => i.category === cat);
  }

  const s = getStylesForCount(items.length);

  function renderList(lang) {
    const isKn = lang === 'kn';
    return categories.map(cat => {
      const catItems = grouped[cat] || [];
      const catTitle = isKn ? (KANNADA_CATEGORY_DISPLAY_NAMES[cat] || cat) : (CATEGORY_DISPLAY_NAMES[cat] || cat);
      const countLabel = isKn ? `${catItems.length} ಖಾದ್ಯಗಳು` : `${catItems.length} SELECTIONS`;

      const rows = catItems.map(item => {
        const displayName = isKn ? (KANNADA_DISH_NAMES[item.id] || item.name) : item.name;
        const isSignature = item.name === "Ruchi’s Special Curry" || item.name === "Ruchi's Special Curry";
        const priceText = item.price !== null ? `₹ ${item.price}` : (isKn ? 'ದರ ವಿಚಾರಿಸಿ' : 'Price on Req');

        return `
          <div class="menu-row ${isSignature ? 'signature-row' : ''}">
            <div class="item-left">
              <span class="veg-badge"><span class="veg-dot"></span></span>
              <span class="dish-name ${isKn ? 'font-kannada' : ''}">
                ${displayName}
                ${isSignature ? `<span class="signature-badge">${isKn ? 'ಸಿಗ್ನೇಚರ್' : 'SIGNATURE'}</span>` : ''}
              </span>
            </div>
            <span class="dotted-leader"></span>
            <div class="item-price">${priceText}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="category-block">
          <div class="category-header">
            <span class="gold-line"></span>
            <h4 class="${isKn ? 'font-kannada' : ''}">${catTitle}</h4>
            <span class="cat-count">(${countLabel})</span>
            <span class="gold-line"></span>
          </div>
          <div class="rows-container">
            ${rows}
          </div>
        </div>
      `;
    }).join('');
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@500;600;700&family=Noto+Sans+Kannada:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1800px;
      height: 2500px;
      background: #081B12;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
      color: #1E2621;
      padding: 40px;
      -webkit-font-smoothing: antialiased;
    }
    
    .font-kannada {
      font-family: 'Noto Sans Kannada', sans-serif !important;
    }

    .book-page-canvas {
      width: 1720px;
      height: 2420px;
      background: #FAF7F0;
      background-image: 
        radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(250, 247, 240, 0.95) 70%),
        repeating-linear-gradient(45deg, rgba(212, 180, 117, 0.015) 0, rgba(212, 180, 117, 0.015) 2px, transparent 2px, transparent 8px);
      border: 7px solid #164B35;
      box-shadow: 
        0 0 0 3px #D4B475,
        0 0 0 12px #0E3324,
        0 0 0 16px #D4B475,
        0 30px 75px rgba(0, 0, 0, 0.9);
      border-radius: 8px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 35px 50px;
      overflow: hidden;
    }

    .corner-ornament {
      position: absolute;
      width: 50px;
      height: 50px;
      pointer-events: none;
    }
    .top-left { top: 16px; left: 16px; }
    .top-right { top: 16px; right: 16px; transform: rotate(90deg); }
    .bottom-left { bottom: 16px; left: 16px; transform: rotate(-90deg); }
    .bottom-right { bottom: 16px; right: 16px; transform: rotate(180deg); }

    .inner-border {
      position: absolute;
      inset: 20px;
      border: 2px solid rgba(168, 139, 82, 0.55);
      border-radius: 6px;
      pointer-events: none;
    }

    .page-header {
      text-align: center;
      position: relative;
      z-index: 10;
      border-bottom: 2px solid rgba(168, 139, 82, 0.35);
      padding-bottom: 14px;
      margin-bottom: 12px;
    }

    .top-status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
      padding: 0 10px;
    }

    .veg-hallmark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0E3324;
      color: #E8CFA0;
      border: 1.5px solid #D4B475;
      padding: 6px 18px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .logo-centerpiece {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 2px 0 6px;
    }
    .logo-img {
      width: ${s.logoWidth};
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));
    }

    .folio-badge {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: #8C7343;
      text-transform: uppercase;
    }

    .brand-title-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 4px;
    }
    .brand-title-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #164B35;
      text-transform: uppercase;
    }
    .brand-title-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #164B35;
    }
    .brand-sep {
      color: #D4B475;
      font-size: 22px;
    }

    .brand-cuisine {
      font-size: 13px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #8C7343;
      font-weight: 600;
      margin-top: 4px;
    }

    .chapter-title-box {
      margin-top: 10px;
    }
    .chapter-heading-dual {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 18px;
    }
    .chapter-heading-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 46px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #164B35;
    }
    .chapter-heading-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 34px;
      font-weight: 700;
      color: #164B35;
    }
    .chapter-sub-dual {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 17px;
      color: #5C665F;
      margin-top: 3px;
    }
    .chapter-sub-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
    }
    .chapter-sub-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 14.5px;
    }

    .divider-motif {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-top: 8px;
      color: #D4B475;
      font-size: 15px;
    }
    .divider-motif span {
      width: 70px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #D4B475, transparent);
    }

    /* 2 Columns: English Column on Left, Kannada Column on Right */
    .columns-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 50px;
      position: relative;
      z-index: 10;
      flex: 1;
      min-height: 0;
    }

    .column-panel {
      display: flex;
      flex-direction: column;
      gap: ${s.contentGap};
    }

    .category-block {
      display: flex;
      flex-direction: column;
    }

    .center-spine-line {
      position: absolute;
      left: 50%;
      top: 5px;
      bottom: 5px;
      width: 1px;
      background: linear-gradient(180deg, transparent, rgba(168, 139, 82, 0.5) 5%, rgba(168, 139, 82, 0.5) 95%, transparent);
    }

    .lang-column-label {
      text-align: center;
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #8C7343;
      padding: 5px 18px;
      background: rgba(212, 180, 117, 0.2);
      border-radius: 999px;
      margin-bottom: 4px;
      display: inline-block;
      align-self: center;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: ${s.catMargin};
      text-align: center;
    }
    .category-header h4 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: ${s.catFontSize};
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #164B35;
      white-space: nowrap;
    }
    .category-header h4.font-kannada {
      font-family: 'Noto Sans Kannada', sans-serif !important;
      font-size: calc(${s.catFontSize} * 0.88);
    }
    .cat-count {
      font-family: 'DM Sans', sans-serif;
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #8C7343;
    }
    .gold-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(168, 139, 82, 0.2), rgba(168, 139, 82, 0.8), rgba(168, 139, 82, 0.2));
    }

    .rows-container {
      display: flex;
      flex-direction: column;
    }

    .menu-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: ${s.rowPad};
    }

    .signature-row {
      background: rgba(212, 180, 117, 0.18);
      border-radius: 4px;
      padding: 6px 10px;
      margin: 0 -10px;
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
      max-width: 82%;
    }

    .veg-badge {
      width: ${s.vegBadgeSize};
      height: ${s.vegBadgeSize};
      border: 1.8px solid #166534;
      background: #fff;
      border-radius: 3px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .veg-dot {
      width: ${s.vegDotSize};
      height: ${s.vegDotSize};
      border-radius: 50%;
      background: #166534;
    }

    .dish-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: ${s.dishFontSize};
      font-weight: 700;
      color: #1A241E;
      letter-spacing: 0.02em;
      line-height: 1.18;
    }
    .dish-name.font-kannada {
      font-size: ${s.kannadaFontSize};
      font-weight: 700;
      line-height: 1.22;
    }

    .signature-badge {
      background: #164B35;
      color: #D4B475;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 3px;
      letter-spacing: 0.12em;
      margin-left: 6px;
      text-transform: uppercase;
    }

    .dotted-leader {
      flex: 1;
      border-bottom: 2px dotted rgba(168, 139, 82, 0.65);
      margin: 0 4px 4px;
      min-width: 20px;
    }

    .item-price {
      font-family: 'DM Sans', sans-serif;
      font-size: ${s.priceFontSize};
      font-weight: 700;
      color: #8C7343;
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }

    /* Footer */
    .page-footer {
      border-top: 1.5px solid rgba(168, 139, 82, 0.35);
      padding-top: 10px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }
    .footer-heritage-box {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #8C7343;
      letter-spacing: 0.12em;
    }
    .footer-heritage-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
      font-size: 15px;
    }
    .footer-heritage-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 13px;
    }
    .footer-page-num {
      font-family: 'DM Sans', sans-serif;
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.26em;
      color: #164B35;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="book-page-canvas">
    <svg class="corner-ornament top-left" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#A88B52" stroke-width="1.8"/></svg>
    <svg class="corner-ornament top-right" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#A88B52" stroke-width="1.8"/></svg>
    <svg class="corner-ornament bottom-left" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#A88B52" stroke-width="1.8"/></svg>
    <svg class="corner-ornament bottom-right" viewBox="0 0 24 24" fill="none"><path d="M2 22 V5 C2 3.34315 3.34315 2 5 2 H22" stroke="#A88B52" stroke-width="1.8"/></svg>
    <div class="inner-border"></div>

    <!-- Page Header -->
    <header class="page-header">
      <div class="top-status-bar">
        <div class="veg-hallmark">
          <span class="veg-badge"><span class="veg-dot"></span></span>
          <span>PURE VEG • ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ</span>
        </div>

        <div class="folio-badge">FOLIO 0${pageMeta.pageNumber} • ಪುಟ 0${pageMeta.pageNumber}</div>
      </div>

      <div class="logo-centerpiece">
        <img src="${logoDataUri}" alt="Logo" class="logo-img" />
      </div>

      <div class="brand-title-box">
        <span class="brand-title-en">RUCHI'S FAMILY RESTAURANT</span>
        <span class="brand-sep">•</span>
        <span class="brand-title-kn">ರುಚಿಸ್ ಫ್ಯಾಮಿಲಿ ರೆಸ್ಟೋರೆಂಟ್</span>
      </div>
      <div class="brand-cuisine">NORTH INDIAN & MARWADI SPECIAL • ಉತ್ತರ ಭಾರತ ಮತ್ತು ಮಾರ್ವಾಡಿ ಸ್ಪೆಷಲ್</div>

      <div class="chapter-title-box">
        <div class="chapter-heading-dual">
          <span class="chapter-heading-en">${pageTitleEn}</span>
          <span class="brand-sep">•</span>
          <span class="chapter-heading-kn">${pageTitleKn}</span>
        </div>
        <div class="chapter-sub-dual">
          <span class="chapter-sub-en">${pageSubEn}</span>
          <span class="brand-sep">•</span>
          <span class="chapter-sub-kn">${pageSubKn}</span>
        </div>
        <div class="divider-motif">
          <span></span> ◆ &nbsp; ❖ &nbsp; ◆ <span></span>
        </div>
      </div>
    </header>

    <!-- Side-by-Side Columns -->
    <main class="columns-container">
      <div class="center-spine-line"></div>
      
      <!-- English Column -->
      <div class="column-panel">
        <div class="lang-column-label">ENGLISH SELECTION</div>
        ${renderList('en')}
      </div>

      <!-- Kannada Column -->
      <div class="column-panel">
        <div class="lang-column-label font-kannada">ಕನ್ನಡ ಆಯ್ಕೆಗಳು</div>
        ${renderList('kn')}
      </div>
    </main>

    <!-- Footer -->
    <footer class="page-footer">
      <div class="footer-heritage-box">
        <span class="footer-heritage-en">Traditional Warmth • Royal Hospitality • Pure Vegetarian</span>
        <span class="brand-sep">•</span>
        <span class="footer-heritage-kn">ಸಾಂಪ್ರದಾಯಿಕ ರುಚಿ • ರಾಜಮನೆತನದ ಆತಿಥ್ಯ • ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ</span>
      </div>
      <div class="footer-page-num">— PAGE 0${pageMeta.pageNumber} / ಪುಟ 0${pageMeta.pageNumber} —</div>
    </footer>
  </div>
</body>
</html>`;
}

// 5. Puppeteer/CDP rendering runner
async function waitForChrome(port, maxTries = 30) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      if (res.ok) return await res.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Chrome port ${port} did not respond`);
}

async function renderAll() {
  console.log('Generating all 8 menu images + Front Cover with large readable fonts (English & Kannada Side-by-Side, no bottom cards)...');
  
  const fileMap = [
    { type: 'cover', fileName: 'page_0_front_cover.png' },
    { type: 'page', pageNum: 1, fileName: 'page_1_starters_and_soups.png' },
    { type: 'page', pageNum: 2, fileName: 'page_2_noodles_and_dal.png' },
    { type: 'page', pageNum: 3, fileName: 'page_3_punjabi_paneer_specials.png' },
    { type: 'page', pageNum: 4, fileName: 'page_4_punjabi_kaju_and_mushroom.png' },
    { type: 'page', pageNum: 5, fileName: 'page_5_vegetables.png' },
    { type: 'page', pageNum: 6, fileName: 'page_6_rice_biryani_and_pulav.png' },
    { type: 'page', pageNum: 7, fileName: 'page_7_chinese_curd_and_lassi.png' },
    { type: 'page', pageNum: 8, fileName: 'page_8_tandoori_breads_and_meals.png' },
  ];

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless',
    '--user-data-dir=/tmp/chrome-menu-gen-large-bilingual',
    '--remote-debugging-port=9360',
    '--disable-gpu',
    '--no-first-run',
    'about:blank',
  ]);

  const pages = await waitForChrome(9360);
  const page = pages.find((p) => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 1;
  function send(method, params = {}) {
    return new Promise((res) => {
      const msgId = id++;
      const handler = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === msgId) {
          ws.removeEventListener('message', handler);
          res(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1800,
    height: 2500,
    deviceScaleFactor: 1,
    mobile: false,
  });

  for (const item of fileMap) {
    let htmlContent = '';
    if (item.type === 'cover') {
      htmlContent = renderCoverHTML();
    } else {
      const pMeta = OFFICIAL_PAGES.find(p => p.pageNumber === item.pageNum);
      const pItems = OFFICIAL_MENU_DATA.filter(i => pMeta.categories.includes(i.category));
      htmlContent = renderMenuPageHTML(pMeta, pItems);
    }

    const tempHtmlFile = path.resolve(`temp_page_${item.fileName}.html`);
    fs.writeFileSync(tempHtmlFile, htmlContent);

    const fileUrl = 'file://' + tempHtmlFile;
    await send('Page.navigate', { url: fileUrl });
    await new Promise((r) => setTimeout(r, 1200));

    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1800, height: 2500, scale: 1 },
    });

    const targetPath = path.join(outputDir, item.fileName);
    fs.writeFileSync(targetPath, Buffer.from(screenshot.data, 'base64'));
    const stats = fs.statSync(targetPath);
    console.log(`✓ Generated: ${item.fileName} (${(stats.size / 1024).toFixed(1)} KB)`);

    fs.unlinkSync(tempHtmlFile);
  }

  ws.close();
  chrome.kill();
  console.log('All menu images regenerated with large bold typography and zero bottom boxes successfully!');
}

renderAll().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
