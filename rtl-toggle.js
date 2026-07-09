// Detect language changes and update the page direction.
// This helps when translation tools such as Google Translate change the page language.

const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
const ltrBootstrapCss = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
const rtlBootstrapCss = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';

function getDetectedLanguage() {
  const htmlLang = document.documentElement.lang || '';
  const bodyLang = document.body ? document.body.lang || '' : '';
  const browserLang = navigator.language || '';

  const rawLang = htmlLang || bodyLang || browserLang;
  return String(rawLang).split(/[-_]/)[0].toLowerCase();
}

function updateDirection() {
  const language = getDetectedLanguage();
  const isRtl = rtlLanguages.includes(language);

  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

  const bootstrapLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((link) => {
    return link.href.includes('bootstrap');
  });

  if (bootstrapLink) {
    const nextCss = isRtl ? rtlBootstrapCss : ltrBootstrapCss;

    if (bootstrapLink.href !== nextCss) {
      bootstrapLink.href = nextCss;
    }
  }
}

updateDirection();

const observer = new MutationObserver(() => {
  updateDirection();
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});

if (document.body) {
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['lang']
  });
}

window.addEventListener('load', updateDirection);
window.addEventListener('languagechange', updateDirection);

let lastLanguage = '';

setInterval(() => {
  const currentLanguage = getDetectedLanguage();

  if (currentLanguage !== lastLanguage) {
    lastLanguage = currentLanguage;
    updateDirection();
  }
}, 750);
