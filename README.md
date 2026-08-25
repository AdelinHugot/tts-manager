# TTS Manager — Creator Revenue Studio

Application React de pilotage des revenus d'affiliation TikTok Shop : dashboard,
analytics, commandes, bibliothèque vidéos, rushs, mur d'idées et assistant IA.

Ce dépôt est le portage **fidèle** du prototype Claude Design
(`design/TTS Manager.dc.html`) vers un vrai projet React déployable sur
GitHub + Netlify.

---

## Démarrage

```bash
npm install
```

Deux modes de développement :

| Commande | Ce qui tourne | Assistant IA |
| --- | --- | --- |
| `npm run dev` | Vite seul (port 5173) | ✗ sauf si `netlify dev` tourne en parallèle sur 8888 |
| `npm run netlify:dev` | Vite + fonctions serverless (port 8888) | ✓ |

Pour travailler sur l'assistant en local :

```bash
cp .env.example .env   # puis renseigner ANTHROPIC_API_KEY
npx netlify dev
```

Autres scripts :

```bash
npm run build      # build de production dans dist/
npm test           # tests de la fonction serverless
npm run lint       # ESLint
npm run gen:view   # régénère src/view.jsx, src/logic.js, src/styles.css depuis design/
```

---

## Architecture

```
design/TTS Manager.dc.html   Prototype d'origine — source de vérité du design
tools/dc-to-jsx.mjs          Transpileur : template Claude Design -> JSX React

src/
  main.jsx                   Point de montage React
  App.jsx                    Enveloppe : injecte la configuration
  config/appConfig.js        Props de l'app (thème, mode assistant…)
  view.jsx        [GÉNÉRÉ]   Le template du design, en JSX
  logic.js        [GÉNÉRÉ]   L'état et les calculs du design, en composant React
  styles.css      [GÉNÉRÉ]   Styles globaux (issus du bloc <helmet>)
  lib/dc.js                  Classe de base DCLogic (un vrai React.Component)
  lib/style.js               Styles inline + pseudo-classes (`style-hover`)
  lib/claude.js              Client de l'assistant — appelle /api/claude

  components/Login.jsx       Écran de connexion (écrit à la main)
  lib/firebase.js            Initialisation — app + auth uniquement
  lib/auth.js                Connexion, session, uid
  lib/chemins.js             Construction des chemins `users/{uid}/…`
  lib/firestore.js           Fiches, cloisonnées par compte
  lib/storage.js             Fichiers, miniatures, suppression atomique

firestore.rules              Règles Firestore — cloisonnement par compte
storage.rules                Règles Storage — idem
firebase.json / .firebaserc  Déploiement des règles et émulateurs

netlify/functions/claude.js  Proxy serveur vers l'API Anthropic (détient la clé)
tests/                       Tests : fonction serverless, chemins, règles
```

### Pourquoi un transpileur plutôt qu'une réécriture à la main

Le prototype utilise un mini-langage de template (`{{ chemin }}`, `<sc-for>`,
`<sc-if>`, `style-hover="…"`) interprété au runtime par `design/support.js`.
Le réécrire manuellement en JSX aurait introduit des écarts sur ~1 900 lignes de
markup. `tools/dc-to-jsx.mjs` reproduit à la compilation la sémantique exacte de
ce runtime :

| Design | JSX généré |
| --- | --- |
| `{{ a.b }}` | `V.a.b` (ou `x.b` à l'intérieur d'un `sc-for as="x"`) |
| `<sc-for list="{{ xs }}" as="x">` | `{(V.xs \|\| []).map((x, i) => …)}` |
| `<sc-if value="{{ c }}">` | `{V.c ? (…) : null}` |
| `style="a:b;c:{{ d }}"` | `style={css(...)}` — les styles constants sont hissés en module |
| `style-hover="…"` | `className={sp('hover', '…')}` — règle CSS injectée et mémoïsée |

`DCLogic` n'est plus une classe pilotée par un runtime tiers : c'est un
`React.Component` standard. `setState`, les refs et les méthodes de cycle de vie
sont ceux de React.

**Les trois fichiers marqués `[GÉNÉRÉ]` ne doivent pas être édités à la main.**
Modifier le design dans `design/TTS Manager.dc.html`, puis `npm run gen:view`.
La CI vérifie que les fichiers générés sont à jour.

