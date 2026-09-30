# Guide de publication : Bâti Horizon (entreprise de BTP)

Document interne, non mis en ligne (voir `.vercelignore`). À suivre dans l'ordre.

## 1. Publier sur Vercel
**En ligne de commande**
1. Ouvrir un terminal dans ce dossier.
2. Installer l'outil une seule fois : `npm i -g vercel` puis `vercel login`
3. Publier : `vercel --prod`
4. Framework : **Other**. Dossier de sortie : `.`

**Sans ligne de commande** : vercel.com > *Add New* > *Project*, importer le dossier, framework **Other**, pas de commande de build.

## 2. Vérifier le site en ligne
- [ ] Les 14 pages s'ouvrent : accueil, services, réalisations, 8 fiches projet, devis, entreprise, confidentialité.
- [ ] Navigation privée : accessible **sans connexion** (sinon *Settings* > *Deployment Protection*, désactiver).
- [ ] **Réalisations** : les filtres par type (villa, immeuble, rénovation, commercial) et par commune fonctionnent, le compteur se met à jour, « Réinitialiser » remet les 8 projets.
- [ ] **Fiche projet** : le curseur avant / après glisse (souris, doigt, flèches du clavier), les 3 photos avant / pendant / après, la frise des phases, le plan schématique.
- [ ] **Estimateur de budget** (page Devis) : type, surface et finition donnent une fourchette en millions de FCFA, un prix au m² et une durée. Exemple : villa 200 m² standard = 50 à 60 M FCFA. La mention « estimation non contractuelle » est visible.
- [ ] Bouton « Utiliser pour ma demande de devis » : reporte l'estimation dans le formulaire. Le lien `devis?t=immeuble` (depuis une fiche projet) préremplit le type.
- [ ] **Formulaire de devis en 3 étapes** : projet, budget et délai, coordonnées avec consentement, puis confirmation avec une référence DV-2026-xxxx.
- [ ] Mobile (390 px) : le menu s'ouvre, rien ne dépasse. Console (F12) : aucune erreur.
- [ ] Signature « Code AZ » en bas de page renvoie vers https://agnissanisaac.com

## 3. Envoyer le lien pour le portfolio
- **Secteur** : `BTP & construction`
- **Tag** : `BTP · Construction`
- **categoryLabel** : Site pour entreprise de BTP
- **pitch** : Un site d'entreprise de construction à Abidjan : réalisations filtrables, estimateur de budget et demande de devis.
- **tech** : HTML5 / CSS3, JavaScript (filtres, estimateur, formulaire en étapes), Responsive design

## 4. Mentions à ne pas retirer
- **Crédits photos** (page Confidentialité, lien en pied de page) : la plupart sont en CC BY ou CC BY-SA et **exigent** de citer l'auteur. Liste complète : `_build/credits.md`.
- Les photos sont **illustratives** : chantiers et bâtiments d'Afrique de l'Ouest (Nigeria, Cameroun, Ghana, Côte d'Ivoire), sans lien avec les projets fictifs décrits. Plusieurs projets réutilisent les mêmes photos.
- Le comparateur avant / après montre des photos de chantiers **différents** : il est présenté comme une démonstration. Ne pas le présenter comme un vrai avant / après.
- L'estimateur est **indicatif et non contractuel** : ne jamais retirer cette mention.
- Aucune certification, assurance ou garantie décennale chiffrée n'est affichée : seulement « garanties légales ».
- « Entreprise, projets et chiffres fictifs » en pied de page : à garder tant que ce n'est pas un vrai client.
- Signature Code AZ : à garder.

## 5. Si une vraie entreprise veut ce site
1. **Projets et photos** : remplacer par de vrais chantiers (avant / pendant / après du **même** projet), avec accord du client. Modifier le tableau `projects` dans `_build/build.js`, mettre les images dans `img/` (WebP, 1 000 px, nom `p-xxx.webp`).
2. **Grille de l'estimateur** : tarifs au m² dans `js/main.js` (objet `RATES`) et durées (objet `DUR`). Faire valider les prix par le client : ils sont indicatifs et inventés pour la démonstration.
3. **Chiffres** : projets livrés, années d'expérience, m² construits : remplacer par les vrais chiffres, vérifiables.
4. **Garanties et assurances** : ne les mentionner que si elles existent (garantie décennale, assurance) et avec les bonnes références.
5. **Demandes de devis** : simulées. Brancher sur un vrai canal (e-mail, WhatsApp Business, outil de gestion) dans `js/main.js`.
6. **Coordonnées** : remplacer `PHONE`, `EMAIL`, `WA` et l'adresse dans `_build/build.js`.
7. Mentions légales (identité de l'entreprise, numéro d'enregistrement) : à ajouter.

## 6. Modifier le site soi-même
- Pages, projets, services, textes : `_build/build.js` (puis `node _build/build.js`).
- Filtres, estimateur, formulaire : `js/main.js`.
- Couleurs et styles : `css/style.css` (variables en haut du fichier).
- Images : dossier `img/`. Les originaux lourds sont dans `_raw/` (non publiés).
- Ouvrir en local : fonctionne avec Live Server (liens en `.html`).

## 7. Exclus de la mise en ligne
`_build`, `_raw`, `.claude`, ce guide et l'image modèle (`model.jpg`) sont listés dans `.vercelignore`.
