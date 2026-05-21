# Page Analytics — Design Spec

## Contexte

La page Analytics centralise les données de performance TikTok Shop : CA généré, commissions encaissées, top produits, top boutiques. Les données sont mockées depuis un export CSV réel et structurées pour permettre un swap API ultérieur sans toucher aux composants de visualisation.

---

## Modèle de données

### Type `Order`

Défini dans `src/types/analytics.ts` :

```ts
export type OrderStatus = 'Réglée' | 'Inéligible' | 'En attente'
export type OrderType = 'affiliée' | 'pub_shopping'

export type Order = {
  id: string
  date: Date
  productName: string
  boutiqueName: string
  price: number              // Prix brut de la commande
  commissionStandard: number // Commission standard (réelle)
  commissionPub: number      // Commission Publicités shopping (réelle)
  orderType: OrderType
  status: OrderStatus
}
```

### Données mock

`MOCK_ORDERS: Order[]` dans `src/data/mockAnalytics.ts` — ~200 entrées parsées depuis l'export CSV réel (dates entre janvier et mai 2026, vrais noms de produits et boutiques).

### Couche de calcul

Fonctions pures dans `src/utils/analyticsUtils.ts` :

```ts
filterByPeriod(orders: Order[], period: Period): Order[]
computeKPIs(orders: Order[]): KPIData
computeWeeklyTrend(orders: Order[]): WeeklyPoint[]
computeOrderTypeBreakdown(orders: Order[]): BreakdownData
computeTopProducts(orders: Order[], limit?: number): TopItem[]
computeTopBoutiques(orders: Order[], limit?: number): TopItem[]
```

Toutes les fonctions prennent `Order[]` en entrée — l'interface est identique que les données viennent du mock ou d'une API.

---

## Architecture des fichiers

### Créés

| Fichier | Responsabilité |
|---------|---------------|
| `src/types/analytics.ts` | Types `Order`, `OrderType`, `OrderStatus`, `Period`, `KPIData`, `WeeklyPoint`, `TopItem` |
| `src/data/mockAnalytics.ts` | `MOCK_ORDERS: Order[]` (~200 commandes réelles) |
| `src/utils/analyticsUtils.ts` | Fonctions de calcul pures |
| `src/pages/Analytics.tsx` | Page container (remplace le placeholder) |
| `src/components/analytics/KPICard.tsx` | Carte KPI avec valeur + badge tendance |
| `src/components/analytics/TrendChart.tsx` | Courbe CA + commissions (Recharts LineChart) |
| `src/components/analytics/DonutChart.tsx` | Répartition affiliée vs pub shopping (Recharts PieChart) |
| `src/components/analytics/TopTable.tsx` | Tableau classement générique (produits ou boutiques) |

### Modifiés

| Fichier | Changement |
|---------|-----------|
| `src/pages/Analytics.tsx` | Remplace le placeholder par la vraie page |
| `package.json` | Ajout de `recharts` |

---

## Composants UI

### Analytics.tsx (page container)

- State : `period: Period` (défaut : `'30j'`)
- Calcule tous les agrégats via `analyticsUtils` au render (mémoïsé avec `useMemo`)
- Structure :
  1. Header : titre + pastilles de période (`7j / 30j / 3 mois / 6 mois / Tout`)
  2. Rangée KPIs (4 cartes)
  3. Onglets : `Vue générale` / `Top Produits` / `Top Boutiques`
  4. Contenu de l'onglet actif

### KPICard

Props : `label, value, trend` (pourcentage vs période précédente, peut être null).  
Badge vert si positif, rouge si négatif, gris si null.

### TrendChart

Recharts `LineChart` responsive. Deux lignes :
- CA (couleur brand `#3B5BFF`)
- Commissions (couleur brand clair `#a5b4fc`, dashed)

Axe X : semaines (format `Sem 1`, `Sem 2`…). Axe Y : euros.  
Tooltip custom affichant CA et commissions au survol.

### DonutChart

Recharts `PieChart`. Deux tranches : affiliée vs pub shopping.  
Label central : pourcentage dominant + libellé.

### TopTable

Props génériques : `items: TopItem[], label: string`.  
Colonnes : rang (badge coloré, or pour #1), nom, CA, commissions, nb commandes.  
Barre de progression mini sous le rang pour visualiser la proportion relative.

---

## Périodes & filtrage

```ts
type Period = '7j' | '30j' | '3m' | '6m' | 'tout'
```

`filterByPeriod` compare `order.date` à `new Date()` moins la période.  
`'tout'` retourne toutes les commandes sans filtre.

Tendance KPI = comparaison avec la période précédente de même durée (ex. `30j` → compare avec les 30j précédant les 30 derniers jours).

---

## Ce qui est hors scope

- Upload CSV manuel (prévu mais pas dans ce sprint)
- Intégration API TikTok (futur sprint)
- Filtrage par produit / boutique spécifique
- Export des données
- Persistance (state mémoire uniquement)
