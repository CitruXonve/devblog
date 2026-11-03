/* global hexo */

/**
 * Inject site-owned CSS/JS overlays without patching the Icarus submodule.
 */
hexo.extend.injector.register(
  'head_end',
  '<link rel="stylesheet" href="/css/site-overrides.css">'
);

hexo.extend.injector.register(
  'body_end',
  '<script src="/js/widget-fold.js" defer></script>'
);
