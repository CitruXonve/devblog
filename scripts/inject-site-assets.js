/* global hexo */

/**
 * Inject site-owned CSS/JS overlays without patching the Icarus submodule.
 */

const fs = require('fs');
const path = require('path');

function loadYaml(text) {
  try {
    return require('hexo-component-inferno/lib/util/yaml').parse(text);
  } catch (e) {
    return require('js-yaml').load(text);
  }
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getProfileWidget() {
  const cfgPath = path.join(hexo.base_dir, '_config.icarus.yml');
  if (!fs.existsSync(cfgPath)) {
    return null;
  }
  try {
    const cfg = loadYaml(fs.readFileSync(cfgPath, 'utf8')) || {};
    const widgets = cfg.widgets;
    if (!Array.isArray(widgets)) {
      return null;
    }
    return widgets.find((widget) => widget && widget.type === 'profile') || null;
  } catch (e) {
    return null;
  }
}

function buildPrintAuthorBar() {
  const profile = getProfileWidget();
  if (!profile) {
    return '';
  }

  const author = escapeHtml(profile.author);
  const authorTitle = escapeHtml(profile.author_title);
  const location = escapeHtml(profile.location);
  const avatar = escapeHtml(profile.avatar);
  const roundedClass = profile.avatar_rounded ? ' is-rounded' : '';

  if (!author && !authorTitle && !location && !avatar) {
    return '';
  }

  const avatarHtml = avatar
    ? `<img class="print-author-avatar${roundedClass}" src="${avatar}" alt="${author || 'Author'}" height="28" width="28">`
    : '';

  const metaParts = [];
  if (author) {
    metaParts.push(`<span class="print-author-name">${author}</span>`);
  }
  if (authorTitle) {
    metaParts.push(`<span class="print-author-title">${authorTitle}</span>`);
  }
  if (location) {
    metaParts.push(`<span class="print-author-location">${location}</span>`);
  }

  return [
    '<div class="print-author-bar" aria-hidden="true">',
    avatarHtml,
    metaParts.length ? `<div class="print-author-meta">${metaParts.join('')}</div>` : '',
    '</div>',
    '<script>',
    '(function(){',
    'var bar=document.querySelector(".print-author-bar");',
    'var brand=document.querySelector(".navbar-brand");',
    'if(bar&&brand){brand.appendChild(bar);}',
    '})();',
    '</script>'
  ].join('');
}

hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="/css/site-overrides.css">'
);

hexo.extend.injector.register('body_end', () => {
  const parts = ['<script src="/js/widget-fold.js" defer></script>', buildPrintAuthorBar()];
  return parts.filter(Boolean).join('');
});
