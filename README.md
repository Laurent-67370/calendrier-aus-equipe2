# 🏓 Calendrier PWA - ALSATIA UNITAS SCHILTIGHEIM Équipe 2

Bienvenue sur le projet de l'application PWA (Progressive Web App) pour la gestion du calendrier et de la composition de l'équipe 2 de l'AUS Schiltigheim pour la saison 2026-2027.

Cette application est conçue pour être simple, rapide et collaborative, permettant à tous les membres de l'équipe de consulter le calendrier et de voir la composition des équipes en temps réel.

## ✨ Fonctionnalités

*   **📅 Calendrier Complet :** Consultation de tous les matchs de la phase, avec dates, horaires et adversaires.
*   **👥 Gestion d'Équipe Collaborative :**
    *   Indiquez les disponibilités de chaque joueur (Disponible, Indisponible, Pas de réponse).
    *   Composez l'équipe de 4 joueurs pour chaque rencontre.
    *   Toutes les modifications sont sauvegardées en ligne et visibles par tous les membres.
*   **📱 Progressive Web App (PWA) :** Installez l'application sur l'écran d'accueil de votre téléphone pour un accès rapide et une utilisation hors ligne.
*   **🎨 Thème Sombre :** Basculez entre le mode clair et le mode sombre pour un meilleur confort visuel.
*   **🔍 Filtres et Recherche :** Trouvez rapidement un match par mois, par lieu (domicile/extérieur) ou en recherchant un nom d'équipe ou de joueur.

## 🚀 Utilisation

L'application est accessible directement via son URL Netlify. Aucune installation n'est requise, mais il est recommandé de l'ajouter à l'écran d'accueil pour une meilleure expérience.

1.  **Consulter le Calendrier :** Parcourez la liste des matchs.
2.  **Gérer une composition :**
    *   Cliquez sur le bouton **"👥 Gérer l'équipe"** sur la carte d'un match.
    *   Mettez à jour les disponibilités et sélectionnez les joueurs.
    *   Cliquez sur **"Sauvegarder"**. Les données sont immédiatement mises à jour pour tout le monde.

## 🛠️ Architecture Technique

Ce projet utilise une architecture Jamstack moderne, combinant plusieurs services pour une performance et une sécurité optimales :

*   **Frontend (Interface) :** Un simple fichier `index.html` avec du HTML, CSS et JavaScript vanilla.
*   **Hébergement :** Déployé sur **Netlify** pour une performance globale et des déploiements continus.
*   **Backend (API) :** **Netlify Functions** (en Node.js) servent d'intermédiaire sécurisé entre l'application et la base de données.
*   **Base de Données :** **Google Firebase Firestore** est utilisée pour stocker et synchroniser les compositions d'équipe en temps réel.

## 📦 Déploiement

Ce projet est configuré pour un déploiement continu via GitHub.

1.  **Cloner le projet :**
    ```bash
    git clone https://github.com/Laurent-67370/calendrier-aus-equipe2.git
    cd calendrier-aus-equipe2
    ```

2.  **Installation des dépendances (pour les fonctions) :**
    ```bash
    npm install
    ```

3.  **Configuration des variables d'environnement sur Netlify :**
    *   Créez un contexte partagé ou des variables individuelles pour le site :
        *   `FIREBASE_PROJECT_ID`
        *   `FIREBASE_CLIENT_EMAIL`
        *   `FIREBASE_PRIVATE_KEY`

4.  **Déploiement :**
    *   Poussez les modifications sur la branche `main` du dépôt GitHub. Netlify se chargera automatiquement du déploiement.

### Initialisation de la base de données

Un script `seedDatabase-equipe2.js` est inclus pour remplir la base de données Firestore la première fois.

1.  Après le premier déploiement, visitez l'URL : `https://VOTRE-SITE.netlify.app/.netlify/functions/seedDatabase-equipe2`.
2.  Une fois les données insérées, il est recommandé de supprimer ce fichier du projet et de redéployer.

---
_Application développée pour faciliter l'organisation de l'équipe._
