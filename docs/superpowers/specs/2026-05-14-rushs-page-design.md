# Page Rushs — Design Spec

## Contexte

La page Rushs est une bibliothèque centralisée de fichiers vidéo bruts (rushes) uploadés par l'utilisateur. Elle permet de gérer le cycle de vie complet d'un rush : upload → attachement à une Réalisation → suppression une fois la vidéo finale livrée.

---

## Modèle de données

### Nouveau type `Rush`

Remplace l'actuel `RushFile`. Défini dans `src/types/rush.ts` :

```ts
export type Rush = {
  id: string
  name: string
  url: string          // blob URL (URL.createObjectURL)
  size: number         // bytes
  duration: number     // secondes (extrait côté client)
  thumbnailUrl: string // base64 depuis Canvas API (première frame)
}
```

### Migration `Realisation`

`Realisation.rushes: RushFile[]` devient `Realisation.rushIds: string[]`.

Les réalisations ne stockent plus les données de fichier — elles référencent les rushes du pool global par ID.

### État global

Un nouveau state `rushes: Rush[]` est ajouté au niveau racine de l'app (App.tsx ou équivalent), passé en prop aux pages qui en ont besoin (`RushsPage`, `RealisationPage`/`RealisationPanel`).

### Mock data

`MOCK_RUSHES: Rush[]` est ajouté dans `src/data/mock.ts`. Les `MOCK_REALISATIONS` existants passent de `rushes: RushFile[]` à `rushIds: string[]`.

---

## Architecture des fichiers

### Créés

| Fichier | Responsabilité |
|---------|---------------|
| `src/types/rush.ts` | Type `Rush` |
| `src/components/rushs/RushsPage.tsx` | Page container — header, drop zone, switch de vue |
| `src/components/rushs/RushsListView.tsx` | Vue liste des rushes |
| `src/components/rushs/RushsCardsView.tsx` | Vue cards 4:5, 5–6 colonnes |
| `src/components/rushs/RushPanel.tsx` | Panel slide-in au clic sur un rush |
| `src/utils/videoMetadata.ts` | Extraction duration + thumbnail via HTMLVideoElement + Canvas |

### Modifiés

| Fichier | Changement |
|---------|-----------|
| `src/types/realisation.ts` | Supprime `RushFile`, `rushes` → `rushIds`, importe `Rush` depuis `rush.ts` |
| `src/data/mock.ts` | Ajoute `MOCK_RUSHES`, migre `rushIds` |
| `src/components/layout/Sidebar.tsx` | Ajoute nav item `rushs` entre réalisation et produits |
| `src/components/layout/AppLayout.tsx` | Enregistre `RushsPage` dans `PAGE_COMPONENTS` |
| `src/App.tsx` | Ajoute `rushes` + `setRushes` en state global |
| `src/components/realisation/FileUploadZone.tsx` | Produit des `Rush` (avec duration + thumbnail) au lieu de `RushFile` |
| `src/components/realisation/RealisationPanel.tsx` | Reçoit `rushes: Rush[]`, résout les IDs depuis `rushIds` |

---

## Extraction de métadonnées vidéo

Utilitaire `src/utils/videoMetadata.ts` :

```ts
export function extractVideoMetadata(file: File): Promise<{
  duration: number
  thumbnailUrl: string
}>
```

Algorithme :
1. Créer un `HTMLVideoElement` en mémoire
2. `video.src = URL.createObjectURL(file)`
3. Attendre `loadedmetadata` → lire `video.duration`
4. Scrubber à `currentTime = 0`, attendre `seeked`
5. Dessiner sur un `<canvas>` → `canvas.toDataURL('image/jpeg', 0.8)`
6. Revoke object URL, résoudre la Promise

---

## Composants UI

### RushsPage

- Zone de drop couvrant toute la page (pas juste un widget) — `dragover` + `drop` sur le container principal
- Header : titre "Rushs", compteur, `ViewSwitcher` (list / cards)
- Pendant l'extraction des métadonnées : skeleton card/row par fichier en cours de traitement
- State local : `view: 'list' | 'cards'`, `selectedRush: Rush | null`

### RushsListView

Colonnes : thumbnail miniature (40×40 arrondi), nom, durée (mm:ss), poids, badge "Lié" si le rush est référencé dans une réalisation, bouton suppression.

### RushsCardsView

- `grid grid-cols-5 xl:grid-cols-6 gap-3`
- Ratio 4:5 via `aspect-[4/5]`
- Thumbnail en `object-cover` pleine carte
- Overlay bas semi-transparent : nom (tronqué) + durée
- Hover : légère élévation + ring brand

### RushPanel (slide-in)

Structure identique aux autres panels du projet (Framer Motion `x: '100%'` → `x: 0`) :
- Header : thumbnail grand format, nom éditable, durée + poids
- Section "Réalisation liée" : si `rushIds` d'une réalisation contient cet ID → lien cliquable qui navigue vers la réalisation
- Bouton **"Créer une Réalisation"** : crée une `Realisation` vide pré-liée (`rushIds: [rush.id]`), navigue vers la page Réalisation et ouvre le panel sur cette nouvelle réalisation
- Footer : suppression avec confirmation contextuelle

---

## Flux drag-and-drop (Réalisation → Rushs)

Dans `RealisationPanel`, la section rushes accepte un `dragover` + `drop`. Le payload `dataTransfer` transporte le `rushId`. Au drop, l'ID est ajouté à `realisationIds` si absent.

Pour le drag depuis `RushsCardsView` / `RushsListView` : `draggable="true"` sur chaque item, `dragstart` écrit `dataTransfer.setData('rushId', rush.id)`.

---

## Suppression avec avertissement contextuel

Statuts "sûrs" (pas d'avertissement) : `a_publier`, `publiee`

Statuts "à risque" (avertissement requis) : `a_tourner`, `script`, `a_monter`

Logique :
1. Trouver si une réalisation a ce `rushId` dans ses `rushIds`
2. Si oui et statut à risque → modal de confirmation :
   > "Attention, la vidéo ne semble pas complètement prête. La suppression du rush est irréversible. Tu es sûr ?"
3. Confirmer → retirer le rush du pool global + retirer l'ID de tous les `rushIds` concernés

---

## Navigation

Item sidebar `rushs` inséré entre `realisation` et `produits` dans `NAV_ITEMS`. Icône : film ou pellicule (SVG inline cohérent avec le reste). Label : "Rushs".

---

## Ce qui est hors scope

- Lecteur vidéo intégré (pas de preview en lecture dans ce sprint)
- Upload multiple avec progression par fichier (traitement séquentiel ou parallèle, pas de barre de progression individuelle)
- Tri / recherche avancée sur la page Rushs
- Persistance (localStorage ou backend) — uniquement state mémoire comme le reste de l'app
