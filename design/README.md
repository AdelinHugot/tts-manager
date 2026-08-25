# Source du design

Ce dossier conserve le prototype Claude Design d'origine. Il n'est **pas** inclus
dans le build : il sert de source de vérité pour la génération du code React.

| Fichier | Rôle |
| --- | --- |
| `TTS Manager.dc.html` | Le prototype : template + logique. **C'est ici qu'on modifie le design.** |
| `support.js` | Runtime Claude Design d'origine, gardé comme référence de sémantique |
| `screenshots/`, `uploads/`, `.thumbnail` | Captures et pièces jointes du prototype |

Après toute modification de `TTS Manager.dc.html` :

```bash
npm run gen:view
```

régénère `src/view.jsx`, `src/logic.js` et `src/styles.css`.
