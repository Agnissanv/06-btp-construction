// Génère les pages HTML statiques et js/data.js : node _build/build.js
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..');

const SITE = 'Bâti Horizon';
const CODE_AZ_URL = 'https://agnissanisaac.com';
const PHONE = '+225 27 21 55 00 00';
const EMAIL = 'contact@bati-horizon.example';
const WA = 'https://wa.me/2250700000000';
const fmt = n => n.toLocaleString('fr-FR').replace(/[  ]/g, ' ');

const ic = {
  pin: '<path d="M12 22s7-6.500 7-12a7 7 0 0 0-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.500"/><path d="M3 20c0-3.500 2.700-6 6-6s6 2.500 6 6M15 14.300c3.300-.6 6 1.500 6 4.700"/>',
  house: '<path d="M3 11l9-8 9 8M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  wrench: '<path d="M14.500 6.500a4 4 0 0 0 5 5l-9.500 9.500a2.100 2.100 0 0 1-3-3zM14 7l3-3"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  roller: '<rect x="4" y="3" width="14" height="6" rx="1.500"/><path d="M18 6h2v5h-8v3M12 14v7"/>',
  ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  hammer: '<path d="M14 4l6 6-3 3-6-6zM12 9L3 18l3 3 9-9"/>',
  hat: '<path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 10V6M9 10V7h6v3"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.500 9.500c.5-1 1.500-1.500 2.500-1.500 1.500 0 2.500.8 2.500 2s-1 1.800-2.500 2-2.500.8-2.500 2 1 2 2.500 2c1 0 2-.5 2.500-1.500"/>',
  play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};
const svg = (k, c = '') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[k]}</svg>`;
const arr = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic.arrow}</svg>`;
const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.800-1.200-4.600-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.900.9c.3.1.5.2.5.3.1.2.1.8-.1 1.400z"/></svg>';
const logo = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24L24 8l18 16" fill="none" stroke="#E8631A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 22v18h26V22" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M17 40V30h14v10M17 34h14" fill="none" stroke="#E8631A" stroke-width="3"/></svg>';

