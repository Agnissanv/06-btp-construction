(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute('data-page');

  var mb = $('.menu-btn'), nav = $('#nav');
  if (mb && nav) mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o ? 'true' : 'false'); });

  function validate(scope) {
    var ok = true;
    $$('[required]', scope).forEach(function (f) {
      var v = f.type === 'checkbox' ? f.checked : f.value.trim() !== '';
      if (v && f.type === 'tel') v = /^[+\d][\d\s().-]{7,}$/.test(f.value.trim());
      if (v && f.type === 'number') v = +f.value >= +(f.min || 0);
      var e = $('[data-err-for="' + f.id + '"]', scope); if (e) e.classList.toggle('show', !v);
      f.setAttribute('aria-invalid', v ? 'false' : 'true');
      if (!v) ok = false;
    });
    var bad = $('[aria-invalid="true"]', scope); if (bad) bad.focus();
    return ok;
  }
  var fmtM = function (n) { var m = n / 1e6; return m.toLocaleString('fr-FR', { maximumFractionDigits: m >= 100 ? 0 : 1 }).replace(/[  ]/g, ' ') + ' M FCFA'; };
  var fmtN = function (n) { return Math.round(n).toLocaleString('fr-FR').replace(/[  ]/g, ' '); };

  // ---------- Réalisations : filtres
  var grid = $('#grid');
  if (grid) {
    var cards = $$('.proj', grid), chips = $$('.chips button'), sel = $('#f-commune'), type = 'all';
    var apply = function () {
      var c = sel.value, n = 0;
      cards.forEach(function (p) { var ok = (type === 'all' || p.getAttribute('data-type') === type) && (c === 'all' || p.getAttribute('data-commune') === c); p.hidden = !ok; if (ok) n++; });
      $('#count').textContent = n + (n > 1 ? ' projets' : ' projet'); $('#empty').style.display = n ? 'none' : 'block';
    };
    chips.forEach(function (b) { b.addEventListener('click', function () { type = b.getAttribute('data-type'); chips.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); apply(); }); });
    sel.addEventListener('change', apply);
    $('#reset').addEventListener('click', function () { type = 'all'; sel.value = 'all'; chips.forEach(function (x, i) { x.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'); }); apply(); });
  }

  // ---------- Fiche projet : comparateur avant / après
  var ba = $('#ba');
  if (ba) { var r = $('input', ba); var set = function () { ba.style.setProperty('--pos', r.value + '%'); }; r.addEventListener('input', set); set(); }

  // ---------- Devis : estimateur + formulaire en étapes
  var est = $('#estimateur');
  if (est) {
    var RATES = { villa: { std: [250000, 300000], conf: [300000, 380000], prem: [380000, 520000] }, immeuble: { std: [230000, 290000], conf: [290000, 360000], prem: [360000, 470000] }, renovation: { std: [90000, 140000], conf: [140000, 210000], prem: [210000, 320000] }, commercial: { std: [240000, 310000], conf: [310000, 400000], prem: [400000, 550000] } };
    var DUR = { villa: [6, 60], immeuble: [8, 150], renovation: [2, 100], commercial: [7, 120] };
    var et = $('#e-type'), em = $('#e-m2'), ef = $('#e-fin');
    var calc = function () {
      var m2 = +em.value;
      if (!m2 || m2 < 20) { $('#e-out').textContent = 'Indiquez une surface d’au moins 20 m²'; $('#e-pm').textContent = '—'; $('#e-dur').textContent = '—'; return; }
      var rt = RATES[et.value][ef.value], d = DUR[et.value], months = d[0] + m2 / d[1];
      $('#e-out').textContent = fmtM(m2 * rt[0]) + ' à ' + fmtM(m2 * rt[1]);
      $('#e-pm').textContent = fmtN(rt[0]) + ' à ' + fmtN(rt[1]) + ' FCFA';
      $('#e-dur').textContent = Math.max(1, Math.round(months * 0.85)) + ' à ' + Math.max(2, Math.round(months * 1.15)) + ' mois';
    };
    [et, em, ef].forEach(function (x) { x.addEventListener('input', calc); x.addEventListener('change', calc); }); calc();

    var q = $('#quote'), steps = $$('.step', q), dots = $$('.progress li', q), at = 0;
    var qt = new URLSearchParams(location.search).get('t');
    if (qt && RATES[qt]) { et.value = qt; $('#q-type').value = qt; calc(); }
    $('#e-use').addEventListener('click', function () { $('#q-type').value = et.value; $('#q-m2').value = em.value; $('#q-fin').value = ef.value; q.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    var go = function (n) {
      at = n; steps.forEach(function (s, i) { s.classList.toggle('on', i === n); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === n); d.classList.toggle('done', i < n); });
      var h = $('h3', steps[n]); if (h) h.focus();
    };
    $$('[data-next]', q).forEach(function (b) { b.addEventListener('click', function () { if (!validate(steps[at])) return; go(at + 1); }); });
    $$('[data-prev]', q).forEach(function (b) { b.addEventListener('click', function () { go(at - 1); }); });
    q.addEventListener('submit', function (e) {
      e.preventDefault(); if (!validate(steps[2])) return;
      $('#d-name').textContent = $('#q-nom').value.trim(); $('#d-ref').textContent = 'DV-2026-' + (1000 + Math.floor(Math.random() * 9000));
      steps.forEach(function (s) { s.classList.remove('on'); }); dots.forEach(function (d) { d.classList.remove('on'); d.classList.add('done'); });
      $('.progress', q).style.display = 'none'; var ok = $('#done'); ok.classList.add('show'); ok.setAttribute('tabindex', '-1'); ok.focus();
    });
  }

  // ---------- Contact
  var cf = $('#cform');
  if (cf) cf.addEventListener('submit', function (e) { e.preventDefault(); if (!validate(cf)) return; cf.reset(); $('#c-msg-ok').hidden = false; });
})();
