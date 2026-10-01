/* Shared header/footer + helpers for Matangi Dental */
(function () {
  var PHONE1 = '+918511031355';
  var PHONE1_DISPLAY = '+91 85110 31355';
  var PHONE2 = '';
  var PHONE2_DISPLAY = '';
  var WA = '918511031355';
  var EMAIL = '';
  var ADDRESS = 'FF-135, Ratnadeep Flora, near Smruti circle, opposite Ashray gold flats, New Ranip, Ahmedabad, Gujarat 382470';

  function pathBase() {
    var p = window.location.pathname;
    if (p.indexOf('/') === -1) return '';
    return '';
  }

  function pageName() {
    var p = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (!p || p === '') return 'index.html';
    return p;
  }

  function navLink(href, label, current) {
    var active = current === href ? ' class="active"' : '';
    return '<a href="' + href + '"' + active + '>' + label + '</a>';
  }

  window.SmrutiSite = {
    phone1: PHONE1,
    phone1Display: PHONE1_DISPLAY,
    phone2: PHONE2,
    phone2Display: PHONE2_DISPLAY,
    wa: WA,
    email: EMAIL,
    address: ADDRESS,

    injectChrome: function () {
      var cur = pageName();
      var topbar = document.getElementById('site-topbar');
      var header = document.getElementById('site-header');
      var footer = document.getElementById('site-footer');

      if (topbar) {
        topbar.innerHTML =
          '<div class="wrap">' +
          '<div class="topbar-left">' +
          '<span>📍 ' + ADDRESS + '</span> ' +
          '<a href="https://www.google.com/maps/dir/?api=1&destination=' +
          encodeURIComponent(ADDRESS) +
          '" target="_blank" rel="noopener">Open Map</a>' +
          '</div>' +
          '<div class="topbar-right">' +
          '<a href="tel:' + PHONE1 + '">📞 ' + PHONE1_DISPLAY + '</a> ' +
          '<a href="tel:' + PHONE2 + '">' + PHONE2_DISPLAY + '</a>' +
          '</div></div>';
      }

      if (header) {
        var logoSrc = 'images/logo.png';
        try {
          var cm = JSON.parse(localStorage.getItem('matangi_cms_slots_v1') || '{}');
          if (cm.site_logo && cm.site_logo.photo_url) logoSrc = cm.site_logo.photo_url;
        } catch (e0) {}
        header.innerHTML =
          '<div class="wrap">' +
          '<a href="index.html" class="logo" id="logoClick">' +
          '<img src="' + logoSrc + '" alt="Dr. Matangi\'s Dental Care logo" width="40" height="40">' +
          ' Matangi Dental</a>' +
          '<nav class="nav" aria-label="Main">' +
          navLink('index.html', 'Home', cur) +
          navLink('services.html', 'Services', cur) +
          navLink('gallery.html', 'Gallery', cur) +
          navLink('about.html', 'About', cur) +
          navLink('book.html', 'Book Appointment', cur) +
          navLink('contact.html', 'Contact', cur) +
          '</nav>' +
          '<div class="header-actions">' +
          '<a href="tel:' + PHONE1 + '" class="btn btn-call" title="Call ' + PHONE1_DISPLAY + '">Call ' + PHONE1_DISPLAY + '</a> ' +
          '<a href="book.html" class="btn btn-red">Book</a>' +
          '</div></div>';
      }

      if (footer) {
        footer.innerHTML =
          '<div class="wrap">' +
          '<div class="footer-grid">' +
          '<div><h4>Matangi Dental</h4>' +
          '<p>Dr. Matangi\'s Dental Care — Multispeciality Dental Clinic</p>' +
          '<p>Dr. Matangi Thaker Patel, BDS, MDS</p>' +
          '<p class="footer-note">Sunday closed. <a href="tel:' + PHONE1 + '">' + PHONE1_DISPLAY + '</a>.</p>' +
          '</div>' +
          '<div><h4>Quick links</h4>' +
          '<p><a href="index.html">Home</a></p>' +
          '<p><a href="services.html">Services</a></p>' +
          '<p><a href="gallery.html">Gallery</a></p>' +
          '<p><a href="about.html">About</a></p>' +
          '<p><a href="book.html">Book Appointment</a></p>' +
          '<p><a href="contact.html">Contact</a></p></div>' +
          '<div><h4>Contact</h4>' +
          '<p><a href="tel:' + PHONE1 + '">' + PHONE1_DISPLAY + '</a></p>' +
          '<p><a href="tel:' + PHONE2 + '">' + PHONE2_DISPLAY + '</a></p>' +
          '<p><a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">WhatsApp</a></p>' +
          '<p><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p></div>' +
          '<div><h4>Visit</h4>' +
          '<p>' + ADDRESS + '</p>' +
          '<p>Mon–Sat: 9:30 AM–1:30 PM<br>4:00 PM–8:00 PM</p>' +
          '<p>Sunday closed</p></div>' +
          '</div>' +
          '<div class="footer-bottom">© 2026 Dr. Matangi\'s Dental Care — Multispeciality Dental Clinic · New Ranip, Ahmedabad</div>' +
          '</div>';
      }

      // Float buttons
      var floats = document.getElementById('site-floats');
      if (floats) {
        floats.innerHTML =
          '<a href="https://wa.me/' + WA + '?text=' +
          encodeURIComponent('Hi, I want to book an appointment at Dr. Matangi\'s Dental Care.') +
          '" class="float-wa" target="_blank" rel="noopener" title="WhatsApp" aria-label="WhatsApp">💬</a>' +
          '<a href="book.html" class="float-book" title="Book appointment" aria-label="Book appointment">BOOK</a>';
      }

      // Logo 5-click → #login
      var logo = document.getElementById('logoClick');
      var clicks = 0;
      if (logo) {
        logo.addEventListener('click', function (e) {
          clicks++;
          if (clicks >= 5) {
            e.preventDefault();
            clicks = 0;
            window.location.href = 'index.html#login';
            if (typeof window.openLogin === 'function') window.openLogin();
          }
          setTimeout(function () { clicks = 0; }, 2500);
        });
      }

      // Load logo from Admin CMS (slot: site_logo)
      this.loadLogoFromCms();
    },


    loadLogoFromCms: async function () {
      try {
        var img = document.querySelector('.logo img');
        if (!img) return;
        // 1) Instant from CMS cache (same key as cms.js)
        try {
          var raw = localStorage.getItem('matangi_cms_slots_v1');
          if (raw) {
            var map = JSON.parse(raw);
            if (map && map.site_logo && map.site_logo.photo_url) {
              if (img.getAttribute('src') !== map.site_logo.photo_url) {
                img.src = map.site_logo.photo_url;
              }
            }
          }
        } catch (e0) {}
        // 2) Network refresh
        if (!window.sb) return;
        var r = await sb.from('site_images').select('photo_url, alt_text').eq('slot_key', 'site_logo').maybeSingle();
        if (r.error) return;
        if (r.data && r.data.photo_url) {
          if (img.getAttribute('src') !== r.data.photo_url) {
            img.src = r.data.photo_url;
          }
          if (r.data.alt_text) img.alt = r.data.alt_text;
        }
      } catch (e) {
        console.warn('logo load', e);
      }
    },

    getQueryParam: function (name) {
      var q = window.location.search.substring(1).split('&');
      for (var i = 0; i < q.length; i++) {
        var p = q[i].split('=');
        if (decodeURIComponent(p[0]) === name) return decodeURIComponent(p[1] || '');
      }
      return '';
    },

    escapeHtml: function (s) {
      if (!s) return '';
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.SmrutiSite.injectChrome();
  });
})();
