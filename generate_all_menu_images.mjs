import { buildSync } from 'esbuild';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

// 1. Extract menu data
const bundle = buildSync({
  stdin: {
    contents: `
      export { OFFICIAL_PAGES, OFFICIAL_MENU_DATA, CATEGORY_DISPLAY_NAMES, KANNADA_PAGES, KANNADA_CATEGORY_DISPLAY_NAMES, KANNADA_DISH_NAMES, UI_TEXT } from "./ruchi_s_family_restaurant_official_digital_menu.tsx";
    `,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  loader: { '.png': 'dataurl' },
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

// 2. HTML Generator for Cover
function renderCoverHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap" rel="stylesheet">
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
      gap: 12px;
      background: #0E3324;
      color: #E8CFA0;
      border: 2px solid #D4B475;
      padding: 10px 28px;
      border-radius: 999px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .veg-icon {
      width: 16px;
      height: 16px;
      border: 2px solid #166534;
      background: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
    }
    .veg-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #166534;
    }

    .hero-logo-box {
      position: relative;
      margin: 20px 0;
    }
    .hero-glow {
      position: absolute;
      inset: -40px;
      background: radial-gradient(circle, rgba(212, 180, 117, 0.45) 0%, transparent 70%);
      filter: blur(45px);
      border-radius: 50%;
    }
    .hero-logo-img {
      position: relative;
      width: 380px;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 25px 45px rgba(0,0,0,0.95));
    }

    .brand-title-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 88px;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: #F8F6EF;
      line-height: 1.1;
      margin-top: 10px;
      text-transform: uppercase;
      text-shadow: 0 4px 25px rgba(0,0,0,0.7);
    }
    .brand-tagline-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 34px;
      letter-spacing: 0.38em;
      color: #D4B475;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .brand-title-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 62px;
      font-weight: 700;
      color: #F8F6EF;
      margin-top: 16px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.6);
    }
    .brand-tagline-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 26px;
      color: #D4B475;
      margin-top: 4px;
      letter-spacing: 0.08em;
    }

    .section-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 36px 0 24px;
      color: #D4B475;
      font-size: 24px;
    }
    .section-divider span {
      width: 180px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #D4B475, transparent);
    }

    .cuisine-en {
      font-size: 22px;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: #E2DACB;
      font-weight: 600;
    }
    .cuisine-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 22px;
      color: #E2DACB;
      margin-top: 8px;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    .heritage-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 28px;
      font-style: italic;
      color: #C5BBAA;
      margin-top: 28px;
      letter-spacing: 0.06em;
    }
    .heritage-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 21px;
      color: #C5BBAA;
      margin-top: 6px;
    }

    .cover-footer {
      font-size: 14px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #D4B475;
      margin-top: 20px;
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

// 3. HTML Generator for Menu Pages (1 to 8) with Increased Font Sizes & Bilingual Side-by-Side
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

  // Row padding and font sizes - significantly increased for readability
  const totalItems = items.length;
  let rowPad = '4px 0';
  let dishFontSize = '22px';
  let kannadaFontSize = '19.5px';
  let priceFontSize = '21px';
  let catMargin = '10px 0 5px';
  let catFontSize = '25px';

  if (totalItems <= 12) {
    rowPad = '16px 0';
    dishFontSize = '28px';
    kannadaFontSize = '25px';
    priceFontSize = '26px';
    catMargin = '26px 0 14px';
    catFontSize = '32px';
  } else if (totalItems <= 16) {
    rowPad = '11px 0';
    dishFontSize = '25px';
    kannadaFontSize = '22px';
    priceFontSize = '24px';
    catMargin = '18px 0 8px';
    catFontSize = '28px';
  } else if (totalItems <= 22) {
    rowPad = '6.5px 0';
    dishFontSize = '23px';
    kannadaFontSize = '20.5px';
    priceFontSize = '22px';
    catMargin = '14px 0 6px';
    catFontSize = '26px';
  }

  function renderList(lang) {
    const isKn = lang === 'kn';
    return categories.map(cat => {
      const catItems = grouped[cat] || [];
      const catName = isKn ? (KANNADA_CATEGORY_DISPLAY_NAMES[cat] || cat) : (CATEGORY_DISPLAY_NAMES[cat] || cat);
      const countLabel = isKn ? `${catItems.length} ಖಾದ್ಯಗಳು` : `${catItems.length} SELECTIONS`;

      const rows = catItems.map(item => {
        const displayName = isKn ? (KANNADA_DISH_NAMES[item.id] || item.name) : item.name;
        const isSignature = item.name === 'Ruchi’s Special Curry';
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
        <div class="cat-section">
          <div class="category-header">
            <span class="gold-line"></span>
            <h4 class="${isKn ? 'font-kannada' : ''}">${catName} <span class="cat-count">(${countLabel})</span></h4>
            <span class="gold-line"></span>
          </div>
          <div class="rows-container">
            ${rows}
          </div>
        </div>
      `;
    }).join('');
  }

  let spotlightHTML = '';
  if (pageMeta.pageNumber === 8) {
    spotlightHTML = `
      <div class="thali-spotlight-box">
        <div class="thali-inner">
          <div class="thali-badge">ROYAL SIGNATURE MEAL • ರಾಜಮನೆತನದ ವಿಶೇಷ ಊಟ</div>
          <div class="thali-title-dual">
            <span class="thali-title-en">UNLIMITED RAJASTHANI & GUJARATI THALI</span>
            <span class="thali-title-kn">ಅನ್‌ಲಿಮಿಟೆಡ್ ರಾಜಸ್ಥಾನಿ ಮತ್ತು ಗುಜರಾತಿ ಥಾಲಿ</span>
          </div>
          <div class="thali-desc-dual">
            <p class="thali-desc-en">Authentic traditional feast featuring daily rotating seasonal heirloom subjis, aromatic Gujarati & Rajasthani dals, fresh hot Phulkas/Rotis, farsan, cooling curd, papad, salad & traditional sweets. Served with royal hospitality.</p>
            <p class="thali-desc-kn">ಪ್ರತಿದಿನ ಬದಲಾಗುವ ತಾಜಾ ಸಬ್ಜಿಗಳು, ಪರಿಮಳಯುಕ್ತ ರಾಜಸ್ಥಾನಿ ಮತ್ತು ಗುಜರಾತಿ ದಾಲ್, ಬಿಸಿಬಿಸಿ ರೊಟ್ಟಿ/ಫುಲ್ಕಾ, ಫರ್ಸಾನ್, ತಂಪಾದ ಮೊಸರು, ಪಾಪಡ್, ಸಲಾಡ್ ಮತ್ತು ಸಿಹಿ ತಿನಿಸುಗಳು. ರಾಜಮನೆತನದ ಪ್ರೀತಿಯ ಆತಿಥ್ಯದೊಂದಿಗೆ.</p>
          </div>
          <div class="thali-note">Ask Stewart for Today’s Menu & Availability • ಇಂದಿನ ವಿಶೇಷ ಮೆನು ಮತ್ತು ಲಭ್ಯತೆಗಾಗಿ ಸರ್ವರ್ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ</div>
        </div>
      </div>
    `;
  } else if (pageMeta.pageNumber === 2) {
    spotlightHTML = `
      <div class="chef-note-box">
        <div class="chef-note-inner">
          <div class="chef-note-title">SLOW-COOKED LENTILS & HIGH-FLAME WOK • ಸಾಂಪ್ರದಾಯಿಕ ಒಗ್ಗರಣೆ ಮತ್ತು ನೂಡಲ್ಸ್</div>
          <p class="chef-note-text">Our golden dals are gently slow-cooked in traditional clay-handis and finished with desi ghee, burnt garlic, cumin, and whole red chillies. Our noodles are freshly tossed on a fiery wok with crisp garden vegetables.</p>
          <p class="chef-note-text-kn">ನಮ್ಮ ಬೇಳೆ ಸಾರುಗಳನ್ನು ಶುದ್ಧ ತುಪ್ಪ, ಬೆಳ್ಳುಳ್ಳಿ, ಜೀರಿಗೆ ಮತ್ತು ಒಣ ಮೆಣಸಿನಕಾಯಿಯ ಘಮಘಮಿಸುವ ಸಾಂಪ್ರದಾಯಿಕ ಒಗ್ಗರಣೆಯಿಂದ ತಯಾರಿಸಲಾಗುತ್ತದೆ.</p>
        </div>
      </div>
    `;
  } else if (pageMeta.pageNumber === 7) {
    spotlightHTML = `
      <div class="chef-note-box">
        <div class="chef-note-inner">
          <div class="chef-note-title">AUTHENTIC CHURNED LASSI & DAHI DELICACIES • ತಂಪಾದ ಲಸ್ಸಿ ಮತ್ತು ಮೊಸರಿನ ತಿನಿಸುಗಳು</div>
          <p class="chef-note-text">Our thick curd is churned fresh every morning into traditional foaming sweet and salted lassis, spiced chaas, and artisanal Dahi delicacies with rich, cooling flavors.</p>
          <p class="chef-note-text-kn">ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ತಾಜಾ ಹೆಪ್ಪುಹಾಕಿ ಕಡೆದ ಗಟ್ಟಿ ಮೊಸರಿನಿಂದ ಸಾಂಪ್ರದಾಯಿಕ ಸಿಹಿ ಲಸ್ಸಿ, ಮಸಾಲಾ ಮಜ್ಜಿಗೆ ಮತ್ತು ರುಚಿಕರ ದಹಿ ಖಾದ್ಯಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತದೆ.</p>
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap" rel="stylesheet">
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
      padding: 45px 55px;
      overflow: hidden;
    }

    .corner-ornament {
      position: absolute;
      width: 60px;
      height: 60px;
      pointer-events: none;
    }
    .top-left { top: 20px; left: 20px; }
    .top-right { top: 20px; right: 20px; transform: rotate(90deg); }
    .bottom-left { bottom: 20px; left: 20px; transform: rotate(-90deg); }
    .bottom-right { bottom: 20px; right: 20px; transform: rotate(180deg); }

    .inner-border {
      position: absolute;
      inset: 25px;
      border: 2px solid rgba(168, 139, 82, 0.55);
      border-radius: 6px;
      pointer-events: none;
    }

    .page-header {
      text-align: center;
      position: relative;
      z-index: 10;
      border-bottom: 2px solid rgba(168, 139, 82, 0.35);
      padding-bottom: 18px;
      margin-bottom: 18px;
    }

    .top-status-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 0 10px;
    }

    .veg-hallmark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0E3324;
      color: #E8CFA0;
      border: 1.5px solid #D4B475;
      padding: 7px 18px;
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
      margin: 4px 0 8px;
    }
    .logo-img {
      width: 145px;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.18));
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
      gap: 18px;
      margin-top: 4px;
    }
    .brand-title-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #164B35;
      text-transform: uppercase;
    }
    .brand-title-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #164B35;
    }
    .brand-sep {
      color: #D4B475;
      font-size: 24px;
    }

    .brand-cuisine {
      font-size: 13px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #8C7343;
      font-weight: 600;
      margin-top: 5px;
    }

    .chapter-title-box {
      margin-top: 14px;
    }
    .chapter-heading-dual {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 18px;
    }
    .chapter-heading-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 52px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #164B35;
    }
    .chapter-heading-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 38px;
      font-weight: 700;
      color: #164B35;
    }
    .chapter-sub-dual {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-size: 18px;
      color: #5C665F;
      margin-top: 4px;
    }
    .chapter-sub-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
    }
    .chapter-sub-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 15px;
    }

    .divider-motif {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-top: 10px;
      color: #D4B475;
      font-size: 16px;
    }
    .divider-motif span {
      width: 80px;
      height: 1px;
      background: linear-gradient(90deg, transparent, #D4B475, transparent);
    }

    /* 2 Columns: English Column on Left, Kannada Column on Right */
    .columns-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 60px;
      position: relative;
      z-index: 10;
      flex: 1;
      min-height: 0;
    }

    .column-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .center-spine-line {
      position: absolute;
      left: 50%;
      top: 5px;
      bottom: 5px;
      width: 1px;
      background: linear-gradient(180deg, transparent, rgba(168, 139, 82, 0.5) 10%, rgba(168, 139, 82, 0.5) 90%, transparent);
    }

    .lang-column-label {
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #8C7343;
      padding: 5px 16px;
      background: rgba(212, 180, 117, 0.18);
      border-radius: 999px;
      margin-bottom: 6px;
      display: inline-block;
      align-self: center;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: ${catMargin};
      text-align: center;
    }
    .category-header h4 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: ${catFontSize};
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #164B35;
      white-space: nowrap;
    }
    .cat-count {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.12em;
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
      gap: 6px;
    }

    .menu-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: ${rowPad};
    }

    .signature-row {
      background: rgba(212, 180, 117, 0.2);
      border-radius: 4px;
      padding: 4px 8px;
      margin: 0 -8px;
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 9px;
      flex-shrink: 0;
      max-width: 80%;
    }

    .veg-badge {
      width: 14px;
      height: 14px;
      border: 1.8px solid #166534;
      background: #fff;
      border-radius: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .veg-dot {
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
      background: #166534;
    }

    .dish-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: ${dishFontSize};
      font-weight: 600;
      color: #1E2621;
      letter-spacing: 0.02em;
      line-height: 1.18;
    }
    .dish-name.font-kannada {
      font-size: ${kannadaFontSize};
      font-weight: 600;
      line-height: 1.25;
    }

    .signature-badge {
      background: #164B35;
      color: #D4B475;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 3px;
      letter-spacing: 0.12em;
      margin-left: 6px;
      text-transform: uppercase;
    }

    .dotted-leader {
      flex: 1;
      border-bottom: 2px dotted rgba(168, 139, 82, 0.6);
      margin: 0 4px 4px;
      min-width: 20px;
    }

    .item-price {
      font-family: 'DM Sans', sans-serif;
      font-size: ${priceFontSize};
      font-weight: 700;
      color: #8C7343;
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }

    /* Thali Spotlight */
    .thali-spotlight-box, .chef-note-box {
      grid-column: span 2;
      margin-top: 16px;
      border: 2px solid #D4B475;
      border-radius: 8px;
      background: #FAF3E0;
      padding: 20px 26px;
      box-shadow: 0 4px 20px rgba(212, 180, 117, 0.25);
    }
    .thali-badge, .chef-note-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #164B35;
      text-align: center;
      margin-bottom: 8px;
    }
    .thali-title-dual {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 16px;
      margin-bottom: 10px;
    }
    .thali-title-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #0E3324;
      letter-spacing: 0.08em;
    }
    .thali-title-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 21px;
      font-weight: 700;
      color: #0E3324;
    }
    .thali-desc-dual {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 26px;
      font-size: 15px;
      line-height: 1.5;
      color: #2F3E35;
    }
    .thali-desc-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 18px;
    }
    .thali-desc-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 15px;
    }
    .thali-note {
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: #8C7343;
      margin-top: 10px;
      border-top: 1px dashed rgba(168, 139, 82, 0.5);
      padding-top: 8px;
    }
    .chef-note-text {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 19px;
      font-style: italic;
      color: #2F3E35;
      text-align: center;
      margin-top: 6px;
    }
    .chef-note-text-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 15.5px;
      color: #2F3E35;
      text-align: center;
      margin-top: 6px;
    }

    /* Footer */
    .page-footer {
      border-top: 2px solid rgba(168, 139, 82, 0.35);
      padding-top: 16px;
      margin-top: 16px;
      text-align: center;
      position: relative;
      z-index: 10;
    }

    .footer-heritage-box {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 18px;
      font-size: 16px;
      color: #8C7343;
    }
    .footer-heritage-en {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
    }
    .footer-heritage-kn {
      font-family: 'Noto Sans Kannada', sans-serif;
      font-size: 14px;
    }

    .footer-page-num {
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.28em;
      color: #164B35;
      text-transform: uppercase;
      margin-top: 6px;
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

      ${spotlightHTML}
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

// 4. Puppeteer/CDP rendering runner
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
  console.log('Generating all 8 menu images + Front Cover with increased font sizes (English & Kannada Side-by-Side)...');
  
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
    '--user-data-dir=/tmp/chrome-menu-gen-large',
    '--remote-debugging-port=9347',
    '--disable-gpu',
    '--no-first-run',
    'about:blank',
  ]);

  const pages = await waitForChrome(9347);
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

  for (const entry of fileMap) {
    let htmlContent = '';
    if (entry.type === 'cover') {
      htmlContent = renderCoverHTML();
    } else {
      const meta = OFFICIAL_PAGES.find(p => p.pageNumber === entry.pageNum);
      const items = OFFICIAL_MENU_DATA.filter(i => i.page === entry.pageNum);
      htmlContent = renderMenuPageHTML(meta, items);
    }

    const tmpHtmlPath = path.resolve(`temp_render_${entry.fileName}.html`);
    fs.writeFileSync(tmpHtmlPath, htmlContent);

    await send('Page.navigate', { url: 'file://' + tmpHtmlPath });
    await new Promise((r) => setTimeout(r, 1300));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const targetPath = path.join(outputDir, entry.fileName);
    fs.writeFileSync(targetPath, Buffer.from(snap.data, 'base64'));
    console.log(`[✓] Generated: ${entry.fileName} (${(fs.statSync(targetPath).size / 1024).toFixed(1)} KB)`);

    fs.unlinkSync(tmpHtmlPath);
  }

  ws.close();
  chrome.kill();
  console.log('\nAll 8 Menu Pages and Front Cover generated successfully in folder "menu/"!');
}

renderAll().catch(console.error);
