# Design — Page Réalisation (TikTok Shop CRM)

**Date :** 2026-05-08  
**Statut :** Approuvé

---

## Contexte

Application CRM de gestion de TikTok Shop. La page Réalisation est le cœur de l'outil : elle permet de gérer le cycle de vie de chaque vidéo, du script à la publication. L'outil est utilisé par 1 à 2 personnes.

---

## Stack

- **Frontend :** React + Vite, TypeScript, TailwindCSS, Framer Motion
- **Données :** Mock data dans `src/data/mock.ts` (structure identique à Firebase pour swap futur)
- **Pas de backend pour cette phase**

---

## Modèle de données

```ts
type RushFile = {
  id: string
  name: string
  url: string
  size: number
}

type Realisation = {
  id: string
  title: string
  status: 'a_tourner' | 'script' | 'a_monter' | 'a_publier' | 'publiee'
  productId: string
  publishDate: string | null
  notes: string
  rushes: RushFile[]
  createdAt: string
}

type Product = {
  id: string
  name: string
  imageUrl: string
}
```

---

## Architecture des fichiers

```
src/
  pages/
    Realisation.tsx            # page principale, gère l'état global et le panel
  components/
    realisation/
      ViewSwitcher.tsx          # switcher entre les 3 vues
      ListView.tsx              # vue liste (tableau)
      KanbanView.tsx            # vue kanban (colonnes par statut)
      CardsView.tsx             # vue grille visuelle
      RealisationCard.tsx       # carte partagée (utilisée dans Kanban et Cards)
      RealisationPanel.tsx      # side panel détail (slide depuis la droite)
      StatusBadge.tsx           # badge de statut coloré et réutilisable
      FileUploadZone.tsx        # zone drag & drop pour les rushs
  data/
    mock.ts                     # données mockées
  types/
    realisation.ts              # types TypeScript
```

---

## Vues

### Vue List (défaut)
- Tableau avec une ligne par réalisation
- Colonnes : Titre, Statut (badge), Produit, Date cible
- Hover léger sur la ligne, clic → ouvre le side panel

### Vue Kanban
- 5 colonnes correspondant aux 5 statuts
- Cartes drag-and-droppable pour changer de statut (via @dnd-kit)
- Header de colonne avec nom du statut + compteur de cartes

### Vue Cards
- Grille 3 colonnes
- Cartes plus hautes avec miniature grisée (placeholder) si aucun rush, sinon aperçu du premier rush
- Nom en évidence, badge statut en overlay haut-droit

---

## Side Panel (Option A — retenu)

- Slide depuis la droite (Framer Motion, 480px de large)
- Fond blanc, overlay sombre sur le reste de la page
- Sections :
  1. **Header** — titre éditable inline, badge statut cliquable (menu de changement de statut)
  2. **Métadonnées** — produit associé (select), date de publication cible (date picker)
  3. **Rushs** — zone drag & drop + liste des fichiers uploadés (nom, taille, bouton suppression)
  4. **Notes** — textarea éditable, sauvegarde auto ou bouton Save
- Fermeture : clic sur l'overlay ou bouton ✕

---

## Design System

| Token | Valeur |
|---|---|
| Fond page | `#F4F6FA` |
| Carte | `#FFFFFF`, ombre légère |
| Accent principal | `#3B5BFF` |
| Texte principal | `#0F172A` |
| Texte secondaire | `#64748B` |

### Couleurs des statuts

| Statut | Couleur |
|---|---|
| À tourner | Gris neutre `#94A3B8` |
| Script à rédiger | Violet `#8B5CF6` |
| À monter | Ambre `#F59E0B` |
| À publier | Bleu `#3B82F6` |
| Publiée | Vert `#10B981` |

---

## Ce qui est hors scope (phase 1)

- Authentification / gestion multi-utilisateurs
- Assignation de vidéo à un utilisateur
- Lecteur vidéo inline pour les rushs
- Notifications
- Intégration Firebase (mock uniquement)
