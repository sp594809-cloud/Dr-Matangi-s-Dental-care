/**
 * Smruti CMS — images come from Admin / Supabase, not hard-coded.
 * Slot keys: home_hero, home_doctor, home_clinic1, home_clinic2,
 *            about_main, about_side, gallery items via gallery table
 */
(function () {
  var SLOT_DEFAULTS = {
    home_hero: { mode: 'cover', pos: 'center center' },
    home_doctor: { mode: 'contain', pos: 'center top' },
    home_clinic1: { mode: 'natural', pos: 'center center' },
    home_clinic2: { mode: 'natural', pos: 'center center' },
    about_main: { mode: 'natural', pos: 'center center' },
    about_side: { mode: 'natural', pos: 'center center' }
  };

  function applyMode(img, mode, pos) {
    if (!img) return;
    mode = mode || 'natural';
    pos = pos || 'center center';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.objectFit = '';
    img.style.objectPosition = '';
    img.classList.remove('cms-cover', 'cms-contain', 'cms-natural');

    if (mode === 'cover') {
      img.classList.add('cms-cover');
      img.style.objectFit = 'cover';
      img.style.objectPosition = pos;
      img.style.height = '100%';
      img.style.minHeight = '280px';
    } else if (mode === 'contain') {
      img.classList.add('cms-contain');
      img.style.objectFit = 'contain';
      img.style.objectPosition = pos;
      img.style.background = '#f0f0f0';
      img.style.minHeight = '200px';
    } else {
      img.classList.add('cms-natural');
      img.style.objectFit = 'contain';
      img.style.height = 'auto';
      img.style.maxHeight = 'none';
    }
  }

  window.SmrutiCMS = {
    loadSlots: async function () {
      if (!window.sb) return {};
      try {
        var r = await sb.from('site_images').select('*');
        if (r.error || !r.data) return {};
        var map = {};
        r.data.forEach(function (row) {
          map[row.slot_key] = row;
        });
        return map;
      } catch (e) {
        console.warn('CMS load', e);
        return {};
      }
    },

    applyToPage: async function () {
      var slots = await this.loadSlots();
      document.querySelectorAll('[data-slot]').forEach(function (el) {
        var key = el.getAttribute('data-slot');
        var row = slots[key];
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;
        if (row && row.photo_url) {
          img.src = row.photo_url;
          if (row.alt_text) img.alt = row.alt_text;
          applyMode(img, row.display_mode, row.object_position);
        } else {
          var def = SLOT_DEFAULTS[key] || { mode: 'natural', pos: 'center center' };
          applyMode(img, def.mode, def.pos);
        }
      });
    },

    applyMode: applyMode
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.SmrutiCMS) window.SmrutiCMS.applyToPage();
    });
  } else {
    setTimeout(function () {
      if (window.SmrutiCMS) window.SmrutiCMS.applyToPage();
    }, 100);
  }
})();