### Fidélité vérifiée

Le portage a été comparé au prototype d'origine, page par page, dans le même
navigateur et le même viewport. Sur les huit pages, le texte rendu est
**identique au caractère près** (même longueur, même empreinte) et l'arbre DOM
est identique à deux nœuds près — l'enveloppe que le runtime d'origine ajoute
autour de la racine. Le sélecteur de période et son calendrier ont été comparés
ouverts, également à l'identique.

Seule variation : les horodatages relatifs du mur d'idées (`il y a 2 h`, `25/08 ·
04:48`), calculés à partir de `Date.now()` au montage.

---

## Sécurité des clés

**Aucune clé d'API n'existe dans le code client.** C'était le point sensible du
prototype : il appelait `window.claude.complete()`, une facilité de
l'environnement Claude Design qui n'existe pas sur un site public.

Le flux est maintenant :

```
navigateur  ──POST /api/claude──▶  fonction Netlify  ──x-api-key──▶  api.anthropic.com
(aucun secret)                     (ANTHROPIC_API_KEY)
```

`netlify/functions/claude.js` est le seul fichier qui lit `ANTHROPIC_API_KEY`.
La variable est définie dans Netlify (scope *Functions*), jamais dans le dépôt,
jamais dans le bundle.

Garde-fous implémentés et couverts par `npm test` :

- POST uniquement, et vérification de l'origine (`ALLOWED_ORIGINS` + URLs du déploiement) ;
- liste blanche de modèles (`claude-haiku-4-5`, `claude-sonnet-4-5`) — un modèle
  arbitraire envoyé par le client est ignoré ;
- plafonds : `max_tokens` ≤ 1500, corps ≤ 64 Ko, 12 messages, 8 000 caractères par message ;
- limitation de débit par IP (20 requêtes / minute) ;
- les erreurs amont sont journalisées côté serveur et renvoyées sans détail au client.

Autres mesures :

- `netlify.toml` applique une CSP stricte (`script-src 'self'`,
  `connect-src 'self'`, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`,
  `Referrer-Policy` et une `Permissions-Policy` qui ne laisse ouvert que le micro
  (utilisé par la dictée) ;
- `.gitignore` exclut `.env` ; `.env.example` documente les variables sans valeur ;
- la CI échoue si un motif de clé Anthropic apparaît dans les sources, et lance
  `npm audit --audit-level=high`.

> ⚠️ Rappel Vite : seules les variables préfixées `VITE_` sont exposées au
> navigateur — **et elles le sont en clair**. Ne jamais y placer de secret.
> `src/config/appConfig.js` n'utilise `VITE_*` que pour du réglage cosmétique.

---

## Déploiement

### 1. GitHub

```bash
git init
git add .
git commit -m "TTS Manager : portage React du prototype"
git branch -M main
git remote add origin git@github.com:<compte>/tts-manager.git
git push -u origin main
```

### 2. Netlify

1. *Add new site* → *Import an existing project* → sélectionner le dépôt.
2. Les réglages de build sont lus dans `netlify.toml` (`npm run build`, `dist/`,
   fonctions dans `netlify/functions`) — rien à saisir.
3. *Site settings › Environment variables* → ajouter :

   | Variable | Valeur | Scope |
   | --- | --- | --- |
   | `ANTHROPIC_API_KEY` | la clé | Functions |
   | `ALLOWED_ORIGINS` | `https://<domaine-perso>` | Functions *(seulement si domaine personnalisé)* |

4. *Deploy*.

L'endpoint `/api/claude` est routé par `export const config = { path }` dans la
fonction — aucune règle de redirection n'est nécessaire. L'application n'ayant
pas de routage client, aucun *rewrite* SPA n'est déclaré non plus.

---

## Données — Firestore et Storage

Tout vit sous `users/{uid}/…`, dans Firestore comme dans Storage. **Le
cloisonnement tient au chemin, pas à un filtre applicatif** : il n'y a pas de
`where('ownerId', …)` qu'un appelant pourrait oublier de poser, et une requête
hors de son espace est refusée par le serveur, pas silencieusement élargie.

L'uid n'est jamais un paramètre de fonction : `lib/storage.js` et
`lib/firestore.js` le lisent sur la session courante, pour qu'aucun appelant ne
puisse écrire ailleurs que chez lui, même par erreur.

