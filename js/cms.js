/**
 * CMS images from Admin / Supabase.
 * Uses localStorage cache so refresh does NOT flash old static images.
 * Slot keys: site_logo, home_hero, home_doctor, home_clinic1, home_clinic2,
 *            about_main, about_side
 */
(function () {
  var CACHE_KEY = 'matangi_cms_slots_v1';

  var SLOT_DEFAULTS = {
    site_logo: { mode: 'contain', pos: 'center center' },
    home_hero: { mode: 'cover', pos: 'center center' },
    home_doctor: { mode: 'contain', pos: 'center top' },
    home_clinic1: { mode: 'natural', pos: 'center center' },
    home_clinic2: { mode: 'natural', pos: 'center center' },
    about_main: { mode: 'natural', pos: 'center center' },
    about_side: { mode: 'natural', pos: 'center center' }
  };

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) {
      return {};
    }
  }

  function writeCache(map) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(map));
    } catch (e) {}
  }

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

  function applyRowToImg(img, row, key) {
    if (!img || !row || !row.photo_url) return false;
    // Only change src if different — avoids reload flicker
    if (img.getAttribute('src') !== row.photo_url) {
      img.src = row.photo_url;
    }
    if (row.alt_text) img.alt = row.alt_text;
    applyMode(img, row.display_mode, row.object_position);
    img.setAttribute('data-cms-ready', '1');
    return true;
  }

  function applyMap(map) {
    document.querySelectorAll('[data-slot]').forEach(function (el) {
      var key = el.getAttribute('data-slot');
      var row = map[key];
      var img = el.tagName === 'IMG' ? el : el.querySelector('img');
      if (!img) return;
      if (row && row.photo_url) {
        applyRowToImg(img, row, key);
      } else {
        var def = SLOT_DEFAULTS[key] || { mode: 'natural', pos: 'center center' };
        applyMode(img, def.mode, def.pos);
        img.setAttribute('data-cms-ready', '1');
      }
    });
  }

  window.SmrutiCMS = {
    loadSlots: async function () {
      if (!window.sb) return {};
      try {
        var r = await sb.from('site_images').select('*');
        if (r.error || !r.data) return {};
        var map = {};
        r.data.forEach(function (row) {
          map[row.slot_key] = {
            photo_url: row.photo_url,
            alt_text: row.alt_text || '',
            display_mode: row.display_mode || 'natural',
            object_position: row.object_position || 'center center'
          };
        });
        return map;
      } catch (e) {
        console.warn('CMS load', e);
        return {};
      }
    },

    /** Instant paint from localStorage, then refresh from network */
    applyToPage: async function () {
      var cached = readCache();
      if (cached && Object.keys(cached).length) {
        applyMap(cached);
      }

      var slots = await this.loadSlots();
      if (slots && Object.keys(slots).length) {
        writeCache(slots);
        applyMap(slots);
      } else if (!Object.keys(cached).length) {
        // No cache, no network — mark defaults ready
        document.querySelectorAll('[data-slot]').forEach(function (el) {
          var img = el.tagName === 'IMG' ? el : el.querySelector('img');
          if (img) img.setAttribute('data-cms-ready', '1');
        });
      }
    },

    applyMode: applyMode,
    clearCache: function () {
      try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
    }
  };

  // Apply cache IMMEDIATELY (before DOMContentLoaded finishes) if possible
  function boot() {
    var cached = readCache();
    if (cached && Object.keys(cached).length) {
      applyMap(cached);
    }
    if (window.SmrutiCMS) {
      window.SmrutiCMS.applyToPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