const types = { villa: 'Villa', immeuble: 'Immeuble', renovation: 'Rénovation', commercial: 'Commercial' };
const services = [
  ['house', 'Construction neuve', 'Villas et immeubles, de la fondation à la toiture.', ['Villas individuelles et jumelées', 'Immeubles de logements', 'Suivi de chantier complet']],
  ['wrench', 'Rénovation', 'Remettre à neuf, agrandir, mettre aux normes.', ['Rénovation lourde et légère', 'Extension et surélévation', 'Reprise de façades et toitures']],
  ['building', 'Gros œuvre', 'Fondations, structure béton, maçonnerie.', ['Terrassement et fondations', 'Poteaux, dalles, voiles en béton armé', 'Maçonnerie et enduits']],
  ['roller', 'Aménagement', 'Cloisons, sols, peinture, extérieurs.', ['Second œuvre et finitions', 'Aménagement de bureaux et commerces', 'Clôtures, allées et espaces verts']],
  ['ruler', 'Études et plans', 'Concevoir, chiffrer, planifier avant de construire.', ['Plans et avant-projet', 'Devis détaillé par lot', 'Planning partagé avec le client']],
];
const projects = [
  { id: 'villa-les-jasmins', name: 'Villa Les Jasmins', type: 'villa', commune: 'Cocody', m2: 320, mois: 14, year: 2025, av: 'terrain', pe: 'macons3', ap: 'villa', ph: [2, 6, 4, 2], d: 'Une villa familiale de plain-pied et un étage, avec terrasse couverte et clôture. Fondations sur semelles, structure en béton armé, finitions soignées.' },
  { id: 'residence-riviera-golf', name: 'Résidence Riviera Golf', type: 'immeuble', commune: 'Cocody', m2: 2800, mois: 22, year: 2024, av: 'coffrage', pe: 'macons1', ap: 'riviera', ph: [3, 10, 6, 3], d: 'Un immeuble de logements en R+5 avec parkings en rez-de-chaussée. Structure poteaux-dalles, façades enduites, circulations sécurisées.' },
  { id: 'immeuble-yopougon-centre', name: 'Immeuble Yopougon Centre', type: 'immeuble', commune: 'Yopougon', m2: 1200, mois: 16, year: 2025, av: 'beton', pe: 'macons8', ap: 'yopougon', ph: [2, 7, 5, 2], d: 'Un immeuble mixte en R+3 : commerces au rez-de-chaussée, logements aux étages. Dalle coulée en continu, maçonnerie en agglos.' },
  { id: 'villa-duplex-bingerville', name: 'Villa duplex Bingerville', type: 'villa', commune: 'Bingerville', m2: 240, mois: 12, year: 2025, av: 'terrain', pe: 'douala', ap: 'moderne', ph: [2, 5, 3, 2], d: 'Un duplex contemporain aux volumes simples, grandes baies et toiture-terrasse. Livré en douze mois, de la parcelle nue à la remise des clés.' },
  { id: 'renovation-villa-marcory', name: 'Rénovation villa Marcory', type: 'renovation', commune: 'Marcory', m2: 180, mois: 5, year: 2025, av: 'macons3', pe: 'echafaudage', ap: 'villa', ph: [1, 2, 1, 1], d: 'Rénovation complète d’une villa des années 1990 : reprise des façades, toiture, électricité, plomberie, cuisine et salles d’eau.' },
  { id: 'siege-zone-4', name: 'Siège commercial Zone 4', type: 'commercial', commune: 'Marcory', m2: 900, mois: 11, year: 2024, av: 'coffrage', pe: 'casque', ap: 'moderne', ph: [2, 4, 3, 2], d: 'Un bâtiment de bureaux et d’espaces d’accueil sur trois niveaux, avec façade vitrée et parking. Livré clés en main.' },
  { id: 'renovation-plateau', name: 'Rénovation immeuble Plateau', type: 'renovation', commune: 'Plateau', m2: 1500, mois: 9, year: 2024, av: 'yopougon', pe: 'echafaudage', ap: 'riviera', ph: [1, 4, 2, 2], d: 'Remise à niveau d’un immeuble de bureaux en activité : façades, étanchéité, circulations, sans interrompre l’exploitation.' },
  { id: 'centre-commercial-koumassi', name: 'Centre commercial Koumassi', type: 'commercial', commune: 'Koumassi', m2: 2200, mois: 18, year: 2025, av: 'terrain', pe: 'aerien', ap: 'moderne', ph: [3, 8, 4, 3], d: 'Un centre commercial de quartier avec boutiques, marché couvert et parking. Grandes portées en béton et charpente métallique.' },
];
const photos = {
  terrain: { alt: 'Terrain nu avec terre rouge et construction blanche au loin', by: 'Kwameghana', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Modern_house_under_construction.jpg' },
  macons1: { alt: 'Immeuble en construction entouré d’échafaudages en bambou et en métal', by: 'Yasield', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Maçons_au_travail_01.jpg' },
  macons3: { alt: 'Deux bâtiments en béton en construction, échafaudages et toits de tôle bleue', by: 'Yasield', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Maçons_au_travail_03.jpg' },
  macons8: { alt: 'Façade d’immeuble en béton brut avec échafaudages et ouvriers', by: 'Yasield', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Maçons_au_travail_08.jpg' },
  beton: { alt: 'Ouvriers en gilets orange coulant une dalle de béton avec une pompe', by: 'OLUWATOBILOBA', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Construction_workers_in_Lagos,Nigeria_01.jpg' },
  coffrage: { alt: 'Fouille de fondation avec armatures et coffrages en bois, ouvriers en casque', by: 'OLUWATOBILOBA', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Construction_workers_in_Lagos,Nigeria_03.jpg' },
  douala: { alt: 'Immeuble en construction avec coffrages, sable et ouvriers sur les échafaudages', by: 'Minette Lontsie', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Construction_Workers_in_Douala.jpg' },
  villa: { alt: 'Villa contemporaine blanche et bleue derrière un mur de clôture', by: 'Amuzujoe', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Apartments_East_Cantonment.jpg' },
  moderne: { alt: 'Immeuble contemporain aux volumes décalés et aux garde-corps en verre', by: 'Amuzujoe', lic: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:Apartment_Modern.jpg' },
  riviera: { alt: 'Résidences en copropriété entourées de palmiers sous un ciel orageux', by: 'Willy Stephane Awaho', lic: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Copropriétés_Abidjan_Riviéra_Golf.jpg' },
  yopougon: { alt: 'Petit immeuble de quatre niveaux éclairé au crépuscule', by: 'Willy Stephane Awaho', lic: 'CC BY 2.0', page: 'https://commons.wikimedia.org/wiki/File:Petit_immeuble_à_Yopougon.jpg' },
  casque: { alt: 'Deux personnes en casque sur un balcon à garde-corps en verre, sous un ciel bleu', by: 'HelenOnline', lic: 'CC BY-SA 3.0', page: 'https://commons.wikimedia.org/wiki/File:Construction_worker_CT.jpg' },
  aerien: { alt: 'Vue aérienne d’un grand chantier avec grues rouges et fondations', by: 'chuttersnap', lic: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:View_Above_Construction_Site_(Unsplash).jpg' },
  echafaudage: { alt: 'Silhouettes d’ouvriers sur un échafaudage, en noir et blanc', by: 'John Salvino', lic: 'CC0', page: 'https://commons.wikimedia.org/wiki/File:Construction_Work_(Unsplash).jpg' },
};
const used = { hero: ['Ouvriers coulant une dalle de béton (en-tête)', photos.beton], about: ['Deux personnes en casque sur un balcon (à propos)', photos.casque], cta: ['Vue aérienne d’un grand chantier (bandeau)', photos.aerien], echaf: ['Silhouettes sur échafaudage (entreprise)', photos.echafaudage] };

const navItems = [['index.html', 'Accueil'], ['entreprise.html', 'L’entreprise'], ['services.html', 'Services'], ['realisations.html', 'Réalisations'], ['devis.html', 'Devis']];

function head({ title, desc, schema, page, preload }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#2E3237">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/barlow-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${preload || ''}<link rel="stylesheet" href="css/style.css">
${schema || ''}</head>
<body data-page="${page}">
<a class="skip" href="#contenu">Aller au contenu</a>
<div class="topbar"><div class="wrap"><span>${svg('pin')}Riviera Palmeraie, Cocody, Abidjan</span><span>${svg('mail')}${EMAIL}</span><span>${svg('clock')}Lun – Sam : 8 h – 18 h</span></div></div>
`;
}
function header(current) {
  const links = navItems.map(([h, l]) => `<li><a href="${h}"${h === current ? ' aria-current="page"' : ''}>${l}</a></li>`).join('');
  return `<header class="site-header"><div class="header-in">
<a class="brand" href="index.html" aria-label="${SITE}, accueil">${logo}<span><b>Bâti Horizon</b><small>Construction &amp; rénovation</small></span></a>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Ouvrir le menu">${svg('menu')}</button>
<nav class="nav" id="nav" aria-label="Navigation principale"><ul>${links}</ul><a class="btn sm" href="devis.html">Demander un devis ${arr}</a></nav>
</div></header>
<main id="contenu">
`;
}
function footer() {
  return `</main>
<footer class="site-footer"><div class="foot">
<div><a class="brand" href="index.html">${logo}<span><b>Bâti Horizon</b><small>Construction &amp; rénovation</small></span></a><p>Entreprise de construction et de rénovation à Abidjan : villas, immeubles, rénovation et aménagement.</p></div>
<div><h2>Navigation</h2><a href="index.html">Accueil</a><a href="entreprise.html">L’entreprise</a><a href="services.html">Services</a><a href="realisations.html">Réalisations</a><a href="devis.html">Demande de devis</a></div>
<div><h2>Services</h2>${services.map(s => `<a href="services.html">${s[1]}</a>`).join('')}</div>
<div><h2>Contact</h2><a href="tel:+22527215500000">${PHONE}</a><a href="${WA}" rel="noopener">WhatsApp</a><a href="mailto:${EMAIL}">${EMAIL}</a><a href="entreprise.html#contact">Nous écrire</a></div>
</div>
<div class="legal"><span>© 2026 ${SITE}. Site de démonstration : entreprise, projets et chiffres fictifs. <a href="confidentialite.html" style="display:inline">Confidentialité et crédits photos</a></span><span class="signature">Site créé par <a href="${CODE_AZ_URL}" rel="noopener">Code AZ</a> · agence web</span></div>
</footer>
<a class="wa" href="${WA}" rel="noopener" aria-label="Écrire à l’entreprise sur WhatsApp">${waIcon}<span>WhatsApp</span></a>
<script src="js/data.js"></script>
<script src="js/main.js" defer></script>
</body>
</html>
`;
}
const btn = (href, label, cls = '') => `<a class="btn ${cls}" href="${href}">${label} ${arr}</a>`;
const pcard = p => `<a class="proj" href="projet-${p.id}.html" data-type="${p.type}" data-commune="${p.commune}"><img src="img/p-${p.ap}.webp" width="1000" height="750" alt="${photos[p.ap].alt}" loading="lazy"><div class="b"><span class="m">${types[p.type]} · ${p.commune}</span><h3>${p.name}</h3><p>${fmt(p.m2)} m² · ${p.mois} mois · ${p.year}</p></div></a>`;
const pages = {};

// ================= ACCUEIL
const schema = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'GeneralContractor', name: SITE, description: 'Entreprise de construction et de rénovation à Abidjan : villas, immeubles, rénovation, aménagement.',
  telephone: PHONE, email: EMAIL, address: { '@type': 'PostalAddress', streetAddress: 'Riviera Palmeraie', addressLocality: 'Abidjan', addressRegion: 'Cocody', addressCountry: 'CI' },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' }],
})}</script>
`;
pages['index.html'] = head({ title: 'Bâti Horizon · Entreprise de construction et rénovation à Abidjan', desc: 'Villas, immeubles, rénovation et aménagement à Abidjan. Réalisations, estimation de budget et demande de devis en ligne.', schema, page: 'index', preload: '<link rel="preload" href="img/hero.webp" as="image" type="image/webp">\n' })
+ header('index.html') + `
<section class="hero" style="padding:0">
<img src="img/hero.webp" width="1700" height="956" alt="Ouvriers en gilets orange coulant une dalle de béton sur un chantier" fetchpriority="high">
<div class="wrap">
<div><span class="tag">Constructeur à Abidjan</span><h1>Construire durable, <em>livrer à temps.</em></h1>
<p class="lead">Villas, immeubles, rénovation et aménagement : une équipe qui s’engage sur un planning, un budget et une qualité, du premier plan à la remise des clés.</p>
<div class="hero-actions">${btn('devis.html', 'Demander un devis')}<a class="play" href="realisations.html"><span>${svg('play')}</span>Voir nos chantiers</a></div></div>
<div class="points"><div>${svg('shield')}<span>Travail soigné<small>Contrôle à chaque étape</small></span></div><div>${svg('clock')}<span>Délais tenus<small>Planning partagé</small></span></div><div>${svg('team')}<span>Équipe expérimentée<small>Chefs de chantier dédiés</small></span></div></div>
</div></section>

<section><div class="wrap"><div class="svc">
${services.map(s => `<a href="services.html"><span class="ic">${svg(s[0])}</span><h3>${s[1]}</h3><p>${s[2]}</p><span class="round">${arr}</span></a>`).join('\n')}
</div></div></section>

<section class="alt"><div class="wrap about">
<div class="picbox"><img src="img/about.webp" width="1000" height="750" alt="${photos.casque.alt}" loading="lazy"><div class="badge"><b>15+</b><span>ans d’expérience dans la construction</span></div></div>
<div><span class="tag">L’entreprise</span><h2>Nous construisons avec méthode, pour durer.</h2>
<p style="color:var(--muted)">Bâti Horizon accompagne particuliers, promoteurs et entreprises à Abidjan. Nous chiffrons clairement, planifions honnêtement et suivons le chantier de près, pour livrer ce qui a été promis.</p>
<div class="feats">
<div><span class="fi">${svg('team')}</span><span><b>Équipe qualifiée</b>Des compétences pour chaque lot</span></div>
<div><span class="fi">${svg('coin')}</span><span><b>Devis détaillé</b>Pas de surprise sans votre accord</span></div>
<div><span class="fi">${svg('hammer')}</span><span><b>Méthodes éprouvées</b>Matériaux contrôlés, chantier propre</span></div>
<div><span class="fi">${svg('doc')}</span><span><b>Suivi transparent</b>Comptes rendus réguliers</span></div>
</div>${btn('entreprise.html', 'En savoir plus')}</div>
</div></section>

<section><div class="wrap"><div class="story">
<div class="l"><span class="tag">Notre histoire</span><h2>Une entreprise locale qui a grandi chantier après chantier.</h2><p style="color:var(--muted)">Partie d’une petite équipe de maçons, Bâti Horizon est devenue une entreprise de construction complète, avec bureau d’études, chefs de chantier et équipes spécialisées.</p><a href="entreprise.html">En savoir plus sur l’entreprise →</a></div>
<div class="r"><div class="top"><div><h3>Nous avons commencé en 2010</h3><p style="font-size:.88rem;color:var(--muted);margin:0">Une petite équipe, une grande envie de bien construire. Aujourd’hui, des dizaines de chantiers livrés.</p></div><img src="img/echaf.webp" width="1100" height="733" alt="${photos.echafaudage.alt}" loading="lazy" style="border-radius:12px;min-height:150px"></div>
<div class="numbers"><div><b>120+</b><span>projets livrés</span></div><div><b>15+</b><span>ans d’expérience</span></div><div><b>85 000</b><span>m² construits</span></div></div></div>
</div></div></section>

<section class="alt"><div class="wrap">
<div class="head"><div><span class="tag">Réalisations</span><h2>Nos réalisations récentes</h2></div>${btn('realisations.html', 'Toutes les réalisations', 'line')}</div>
<div class="pgrid">${projects.slice(0, 3).map(pcard).join('\n')}</div>
</div></section>

<section class="dark"><div class="wrap">
<div class="head"><div><span class="tag">Notre méthode</span><h2>Cinq étapes, du plan à la livraison.</h2></div></div>
<ol class="steps">
<li><h3>Étude</h3><p>Visite du terrain, échange sur vos besoins et votre budget.</p></li>
<li><h3>Plans</h3><p>Conception, plans et validation avec vous avant tout démarrage.</p></li>
<li><h3>Devis</h3><p>Chiffrage détaillé par lot, délais et conditions clairs.</p></li>
<li><h3>Chantier</h3><p>Équipes dédiées, suivi hebdomadaire, comptes rendus photo.</p></li>
<li><h3>Livraison</h3><p>Contrôle final, levée des réserves, remise des clés.</p></li>
</ol></div></section>

<section><div class="wrap">
<div class="head"><div><span class="tag">Nos engagements</span><h2>Ce que vous pouvez attendre de nous.</h2></div></div>
<div class="eng">
<div><span class="ic">${svg('clock')}</span><h3>Des délais tenus</h3><p>Un planning partagé dès la signature, un point d’avancement chaque semaine et une alerte immédiate en cas d’écart.</p></div>
<div><span class="ic">${svg('coin')}</span><h3>Un budget maîtrisé</h3><p>Un devis détaillé par lot. Toute modification est chiffrée et validée par vous avant d’être exécutée.</p></div>
<div><span class="ic">${svg('shield')}</span><h3>Les garanties légales</h3><p>Nos ouvrages sont couverts par les garanties légales de la construction. Le détail figure dans chaque contrat.</p></div>
</div></div></section>

<section class="alt"><div class="wrap"><div class="quote"><span class="q" aria-hidden="true">“</span><div><p>« Un chantier bien organisé : le planning a été respecté, les coûts n’ont pas bougé sans notre accord, et le chef de chantier répondait toujours. Notre villa est livrée, et nous y sommes bien. »</p><footer>Jean-Baptiste K.<span>Propriétaire à Cocody (témoignage fictif)</span></footer></div></div></div></section>

<section class="cta"><img src="img/cta.webp" width="1800" height="900" alt="${photos.aerien.alt}" loading="lazy"><div class="wrap"><h2>Parlons de votre projet.</h2><p>Une villa, un immeuble, une rénovation ? Obtenez une première estimation en ligne, puis un devis détaillé après visite du terrain.</p><div class="row">${btn('devis.html', 'Demander un devis')}${btn('devis.html#estimateur', 'Estimer mon budget', 'white')}</div></div></section>
` + footer();

// ================= SERVICES
pages['services.html'] = head({ title: 'Nos services · Construction, rénovation, gros œuvre · Bâti Horizon', desc: 'Construction neuve, rénovation, gros œuvre, aménagement, études et plans : les services de Bâti Horizon à Abidjan.', page: 'services' })
+ header('services.html') + `
<div class="page-title"><div class="wrap"><span class="tag">Nos services</span><h1>Un partenaire pour tout votre chantier.</h1><p>De l’étude au dernier coup de pinceau, nous intervenons sur toutes les étapes, ensemble ou lot par lot.</p></div></div>
<section><div class="wrap"><div class="svc-detail">
${services.map(s => `<article><span class="ic">${svg(s[0])}</span><h2 style="font-size:1.7rem">${s[1]}</h2><p style="color:var(--muted)">${s[2]}</p><ul>${s[3].map(x => `<li>${x}</li>`).join('')}</ul></article>`).join('\n')}
<article style="background:var(--beton);color:#E6E9EB;border:0"><h2 style="color:#fff;font-size:1.7rem">Un projet en tête ?</h2><p>Estimez votre budget en deux minutes, puis demandez un devis détaillé.</p>${btn('devis.html', 'Demander un devis')}</article>
</div></div></section>
` + footer();

// ================= RÉALISATIONS
const communes = [...new Set(projects.map(p => p.commune))].sort();
pages['realisations.html'] = head({ title: 'Réalisations · Villas, immeubles, rénovations · Bâti Horizon', desc: 'Huit réalisations de Bâti Horizon à Abidjan : villas, immeubles, rénovations et bâtiments commerciaux. Filtrez par type et par commune.', page: 'realisations' })
+ header('realisations.html') + `
<div class="page-title"><div class="wrap"><span class="tag">Réalisations</span><h1>Nos chantiers, vus de près.</h1><p>Huit projets livrés à Abidjan et alentours. Ouvrez une fiche pour voir les étapes, le plan et le comparateur avant / après.</p></div></div>
<section><div class="wrap">
<div class="filters"><div><label id="l-type">Type de projet</label><div class="chips" role="group" aria-labelledby="l-type"><button type="button" data-type="all" aria-pressed="true">Tous</button>${Object.entries(types).map(([k, v]) => `<button type="button" data-type="${k}" aria-pressed="false">${v}</button>`).join('')}</div></div>
<div><label for="f-commune">Commune</label><select id="f-commune"><option value="all">Toutes les communes</option>${communes.map(c => `<option>${c}</option>`).join('')}</select></div></div>
<p class="count" id="count" role="status" aria-live="polite">${projects.length} projets</p>
<div class="pgrid" id="grid">${projects.map(pcard).join('\n')}</div>
<p id="empty" style="display:none">Aucun projet ne correspond à ces filtres. <button type="button" class="btn sm line" id="reset">Réinitialiser</button></p>
<p class="note" style="margin-top:22px">Projets fictifs. Photos illustratives de chantiers et bâtiments d’Afrique de l’Ouest, sans lien avec les projets décrits.</p>
</div></section>
` + footer();

// ================= FICHES PROJET
const phaseNames = ['Études et plans', 'Gros œuvre', 'Second œuvre', 'Finitions et livraison'];
const phaseColors = ['#8E969C', '#2E3237', '#E8631A', '#F2A56E'];
function planSvg(p) {
  const apt = p.type === 'immeuble' || p.type === 'renovation' || p.type === 'commercial';
  const rooms = p.type === 'commercial'
    ? [['Accueil', 20, 20, 150, 90], ['Open space', 170, 20, 210, 90], ['Bureau', 20, 110, 110, 90], ['Réunion', 130, 110, 110, 90], ['Sanitaires', 240, 110, 70, 90], ['Archives', 310, 110, 70, 90]]
    : [['Séjour', 20, 20, 170, 100], ['Cuisine', 190, 20, 100, 100], ['Entrée', 290, 20, 90, 100], ['Chambre 1', 20, 120, 120, 90], ['Chambre 2', 140, 120, 120, 90], ['Salle d’eau', 260, 120, 120, 90]];
  return `<svg viewBox="0 0 400 230" role="img" aria-label="Plan schématique d’un niveau type : ${rooms.map(r => r[0]).join(', ')}"><rect x="20" y="20" width="360" height="190" fill="#fff" stroke="#2E3237" stroke-width="3"/>${rooms.map(r => `<rect x="${r[1]}" y="${r[2]}" width="${r[3]}" height="${r[4]}" fill="none" stroke="#2E3237" stroke-width="1.5"/><text x="${r[1] + r[3] / 2}" y="${r[2] + r[4] / 2 + 3}" text-anchor="middle">${r[0]}</text>`).join('')}<path d="M190 20v0" /><text x="200" y="224" text-anchor="middle">Plan indicatif, non contractuel${apt ? ' (niveau courant)' : ''}</text></svg>`;
}
for (const p of projects) {
  const tot = p.ph.reduce((a, b) => a + b, 0);
  const others = projects.filter(x => x.id !== p.id && (x.type === p.type || true)).slice(0, 3);
  pages[`projet-${p.id}.html`] = head({ title: `${p.name} · ${types[p.type]} à ${p.commune} · Bâti Horizon`, desc: `${p.name} : ${types[p.type].toLowerCase()} de ${fmt(p.m2)} m² à ${p.commune}, livré en ${p.mois} mois. Avant, pendant et après.`, page: 'projet' })
  + header('realisations.html') + `
<div class="page-title"><div class="wrap"><span class="tag">${types[p.type]} · ${p.commune}</span><h1>${p.name}</h1><p>${p.d}</p></div></div>
<div class="wrap"><nav class="crumbs" aria-label="Fil d’Ariane"><a href="index.html">Accueil</a> › <a href="realisations.html">Réalisations</a> › ${p.name}</nav></div>
<section style="padding-top:26px"><div class="wrap">
<div class="specs"><div><b>${fmt(p.m2)} m²</b><span>Surface</span></div><div><b>${p.mois} mois</b><span>Durée du chantier</span></div><div><b>${p.commune}</b><span>Commune</span></div><div><b>${p.year}</b><span>Livraison</span></div></div>
<div class="ba" id="ba"><img class="bot" src="img/p-${p.ap}.webp" width="1000" height="750" alt="${photos[p.ap].alt}"><img class="top" src="img/p-${p.av}.webp" width="1000" height="750" alt="${photos[p.av].alt}"><span class="l">Avant</span><span class="r">Après</span><span class="handle"></span><label class="vh" for="ba-r">Faire glisser pour comparer l’avant et l’après</label><input id="ba-r" type="range" min="0" max="100" value="50"></div>
<p class="note">Comparateur de démonstration : photos illustratives de chantiers différents.</p>
<div class="phase3"><figure><img src="img/p-${p.av}.webp" width="1000" height="750" alt="${photos[p.av].alt}" loading="lazy"><figcaption><b>Avant</b>État initial du site</figcaption></figure><figure><img src="img/p-${p.pe}.webp" width="1000" height="750" alt="${photos[p.pe].alt}" loading="lazy"><figcaption><b>Pendant</b>Chantier en cours</figcaption></figure><figure><img src="img/p-${p.ap}.webp" width="1000" height="750" alt="${photos[p.ap].alt}" loading="lazy"><figcaption><b>Après</b>Ouvrage livré</figcaption></figure></div>
</div></section>
<section class="alt"><div class="wrap twocol">
<div><span class="tag">Déroulé du chantier</span><h2>${p.mois} mois, quatre phases.</h2>
<div class="timeline" role="img" aria-label="Répartition des phases sur ${p.mois} mois">${p.ph.map((m, i) => `<span style="width:${m / tot * 100}%;background:${phaseColors[i]}"></span>`).join('')}</div>
<div class="tl-legend">${p.ph.map((m, i) => `<span><i style="background:${phaseColors[i]}"></i>${phaseNames[i]} : ${m} mois</span>`).join('')}</div>
<p style="margin-top:22px;color:var(--muted)">${p.d} Chaque phase est validée avec le client avant de passer à la suivante, avec un compte rendu photo hebdomadaire.</p>
${btn('devis.html?t=' + p.type, 'Demander un devis pour un projet similaire')}</div>
<div class="planbox">${planSvg(p)}</div>
</div></section>
<section><div class="wrap"><div class="head"><div><span class="tag">À découvrir aussi</span><h2>Autres réalisations</h2></div></div><div class="pgrid">${others.map(pcard).join('\n')}</div></div></section>
` + footer();
}

// ================= DEVIS
pages['devis.html'] = head({ title: 'Demande de devis et estimation de budget · Bâti Horizon', desc: 'Estimez le budget de votre projet de construction ou de rénovation à Abidjan (fourchette indicative en FCFA), puis demandez un devis détaillé en trois étapes.', page: 'devis' })
+ header('devis.html') + `
<div class="page-title"><div class="wrap"><span class="tag">Devis</span><h1>Estimez, puis demandez votre devis.</h1><p>L’estimateur donne une fourchette indicative en quelques secondes. Le devis détaillé, lui, est établi après visite du terrain.</p></div></div>
<section><div class="wrap quoteg">
<div class="card" id="estimateur"><h2>Estimateur de budget</h2>
<div class="field"><label class="f" for="e-type">Type de projet</label><select id="e-type" style="width:100%">${Object.entries(types).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
<div class="row2"><div class="field"><label class="f" for="e-m2">Surface (m²)</label><input id="e-m2" type="number" min="20" max="20000" step="10" value="200"></div>
<div class="field"><label class="f" for="e-fin">Niveau de finition</label><select id="e-fin" style="width:100%"><option value="std">Standard</option><option value="conf">Confort</option><option value="prem">Premium</option></select></div></div>
<div class="range" aria-live="polite"><span class="k">Fourchette indicative</span><p class="big" id="e-out">—</p><div class="ln"><span>Prix au m²</span><span id="e-pm">—</span></div><div class="ln"><span>Durée estimée</span><span id="e-dur">—</span></div><p><strong>Estimation non contractuelle.</strong> Elle ne remplace pas un devis : le coût réel dépend du terrain, des études et des choix de matériaux.</p></div>
<p style="margin:18px 0 0"><button type="button" class="btn sm line" id="e-use">Utiliser pour ma demande de devis</button></p></div>
<form class="card" id="quote" novalidate aria-label="Demande de devis"><h2>Demande de devis</h2>
<ol class="progress" aria-label="Progression"><li data-n="1" class="on">Projet</li><li data-n="2">Budget et délai</li><li data-n="3">Coordonnées</li></ol>
<div class="step on" id="s1"><h3 tabindex="-1" style="margin-bottom:14px">Votre projet</h3>
<div class="field"><label class="f" for="q-type">Type de projet</label><select id="q-type" style="width:100%">${Object.entries(types).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
<fieldset style="border:0;padding:0;margin:0 0 18px"><legend>Avez-vous un terrain ?</legend><label style="margin-right:18px"><input type="radio" name="terrain" value="oui" checked> Oui</label><label style="margin-right:18px"><input type="radio" name="terrain" value="non"> Non</label><label><input type="radio" name="terrain" value="cours"> En cours d’acquisition</label></fieldset>
<div class="row2"><div class="field"><label class="f" for="q-m2">Surface estimée (m²)</label><input id="q-m2" type="number" min="20" step="10" value="200" required><p class="err" data-err-for="q-m2">Indiquez une surface.</p></div>
<div class="field"><label class="f" for="q-fin">Finition</label><select id="q-fin" style="width:100%"><option value="std">Standard</option><option value="conf">Confort</option><option value="prem">Premium</option></select></div></div>
<div class="nav-btns"><span></span><button type="button" class="btn" data-next>Continuer ${arr}</button></div></div>
<div class="step" id="s2"><h3 tabindex="-1" style="margin-bottom:14px">Budget et délai</h3>
<div class="field"><label class="f" for="q-bud">Budget envisagé</label><select id="q-bud" style="width:100%"><option>Moins de 50 millions FCFA</option><option>50 à 100 millions FCFA</option><option>100 à 200 millions FCFA</option><option>200 à 500 millions FCFA</option><option>Plus de 500 millions FCFA</option><option selected>Je ne sais pas encore</option></select></div>
<div class="field"><label class="f" for="q-del">Délai souhaité</label><select id="q-del" style="width:100%"><option>Dès que possible</option><option selected>Dans les 3 à 6 mois</option><option>Dans les 6 à 12 mois</option><option>Dans plus d’un an</option></select></div>
<div class="nav-btns"><button type="button" class="btn line" data-prev>Retour</button><button type="button" class="btn" data-next>Continuer ${arr}</button></div></div>
<div class="step" id="s3"><h3 tabindex="-1" style="margin-bottom:14px">Vos coordonnées</h3>
<div class="row2"><div class="field"><label class="f" for="q-nom">Nom et prénom</label><input id="q-nom" type="text" autocomplete="name" required><p class="err" data-err-for="q-nom">Indiquez votre nom.</p></div>
<div class="field"><label class="f" for="q-tel">Téléphone</label><input id="q-tel" type="tel" autocomplete="tel" placeholder="+225 07 00 00 00 00" required><p class="err" data-err-for="q-tel">Indiquez un numéro valide.</p></div></div>
<div class="row2"><div class="field"><label class="f" for="q-com">Commune du projet</label><input id="q-com" type="text" required><p class="err" data-err-for="q-com">Indiquez la commune.</p></div><div class="field"><label class="f" for="q-mail">E-mail (facultatif)</label><input id="q-mail" type="email" autocomplete="email"></div></div>
<div class="field"><label class="f" for="q-msg">Décrivez votre projet (facultatif)</label><textarea id="q-msg" rows="3"></textarea></div>
<div class="check"><input id="q-ok" type="checkbox" required><label for="q-ok">J’accepte que Bâti Horizon utilise ces informations pour préparer mon devis, selon la <a href="confidentialite.html">politique de confidentialité</a>.</label></div><p class="err" data-err-for="q-ok">Le consentement est nécessaire.</p>
<div class="nav-btns"><button type="button" class="btn line" data-prev>Retour</button><button type="submit" class="btn">Envoyer ma demande</button></div></div>
<div class="ok" id="done" role="status"><p class="tag" style="justify-content:center">Demande reçue</p><p class="ref" id="d-ref"></p><p>Merci <strong id="d-name"></strong>. Un conducteur de travaux vous rappelle sous 48 heures pour convenir d’une visite du terrain.</p><p class="note">Démonstration : aucune donnée n’a été envoyée.</p></div>
</form>
</div></section>
` + footer();

// ================= ENTREPRISE + CONTACT
pages['entreprise.html'] = head({ title: 'L’entreprise et contact · Bâti Horizon · Abidjan', desc: 'Histoire, méthode et équipe de Bâti Horizon, entreprise de construction à Abidjan. Coordonnées et formulaire de contact.', page: 'entreprise' })
+ header('entreprise.html') + `
<div class="page-title"><div class="wrap"><span class="tag">L’entreprise</span><h1>Bâtir avec méthode depuis 2010.</h1><p>Une entreprise locale, des équipes stables et une règle simple : dire ce que l’on fait, faire ce que l’on dit.</p></div></div>
<section><div class="wrap about">
<div class="picbox"><img src="img/echaf.webp" width="1100" height="733" alt="${photos.echafaudage.alt}" loading="lazy" style="aspect-ratio:4/3.3;object-fit:cover"></div>
<div><span class="tag">Notre histoire</span><h2>De petite équipe à entreprise complète.</h2><p style="color:var(--muted)">Bâti Horizon est née d’un petit groupe de maçons et d’un chef de chantier. Au fil des projets, l’entreprise s’est dotée d’un bureau d’études, d’équipes spécialisées et d’une organisation de chantier rigoureuse.</p><p style="color:var(--muted)">Nous travaillons avec des fournisseurs locaux, formons nos ouvriers à la sécurité et gardons la même équipe d’encadrement d’un chantier à l’autre.</p></div>
</div></section>
<section class="alt"><div class="wrap"><div class="eng">
<div><span class="ic">${svg('hat')}</span><h3>Sécurité sur les chantiers</h3><p>Port des équipements de protection obligatoire et accueil sécurité pour chaque nouvel ouvrier.</p></div>
<div><span class="ic">${svg('hammer')}</span><h3>Savoir-faire</h3><p>Des équipes spécialisées par lot : maçonnerie, béton armé, étanchéité, finitions.</p></div>
<div><span class="ic">${svg('doc')}</span><h3>Contrats clairs</h3><p>Devis détaillé, planning signé, avenants écrits : tout est sur papier avant d’être exécuté.</p></div>
</div></div></section>
<section id="contact"><div class="wrap contact-grid">
<div class="card info"><h2>Nous contacter</h2><dl style="margin:0"><dt>Adresse</dt><dd>Riviera Palmeraie, Cocody<br>Abidjan</dd><dt>Téléphone</dt><dd><a href="tel:+22527215500000">${PHONE}</a></dd><dt>WhatsApp</dt><dd><a href="${WA}" rel="noopener">Écrire sur WhatsApp</a></dd><dt>E-mail</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd><dt>Horaires</dt><dd>Lundi au samedi : 8 h – 18 h</dd></dl><p style="margin:22px 0 0">${btn('devis.html', 'Demander un devis')}</p></div>
<form class="card" id="cform" novalidate aria-label="Nous écrire"><h2>Nous écrire</h2>
<div class="field"><label class="f" for="c-nom">Nom</label><input id="c-nom" type="text" autocomplete="name" required><p class="err" data-err-for="c-nom">Indiquez votre nom.</p></div>
<div class="field"><label class="f" for="c-msg">Message</label><textarea id="c-msg" rows="4" required></textarea><p class="err" data-err-for="c-msg">Écrivez votre message.</p></div>
<div class="check"><input id="c-ok" type="checkbox" required><label for="c-ok">J’accepte que Bâti Horizon utilise ces informations pour me répondre, selon la <a href="confidentialite.html">politique de confidentialité</a>.</label></div><p class="err" data-err-for="c-ok">Le consentement est nécessaire.</p>
<button class="btn" type="submit">Envoyer ${arr}</button><p class="note" id="c-msg-ok" role="status" hidden style="margin-top:14px">Merci, nous vous répondons rapidement. (Démonstration : rien n’est envoyé.)</p></form>
</div></section>
` + footer();

// ================= CONFIDENTIALITÉ
const credits = [...Object.values(used).map(([t, ph]) => [t, ph]), ...Object.keys(photos).map(k => [photos[k].alt.split(',')[0], photos[k]])];
const seen = new Set(); const credList = credits.filter(([t, ph]) => { const key = ph.page; if (seen.has(key)) return false; seen.add(key); return true; });
pages['confidentialite.html'] = head({ title: 'Confidentialité et crédits photos · Bâti Horizon', desc: 'Comment Bâti Horizon utilise les informations des demandes de devis, et crédits des photographies.', page: 'page' })
+ header('') + `
<div class="page-title"><div class="wrap"><span class="tag">Confidentialité</span><h1>Vos données, peu et bien gardées.</h1></div></div>
<section><div class="wrap prose">
<p><strong>Site de démonstration :</strong> les formulaires n’envoient rien. Les saisies restent dans votre navigateur le temps de la visite.</p>
<h2>Données demandées</h2><p>Pour un devis : type de projet, surface, budget et délai souhaités, puis nom, téléphone, commune du projet, e-mail facultatif et description. Rien d’autre.</p>
<h2>Utilisation</h2><p>Uniquement pour préparer votre devis et vous rappeler. Aucune transmission à des tiers.</p>
<h2>Estimation de budget</h2><p>La fourchette affichée est indicative et non contractuelle. Elle ne constitue ni un devis ni un engagement de prix.</p>
<h2 id="credits">Crédits photos</h2><p>Photos issues de Wikimedia Commons, à titre d’illustration : elles ne montrent pas les projets décrits sur ce site fictif. Les licences CC BY et CC BY-SA exigent de citer l’auteur.</p>
<ul class="credits">${credList.map(([t, ph]) => `<li>${t} : ${ph.by}, <a href="${ph.page}" rel="noopener">${ph.lic}</a></li>`).join('')}</ul>
</div></section>
` + footer();

for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(out, f), html);
fs.writeFileSync(path.join(out, 'js', 'data.js'), 'window.BTP=' + JSON.stringify({ types }) + ';\n');
fs.writeFileSync(path.join(out, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#2E3237"/><path d="M10 32L32 12l22 20" fill="none" stroke="#E8631A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 30v22h32V30" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>');
fs.writeFileSync(path.join(out, 'vercel.json'), JSON.stringify({ cleanUrls: true }, null, 2) + '\n');
fs.writeFileSync(path.join(out, '.vercelignore'), ['_build', '_raw', '.claude', 'GUIDE-PUBLICATION.md', 'model.jpg'].join('\n') + '\n');
console.log('OK', Object.keys(pages).length, 'pages');