Collections : `rushes`, `videos`, `ideas`, `products`, `marques`, `orders`.
Dossiers Storage : `rushes`, `videos`, `ideas`, `thumbnails`, `products`,
`avatar`.

### Suppression atomique

`supprimerAvecFichiers()` supprime les objets Storage **avant** la fiche
Firestore. L'ordre est délibéré : si un fichier résiste, la fiche subsiste,
l'élément reste visible et l'opération peut être relancée. L'ordre inverse
produirait un objet orphelin — facturé indéfiniment et invisible puisque plus
rien ne le référence. C'est ce qui garantit que le stock de rushs reste borné.

### Déployer les règles

```bash
firebase deploy --only firestore:rules,storage
```

Si le déploiement échoue sur un `403 Permission denied to get service
[firebasestorage.googleapis.com]`, c'est que le compte connecté au CLI n'a pas
le droit `serviceusage.services.get` sur le projet — souvent parce que
`firebase login` pointe un autre compte Google que le propriétaire. Vérifier
avec `firebase login:list` et `firebase projects:list`. À défaut, les deux
fichiers se collent directement dans la console Firebase, onglet *Rules* de
Firestore et de Storage.

### Migrer les commandes de la V1

Les commandes de la V1 vivent dans la collection racine `orders`, que les
nouvelles règles ferment. `tools/migrer-commandes.mjs` les rapatrie sous
`users/{uid}/orders` en conservant l'identifiant de commande TikTok Shop comme
identifiant de document — c'est lui qui rend les imports idempotents.

Il faut une clé de compte de service (console > Paramètres du projet > Comptes
de service > *Générer une nouvelle clé privée*) et l'uid du compte destinataire
(console > Authentication > colonne *User UID*).

```bash
node tools/migrer-commandes.mjs --uid=LE_UID --cle="/chemin/vers/cle.json"
```

Simulation par défaut ; ajouter `--appliquer` pour écrire. Supprimer la clé une
fois terminé — elle donne un accès total au projet. Le script relit la destination pour vérifier
le compte, et ne supprime jamais la source. Réalisations, rushs, idées, produits
et marques ne sont pas migrés — volontairement.

### Tester les règles

Les tests de cloisonnement vérifient qu'un compte ne peut ni lire ni écrire chez
un autre. Ils ont besoin de l'émulateur Firebase, donc d'un runtime Java :

```bash
npm run test:rules
```

Si Java manque : `brew install --cask temurin`. Ces tests tournent aussi en CI,
où Java est préinstallé. `npm test` ne les inclut pas, pour ne pas imposer Java
en développement.

---

## Stockage vidéo

Le lecteur des cartes Idées est fonctionnel (contrôles natifs, `preload="metadata"`
pour afficher la première image et la durée). Les fichiers importés sont
aujourd'hui des URL `blob:` créées par le navigateur : ils disparaissent au
rechargement. Le branchement d'un stockage distant (Firebase Storage ou autre)
reste à faire — voir le comparatif de coûts fourni séparément.

---

## Écarts connus, hérités du prototype

Ces points sont conservés tels quels par fidélité — à corriger si souhaité :

- **Prospection inachevée dans le design.** La logique est là (liste de
  prospects, statuts, fils d'emails) et les modales `prospectFormOpen` /
  `threadOpen` sont bien rendues, mais aucune page ne les ouvre : `PAGES` déclare
  `partenaires`, `prospection` et `produits`, et `renderVals()` calcule
  `isPartenaires` / `isProspection`, sans qu'aucun bloc du template ne les
  utilise. Il manque l'écran correspondant dans `design/TTS Manager.dc.html`,
  ainsi que les entrées de navigation dans `navGroups`.
- **Données de démonstration.** Marques, produits, commandes et vidéos sont des
  jeux de données statiques définis dans `src/logic.js` ; il n'y a pas encore de
  backend TikTok Shop.
- **Persistance de l'interface.** La couche de données existe et est cloisonnée,
  mais les écrans issus du design ne l'appellent pas encore : leur état vit
  toujours en mémoire, et un rechargement remet l'application à zéro. Le
  branchement écran par écran reste à faire.
- **Dictée vocale.** Repose sur l'API `SpeechRecognition`, disponible sur
  Chrome/Edge/Safari mais pas sur Firefox — le bouton se masque tout seul.
