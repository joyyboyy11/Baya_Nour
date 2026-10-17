# Boutique Baya by Nour

Site e-commerce pour une vendeuse de baya : boutique, panier, commande, suivi et espace vendeuse.

## Structure
Deux espaces séparés, même site et même hébergement :
- **Boutique (clientes)** : `index.html`, aucune ligne de code d'administration, SDK d'authentification non chargé.
- **Espace vendeuse** : `admin.html` (adresse `/admin` sur Firebase Hosting), page non référencée par Google (noindex).

```
boutique-baya/
├── index.html            Boutique (clientes)
├── admin.html            Espace vendeuse (connexion, produits, commandes, ventes, codes, boutique)
├── manifest.webmanifest  Ajout à l'écran d'accueil du téléphone
├── firebase.json         Déploiement Firebase Hosting (/admin -> admin.html, noindex)
├── firestore.rules       Règles de sécurité Firestore (elles protègent les données)
└── assets/
    ├── css/style.css     Design A « Bordeaux classique » (partagé)
    ├── css/admin.css     Petits ajustements de l'espace vendeuse
    ├── js/config.js      Configuration Firebase (partagée)
    ├── js/common.js      Code partagé : réglages, utilitaires, couche données Firebase / démo
    ├── js/app.js         Boutique : produits, panier, commande, suivi
    ├── js/admin.js       Espace vendeuse : connexion et gestion
    └── img/              Logos (logo-header, logo-full, logo-rond), favicon et icônes
```

## Produits
La boutique démarre **sans aucun produit**. Ajoute-les depuis `#/admin` > Produits > Ajouter un baya (nom, prix, stock, photos).

## Essayer tout de suite (mode démo)
Ouvre `index.html` (boutique) et `admin.html` (espace vendeuse, mot de passe `admin123`).
Les données sont stockées dans le navigateur uniquement (boutique et admin les partagent sur un même appareil).

## Passer en mode réel (Firebase)
1. Console Firebase : crée un projet (idéalement dédié à la boutique) et ajoute une app Web.
2. Colle les valeurs dans `assets/js/config.js` (objet `CONFIG`, sans `import`, sans Analytics).
3. **Firestore Database** > Créer une base (mode production, région proche, ex. `europe-west`).
4. **Authentication** > Sign-in method > active **E-mail/Mot de passe**, puis Users > Ajouter l'utilisateur (e-mail + mot de passe de la vendeuse).
5. Firestore > **Règles** : colle `firestore.rules` et clique sur Publier.
6. Authentication > Paramètres > **Domaines autorisés** : ajoute le domaine du site (celui de Firebase Hosting est déjà là).
7. Déploie : `firebase deploy` (ou envoie le dossier sur n'importe quel hébergeur).
8. Connecte-toi sur `/admin` (ou `admin.html`) avec l'e-mail de la vendeuse, puis renseigne l'onglet Boutique (nom, WhatsApp, Wave) et ajoute les produits.

Les photos sont réduites (800 px) et enregistrées dans Firestore : Firebase Storage n'est pas nécessaire.

## Personnalisation
Nom, slogan, WhatsApp, Instagram, TikTok, numéro Wave, textes et bannière se modifient dans l'espace vendeuse (`admin.html`), onglet Boutique.

## Logo
- `assets/img/logo-header.png` : logo de l'en-tête (BAYA / BY NOUR) sur fond bordeaux.
- `assets/img/logo-full.png` : logo complet (monogramme BN + nom) pour le pied de page.
- `assets/img/logo-rond.png` (1024 px) : photo de profil pour Instagram, TikTok et WhatsApp.
- `favicon.png` et `icon-*.png` : onglet du navigateur et écran d'accueil du téléphone.
- Le nom affiché sur le site vient de l'espace vendeuse (onglet Boutique) : en mode réel Firebase, vérifie que le champ « Nom de la boutique » contient bien « Baya by Nour » (le site corrige automatiquement l'ancien « Baya Nour »).

## Sécurité
Séparer l'admin garde le code de gestion hors de la boutique, mais la vraie protection reste `firestore.rules` : seul le compte de la vendeuse peut écrire et lire les commandes. L'ancien lien `#/admin` redirige vers `admin.html`. Le lien « Espace vendeuse » du pied de page a été retiré : la vendeuse ouvre `/admin` directement (à mettre en favori).
