# Boutique Baya

Site e-commerce pour une vendeuse de baya : boutique, panier, commande, suivi et espace vendeuse.

## Structure
```
boutique-baya/
├── index.html            Page principale
├── manifest.webmanifest  Ajout à l'écran d'accueil du téléphone
├── firebase.json         Déploiement Firebase Hosting
├── firestore.rules       Règles de sécurité Firestore
└── assets/
    ├── css/style.css     Design (luxe sombre : noir et or)
    ├── js/config.js      Configuration Firebase (à remplir)
    ├── js/app.js         Logique du site
    └── img/              Images et favicon
```

## Produits
La boutique démarre **sans aucun produit**. Ajoute-les depuis `#/admin` > Produits > Ajouter un baya (nom, prix, stock, photos).

## Essayer tout de suite (mode démo)
Ouvre `index.html` dans ton navigateur. Espace vendeuse : `#/admin`, mot de passe `admin123`.
Les données sont stockées dans le navigateur uniquement.

## Passer en mode réel (Firebase)
1. Crée un projet sur https://console.firebase.google.com et ajoute une app Web.
2. Colle la configuration dans `assets/js/config.js`.
3. Active **Firestore** et **Authentication** (Email/Mot de passe), puis crée le compte de la vendeuse.
4. Copie `firestore.rules` dans l'onglet Règles de Firestore.
5. Déploie : `firebase deploy` (ou envoie le dossier sur n'importe quel hébergeur).

## Personnalisation
Nom, slogan, WhatsApp, Instagram, TikTok, numéro Wave, textes et bannière se modifient dans l'espace vendeuse, onglet Boutique.
