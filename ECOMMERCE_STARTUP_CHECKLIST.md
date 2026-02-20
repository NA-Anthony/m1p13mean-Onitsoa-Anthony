# ✅ E-commerce Layout - Checklist de Démarrage

## 🚀 Avant de commencer

### Vérifications obligatoires

- [ ] MongoDB est en cours d'exécution (locale sur :27017 ou connexion Atlas)
- [ ] Le backend a démarré (`npm start` dans le dossier `/backend`)
- [ ] Les variables d'environnement backend sont définies (.env avec JWT_SECRET, DB_URI)
- [ ] Node.js v20+ est installé

## 🔧 Démarrer l'application

### Terminal 1 - Backend

```bash
cd backend
npm install
npm start
# Serveur écoute sur http://localhost:3000
```

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm start
# CLI Angular sur http://localhost:4200
```

### Expected Output

```
✅ Backend démarré sur http://localhost:3000
✅ Frontend accessible sur http://localhost:4200
✅ Redirection vers /login en premier
✅ Inscription de testeur: email@test.com, password
✅ Sélection du rôle "acheteur"
✅ Redirection vers /home avec layout e-commerce
```

## 🧪 Points de test

### Authentification

- [ ] Page login affichée au démarrage
- [ ] Lien "S'inscrire" mène à /register
- [ ] Inscription avec rôle "acheteur" possible
- [ ] Après inscription, redirection vers /home (pas /login)
- [ ] Token stocké dans localStorage
- [ ] Déconnexion nettoie le token

### Layout Acheteur

- [ ] Header avec logo et barre de recherche
- [ ] Menu sticky en haut
- [ ] Dropdown compte utilisateur
- [ ] Footer avec liens cliquables
- [ ] Responsive design sur mobile (menu hamburger)
- [ ] Lien logout fonctionne

### Page d'accueil e-commerce

- [ ] Hero section avec gradient visible
- [ ] Catégories en grid
- [ ] Produits en vedette avec images
- [ ] Prix et remises affichés
- [ ] Notes d'étoiles visibles
- [ ] Boutiques en grid
- [ ] Bannière promotionnelle en bas

### Navigation

- [ ] Lien "Accueil" → /home
- [ ] Lien "Boutiques" → /shop
- [ ] Lien "Tous les Produits" → /products
- [ ] Lien "Promotions" → /deals
- [ ] Boutons "Ajouter au panier" cliquables (non implémentés)
- [ ] Lien compte utilisateur → /account
- [ ] Lien mes commandes → /orders

### Routes Admin (test avec rôle boutique/admin)

- [ ] Inscription boutique → redirection /admin/dashboard
- [ ] URL /admin/dashboard accessible
- [ ] DefaultLayout utilisé pour admin
- [ ] Nav sidebar affichée

## 🐛 Débogage courant

### Problème: Page blanche

**Solutions**:

- Vérifier la console du navigateur pour erreurs
- Vérifier que le backend écoute sur le port 3000
- Vérifier que les tokens CORS sont corrects

### Problème: "Cannot find module"

**Solutions**:

- Exécuter `npm install` dans backend ET frontend
- Vérifier les imports dans les composants

### Problème: Redirection vers /login après inscription

**Solutions**:

- Vérifier le rôle sélectionné (acheteur vs boutique/admin)
- Vérifier la logique dans register.component.ts
- Vérifier localStorage pour le token

### Problème: Pas de tokens dans requêtes

**Solutions**:

- Vérifier AuthInterceptor est fourni dans app.config.ts
- Vérifier le format Bearer dans auth.js middleware

### Problème: Erreur CORS

**Solutions**:

- Vérifier cors() est activé dans server.js
- Vérifier les origins autorizés

## 📊 Checklist d'intégration API

### Étape 1: Créer les services

- [ ] ProduitService avec getProduits(), getProduitById()
- [ ] BoutiqueService avec getBoutiques(), getBoutiqueById()
- [ ] CommandeService avec getCommandes(), createCommande()
- [ ] CartService avec gestion localStorage

### Étape 2: Remplacer données statiques

- [ ] customer-home.component: Utiliser ProduitService
- [ ] customer-home.component: Utiliser BoutiqueService
- [ ] customer-products.component: Charger depuis API
- [ ] customer-shop.component: Charger depuis API

### Étape 3: Implémenter fonctionnalités

- [ ] Ajouter au panier (cart.service)
- [ ] Afficher panier (customer-cart.component)
- [ ] Confirmer commande
- [ ] Afficher historique commandes

### Étape 4: Gestion d'état

- [ ] CartService avec BehaviorSubject
- [ ] AuthService amélioré avec user profile
- [ ] localStorage pour panier persistant

## 📋 Fichiers modifiés

Résumé des changements depuis la phase authentification:

### Nouveaux fichiers (15)

1. ✅ customer-layout.component.ts/html/scss
2. ✅ customer-home.component.ts/html/scss
3. ✅ customer-shop.component.ts/html/scss
4. ✅ customer-products.component.ts/html/scss
5. ✅ customer-product-detail.component.ts/html/scss
6. ✅ customer-deals.component.ts/html/scss
7. ✅ customer-cart.component.ts/html/scss
8. ✅ customer-account.component.ts/html/scss
9. ✅ customer-orders.component.ts/html/scss
10. ✅ role.guard.ts

### Fichiers modifiés

1. ✅ app.routes.ts - Dual layouts implementation
2. ✅ login.component.ts - Role-based redirect
3. ✅ register.component.ts - Role-aware redirection

## 🎯 Objectifs court terme

### Priority 1 (Cette semaine)

- [ ] Tester le layout e-commerce avec npm start
- [ ] Créer et tester ProduitService avec API backend
- [ ] Implémenter ProductService dans customer-home
- [ ] Vérifier les produits s'affichent depuis la DB

### Priority 2 (Semaine 2)

- [ ] Implémenter panier fonctionnel
- [ ] Ajouter/supprimer produits du panier
- [ ] Afficher panier en page séparée

### Priority 3 (Semaine 3)

- [ ] Système de commande complet
- [ ] Paiement intégré
- [ ] Historique des commandes

## 📞 Support

Pour toute question:

1. Consulter AUTHENTICATION_SETUP.md pour auth
2. Consulter INTEGRATION_SUMMARY.md pour intégration
3. Consulter les logs backend pour erreurs API
4. Vérifier la console navigateur pour erreurs frontend

---

**État**: ✅ Layout prêt à tester
**Prochaine action**: `npm start` dans backend et frontend
**Durée estimée de test**: 5-10 minutes
