(() => {
  'use strict';

  const CONSENT_KEY = 'yakovenko_analytics_consent_v1';
  const idMeta = document.querySelector('meta[name="yandex-metrika-id"]');
  const METRIKA_ID = Number(idMeta?.content || 0);
  const panel = document.querySelector('[data-cookie-panel]');
  let metrikaLoaded = false;

  const readConsent = () => {
    try { return localStorage.getItem(CONSENT_KEY); }
    catch (_) { return null; }
  };

  const saveConsent = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value); }
    catch (_) { /* Сайт работает и при заблокированном локальном хранилище. */ }
  };

  const showPanel = () => {
    if (!panel || !METRIKA_ID) return;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-visible'));
  };

  const hidePanel = () => {
    if (!panel) return;
    panel.classList.remove('is-visible');
    setTimeout(() => { panel.hidden = true; }, 240);
  };

  const loadMetrika = () => {
    if (!METRIKA_ID || metrikaLoaded) return;
    metrikaLoaded = true;

    window.ym = window.ym || function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = Date.now();

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.append(script);

    window.ym(METRIKA_ID, 'init', {
      clickmap: false,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
      ecommerce: false,
      sendTitle: true
    });
  };

  const goalForLink = (link) => {
    const host = link.hostname.replace(/^www\./, '');
    if (host === 'vrukah.com') return 'clinic_vrukah';
    if (host === 'gemotest.ru') return 'clinic_gemotest';
    if (host === 'yandex.ru') return 'yandex_maps';
    if (host === 'prodoctorov.ru') return 'prodoctorov';
    if (host === 't.me') return 'telegram';
    if (host === 'vk.com') return 'vkontakte';
    if (host === 'elibrary.ru') return 'elibrary';
    if (host === 'orcid.org') return 'orcid';
    return 'external_link';
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="http"]');
    if (!link || !metrikaLoaded || typeof window.ym !== 'function') return;
    window.ym(METRIKA_ID, 'reachGoal', goalForLink(link), {
      destination: link.hostname,
      path: link.pathname
    });
  });

  document.querySelectorAll('[data-cookie-accept]').forEach((button) => {
    button.addEventListener('click', () => {
      saveConsent('accepted');
      hidePanel();
      loadMetrika();
    });
  });

  document.querySelectorAll('[data-cookie-reject]').forEach((button) => {
    button.addEventListener('click', () => {
      saveConsent('rejected');
      hidePanel();
    });
  });

  document.querySelectorAll('[data-cookie-settings]').forEach((button) => {
    button.addEventListener('click', () => showPanel());
  });

  const consent = readConsent();
  if (consent === 'accepted') loadMetrika();
  else if (consent !== 'rejected') showPanel();
})();
