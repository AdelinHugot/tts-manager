# Page Planning — Design Spec

## Contexte

La page Planning offre une vue calendrier des réalisations TTS Manager, organisées par date de publication (`publishedAt`). Une colonne persistante à droite liste les réalisations sans date planifiée, que l'utilisateur peut glisser-déposer sur n'importe quel jour du calendrier pour leur assigner une date.

---

## Modèle de données

### Modification du type `Realisation`

Ajout d'un champ dans `src/types/realisation.ts` :

```ts
publishedAt: Date | null  // null = non planifiée
```

Les réalisations sans date apparaissent dans la colonne droite. Celles avec une date apparaissent dans la cellule du jour correspondant du calendrier.

### Données mock

`MOCK_REALISATIONS` dans `src/data/mock.ts` : ajout de `publishedAt` sur chaque entrée existante. Quelques entrées auront une date dans le mois courant pour que le calendrier soit visuellement peuplé au premier lancement ; les autres auront `publishedAt: null`.

---

## Architecture des fichiers

### Créés

| Fichier | Responsabilité |
|---------|---------------|
| `src/pages/Planning.tsx` | Container : state local, DndContext, layout 2/3 + 1/3 |
| `src/components/planning/CalendarGrid.tsx` | Grille mensuelle 7 colonnes, navigation mois |
| `src/components/planning/DayCell.tsx` | Cellule jour (droppable @dnd-kit), chips réalisations |
| `src/components/planning/RealisationChip.tsx` | Chip draggable : pastille statut + titre tronqué |
| `src/components/planning/UnscheduledList.tsx` | Colonne droite : liste scrollable des réalisations sans date |

### Modifiés

| Fichier | Changement |
|---------|-----------|
| `src/types/realisation.ts` | Ajout `publishedAt: Date \| null` |
| `src/data/mock.ts` | Ajout `publishedAt` sur `MOCK_REALISATIONS` |
| `src/pages/Planning.tsx` | Remplace le placeholder par la vraie page |
| `src/components/layout/AppLayout.tsx` | Route `activePage === 'planning'` → `<Planning />` |
| `src/components/layout/Sidebar.tsx` | Ajout entrée "Planning" dans `NAV_ITEMS` |

---

## Composants UI

### Planning.tsx (container)

- State :
  - `réalisations: Realisation[]` initialisé depuis `MOCK_REALISATIONS`
  - `currentMonth: Date` (défaut : mois en cours)
- Fournit le `DndContext` de @dnd-kit/core
- Handler `handleDrop(réalisationId, date | null)` : met à jour `publishedAt`
- Layout : `flex h-full` avec `CalendarGrid` (flex-grow) + `UnscheduledList` (w-72 fixe)

### CalendarGrid.tsx

- Reçoit : `réalisations`, `currentMonth`, `onMonthChange`
- Calcule la grille (semaines du mois, jours de remplissage)
- Header : navigation `← <Mois Année> →`
- En-têtes colonnes : Lun Mar Mer Jeu Ven Sam Dim
- Rend une `DayCell` par jour

### DayCell.tsx

- Reçoit : `date`, `réalisations[]` (filtrées sur ce jour), `isCurrentMonth`
- **Droppable** via `useDroppable` de @dnd-kit/core (id = date ISO string)
- Affiche le numéro du jour + les `RealisationChip` triés par titre
- Feedback visuel : fond `bg-brand/5` lorsque `isOver === true`
- Jours hors mois courant : `opacity-40`, pas droppables

### RealisationChip.tsx

- Reçoit : `realisation: Realisation`
- **Draggable** via `useDraggable` de @dnd-kit/core (id = `realisation.id`)
- Rendu : `[● Titre]` — pastille couleur via `STATUS_COLORS[status].dot`, titre `truncate`
- Dragging : `opacity-50` sur l'original
- Utilisé dans `DayCell` (dans le calendrier) ET dans `UnscheduledList` (colonne droite)

### UnscheduledList.tsx

- Reçoit : `réalisations[]` (filtrées `publishedAt === null`)
- Header : "Sans date (N)" avec le compte
- Liste scrollable de `RealisationChip`
- Zone **droppable** avec id `"unscheduled"` : déposer une réalisation ici remet `publishedAt = null`

---

## Drag-and-drop

Bibliothèque : **@dnd-kit/core** (déjà utilisée dans l'app).

### Flux

1. L'utilisateur saisit une `RealisationChip` (depuis la colonne droite ou depuis une cellule du calendrier)
2. Au survol d'une `DayCell`, la cellule se surligne
3. Au drop sur une `DayCell` : `publishedAt` = date de la cellule
4. Au drop sur `UnscheduledList` : `publishedAt` = `null`
5. Drop annulé (hors zone) : pas de changement

### Identifiants DnD

- Draggable : `realisation.id` (string)
- Droppable jours : ISO date string `"2026-05-15"`
- Droppable colonne droite : `"unscheduled"`

---

## Couleurs de statut

Réutilise `STATUS_COLORS` depuis `src/types/realisation.ts` :

```ts
STATUS_COLORS[status].dot  // classe Tailwind bg-* pour la pastille
```

---

## Navigation mois

- Boutons `←` / `→` dans le header du calendrier
- `currentMonth` est un `Date` dont seuls mois et année comptent
- Pas de limite de navigation (passé et futur accessibles)

---

## Ce qui est hors scope

- Persistance (state mémoire uniquement)
- Vue semaine ou jour
- Panneau de détail au clic sur un jour
- Édition d'une réalisation depuis le calendrier
- Intégration API TikTok pour les dates de publication réelles
- Filtrage par statut dans le calendrier
