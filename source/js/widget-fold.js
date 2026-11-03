(function () {
  var SELECTOR = '.card.widget[data-type="categories"], .card.widget[data-type="tags"], .card.widget[data-type="links"]';

  function initWidgetFold(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var widgets = scope.querySelectorAll(SELECTOR);

    for (var i = 0; i < widgets.length; i++) {
      var widget = widgets[i];
      if (widget.getAttribute('data-fold-ready') === '1') {
        continue;
      }

      var label = widget.querySelector('.menu-label');
      if (!label) {
        continue;
      }

      widget.classList.add('is-collapsed');
      widget.setAttribute('data-fold-ready', '1');
      label.setAttribute('role', 'button');
      label.setAttribute('tabindex', '0');
      label.setAttribute('aria-expanded', 'false');

      label.addEventListener('click', function (event) {
        event.preventDefault();
        var card = event.currentTarget.closest('.card.widget');
        if (!card) {
          return;
        }
        var collapsed = card.classList.toggle('is-collapsed');
        event.currentTarget.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      });

      label.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        event.preventDefault();
        event.currentTarget.click();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initWidgetFold(document);
    });
  } else {
    initWidgetFold(document);
  }

  // Re-apply after PJAX / Insight swaps when present.
  document.addEventListener('pjax:complete', function () {
    initWidgetFold(document);
  });
})();
