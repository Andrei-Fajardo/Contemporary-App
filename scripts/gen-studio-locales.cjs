const fs = require('fs');
const path = require('path');
const root = path.join('D:', 'Coding', 'Work', 'Contemporary-App', 'src', 'pages');
const pages = [
  { file: 'index', component: 'StudioHomePage' },
  { file: 'about', component: 'StudioAboutPage' },
  { file: 'art', component: 'StudioArtPage' },
  { file: 'exhibitions', component: 'StudioExhibitionsPage' },
  { file: 'publications', component: 'StudioPublicationsPage' },
  { file: 'research', component: 'StudioResearchPage' },
  { file: 'press', component: 'StudioPressPage' },
  { file: 'contacts', component: 'StudioContactsPage' },
];
const locales = ['kr', 'kk', 'zh', 'ru'];

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('wrote', filePath);
}

for (const locale of locales) {
  for (const p of pages) {
    let filePath;
    let importDepth;
    if (locale === 'kr') {
      filePath = path.join(root, locale, `${p.file}.astro`);
      importDepth = '../../components/studio/';
    } else if (p.file === 'index') {
      filePath = path.join(root, locale, 'index.astro');
      importDepth = '../../components/studio/';
    } else {
      filePath = path.join(root, locale, p.file, 'index.astro');
      importDepth = '../../../components/studio/';
    }
    const content = `---
import ${p.component} from '${importDepth}${p.component}.astro';
---

<${p.component} locale="${locale}" />
`;
    write(filePath, content);
  }
}
