# PharmEd Pro — Plateforme d'Apprentissage & Conseil Officinal

> **Plateforme officinale déterministe et souveraine (100% Zéro IA / Zéro LLM externe)** dédiée à l'entraînement au comptoir, à la maîtrise du conseil associé éthique, à la substitution de princeps vers génériques et à l'optimisation de la rentabilité officinale selon la réglementation marocaine (PPM).

---

## 1. Problem Statement (Problématique & Public Cible)

- **Public Cible** : Pharmaciens d'officine, préparateurs en pharmacie, étudiants et stagiaires en officine (officines marocaines et francophones).
- **Enjeux & Tâches** :
  1. **Sécurité Thérapeutique & Iatrogénie** : Repérer les contre-indications majeures, expliquer l'observance et les posologies aux patients sans risquer d'hallucinations d'IA.
  2. **Conseil Associé Synergique & Rentabilité** : Délivrer au bon moment le produit associé justifié cliniquement (ex: probiotiques avec antibiothérapie, protecteur gastrique avec AINS, réhydratation avec antidiarrhéique) tout en augmentant la marge brute (+30% à +55%).
  3. **Substitution Éthique & Observance** : Argumenter avec tact le passage du Princeps vers le Générique certifié, rassurant le patient face aux doutes sur l'efficacité.
  4. **Confidentialité Totale & Déontologie** : Zéro transmission d'ordonnances ou de données patient vers des modèles de langage externes (Zéro LLM, Zéro cloud tiers, exécution déterministe locale).

---

## 2. Démonstrations & Liens Actifs

- **Démo Hébergée (Cloud Run)** : `https://ais-dev-bmurxwjgvwr7gfz6o4hnla-720680473577.europe-west2.run.app`
- **Aperçu Partagé** : `https://ais-pre-bmurxwjgvwr7gfz6o4hnla-720680473577.europe-west2.run.app`

---

## 3. Guide d'Installation & Démarrage Local

Le projet ne contient aucun secret, aucune clé d'API obligatoire pour fonctionner en local et aucun cache polluant.

### Prérequis
- Node.js 18+ ou 20+
- npm (ou pnpm / yarn / bun)

### Étapes d'exécution
```bash
# 1. Cloner ou décompresser l'archive
cd pharmed-pro

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement (Port 3000)
npm run dev

# 4. Vérifier la compilation et les types TypeScript
npm run lint
npm run build

# 5. Démarrer le serveur de production
npm start
```
L'application est immédiatement accessible sur `http://localhost:3000`.

---

## 4. Parcours Modifié : Avant / Après (Before vs After)

| Fonctionnalité / Écran | Avant (Before) | Après (After) |
| :--- | :--- | :--- |
| **Modales Ordonnance & Fiche Clinique** | Hauteur variable (`max-h-[92vh]`) provoquant un débordement vertical, chevauchant la barre de navigation supérieure (`navbar`). | Format standardisé unifié (`max-h-[88vh]`, `max-w-xl`, en-tête et pied de page `shrink-0`, défilement interne isolé `overflow-y-auto` et verrouillage du défilement `body scroll-lock`). |
| **Gouvernance & Moteur Audio** | Risque perçu d'appels à des API d'IA vocale distantes. | Utilisation stricte des standards W3C natifs du navigateur (`window.speechSynthesis` et `window.AudioContext`), 100% hors-ligne, sans envoi de paquets vers un serveur d'IA externe. |
| **Navigation & Architecture** | Présence d'onglets secondaires redondants (Quiz flash). | Élimination des onglets superflus au profit d'une interface épurée à 3 volets : **Portail d'accueil**, **Simulateur de Comptoir** et **Encyclopédie DCI & Marges**. |
| **Cycle de Vie des Cas de Comptoir** | Impossibilité de masquer les cas terminés, entraînant une boucle sur les mêmes cas. | Système d'archivage persistant par profil avec saut automatique vers le cas actif suivant et restauration en un clic. |

---

## 5. Références Techniques & Justification des Motifs d'Architecture

1. **[W3C Web Speech API & W3C Web Audio API Specification](https://developer.mozilla.org/fr/docs/Web/API/Web_Speech_API)**
   - *Pourquoi ce motif ?* : Permet une restitution vocale des répliques patients et des signaux sonores de validation directement par le moteur de synthèse vocal de l'OS / navigateur de l'utilisateur, garantissant zéro latence, zéro dépendance à des clés payantes et une confidentialité médicale absolue.
2. **[W3C WAI-ARIA Modal Dialog Pattern & WCAG 2.1 Focus Management](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)**
   - *Pourquoi ce motif ?* : Prévient les superpositions parasites avec la barre d'en-tête en isolant le défilement dans la zone centrale de la modale (`overscroll-contain`, fermeture avec la touche `Escape`, gestion du clic sur le backdrop et capture du défilement corporel).

---

## 6. Notes de Tests & Résolution de Problème (Test Notes)

- **Test 1 : Cohérence des calculs économiques réactifs**
  - *Scénario* : Validation consécutive de plusieurs cas avec et sans produit associé.
  - *Résultat* : Les métriques de marge (`Marge Réalisée`, `Marge Cible` et taux d'atteinte) se mettent à jour instantanément sans rechargement.
- **Test 2 (Erreur rencontrée & Correction)** :
  - *Anomalie constatée* : Sur les écrans d'ordinateur portable (hauteur < 800px), les fenêtres `prescription-pad-card` et `guide-card-content` dépassaient la hauteur de la fenêtre, rendant le bouton de fermeture supérieur inaccessible sous la barre de navigation.
  - *Correction appliquée* : Restructuration en flexbox verticale avec contrainte parent `max-h-[88vh]`, en-tête fixé (`shrink-0`), pied de page fixé (`shrink-0`) et conteneur de défilement intermédiaire (`flex-1 overflow-y-auto overscroll-contain`).
- **Test 3 : Filtrage et archivage des cas**
  - *Scénario* : Archivage d'un cas depuis le débriefing puis clic sur "Cas Suivant".
  - *Résultat* : Le simulateur charge directement le cas non archivé le plus proche.

---

## 7. Liste Visible des Mocks, Routes et Périmètres

- **Moteur Pharmacologique** : Arbre décisionnel déterministe embarqué (`src/data/mockPharmacyData.ts`) contenant 6 cas cliniques types et 7 monographies DCI conformes à la nomenclature PPM marocaine.
- **Persistance des Données** : Stockage local au sein du navigateur (`localStorage`) cloisonnant les données du Préparateur et du Pharmacien Titulaire.
- **API Backend** : Route unique de contrôle d'intégrité `/api/health` confirmant l'absence de module LLM tiers.
- **Limites Connues & Pistes d'Évolution** :
  - L'export d'ordonnance au format PDF s'appuie sur la boîte de dialogue d'impression native du navigateur (`window.print`).
  - La synchronisation multi-officines centralisée peut être interfacée ultérieurement avec le progiciel de gestion d'officine (LGO/ERP).
