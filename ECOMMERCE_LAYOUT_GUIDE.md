# 🛍️ Layout E-commerce - Documentation

## 📋 Vue d'ensemble

Un nouveau layout e-commerce professionnel a été créé pour les acheteurs. Ce layout est différent du layout admin par défaut qui concerne les administrateurs et les gérants de boutique.

## 🏗️ Architecture

### Layouts

#### 1. **DefaultLayoutComponent** (Admin/Boutique)

- Pour les rôles: `admin`, `boutique`
- Chemin: `/admin/*`
- Design: Dashboard administrateur avec sidebar
- Utilisé pour: Gestion des boutiques, produits, commandes

#### 2. **CustomerLayoutComponent** (Acheteur) - ✨ NOUVEAU

- Pour le rôle: `acheteur`
- Chemin: `/home`, `/shop`, `/products`, etc.
- Design: E-commerce moderne avec header, navigation et footer
- Utilisé pour: Navigation et achat de produits

## 📁 Structure des fichiers

```
frontend/src/app/
├── layout/
│   ├── customer-layout/              ✨ NOUVEAU
│   │   ├── customer-layout.component.ts
│   │   ├── customer-layout.component.html
│   │   ├── customer-layout.component.scss
│   │   └── index.ts
│   └── default-layout/               (existant)
│
└── views/
    └── customer/                      ✨ NOUVEAU
        ├── home/
        │   ├── customer-home.component.ts
        │   ├── customer-home.component.html
        │   └── customer-home.component.scss
        ├── shop/
        │   ├── customer-shop.component.ts
        │   ├── customer-shop.component.html
        │   └── customer-shop.component.scss
        ├── products/
        │   ├── customer-products.component.ts
        │   ├── customer-products.component.html
        │   └── customer-products.component.scss
        ├── product-detail/
        ├── deals/
        ├── cart/
        ├── account/
        └── orders/
```

## 🎨 Features du Layout E-commerce

### Header

- **Logo et branding** - Logo eBossy
- **Barre de recherche** - Recherche de produits
- **Icônes d'action**:
  - ❤️ Favoris
  - 🛒 Panier avec compteur
  - 👤 Compte utilisateur avec dropdown
- **Navigation responsive** - Menu mobile

### Navigation

- **Accueil** - Page d'accueil e-commerce
- **Boutiques** - Liste de toutes les boutiques
- **Tous les Produits** - Catalogue complet
- **Promotions** - Offres spéciales

### Footer

- **Sections d'informations** - À propos, Aide, Politique
- **Newsletter** - Inscription
- **Liens sociaux** - Réseaux sociaux

## 🛣️ Routes

### Routes Acheteur (CustomerLayout)

```
/home                          - Page d'accueil
/shop                          - Boutiques
/products                      - Catalogue produits
/product/:id                   - Détail produit
/deals                         - Promotions
/cart                          - Panier
/account                       - Mon compte
/orders                        - Mes commandes
```

### Routes Admin/Boutique (DefaultLayout)

```
/admin/dashboard               - Tableau de bord
/admin/theme/*                 - Thèmes
/admin/forms/*                 - Formulaires
/admin/charts/*                - Graphiques
... (autres routes existantes)
```

## 🔐 Redirection Automatique

### À la Connexion

- **Acheteur** → `/home`
- **Boutique** → `/admin/dashboard`
- **Admin** → `/admin/dashboard`

### À l'Inscription

- **Acheteur** → `/home`
- **Boutique** → `/admin/dashboard`

## 📊 Données Statiques

Actuellement, le layout e-commerce affiche des données statiques pour:

### Page d'accueil

- **Catégories populaires** (6 catégories)
  - Électronique, Habillement, Maison, Alimentaire, Livres, Beauté
- **Produits en vedette** (8 produits)
  - Avec prix, remises, notes, avis
- **Top boutiques** (4 boutiques)
  - Avec notation et nombre de produits
- **Bannière promotionnelle**

### Pages supplémentaires

- **Boutiques** - Liste statique de 8 boutiques
- **Produits** - Grille de 12 produits
- **Deals** - Page placeholder
- **Panier** - Page placeholder
- **Compte** - Page placeholder
- **Commandes** - Page placeholder

## 🎯 Design Features

### Palette de couleurs

- **Primaire**: #667eea (Violet)
- **Secondaire**: #764ba2 (Violet foncé)
- **Accent**: #dc3545 (Rouge)
- **Arrière-plan**: #f8f9fa (Gris clair)

### Responsive Design

- Desktop: Grille complète
- Tablette: Adaptation de la grille
- Mobile: Layout empilé

### Composants UI

- **Product Cards** - Affichage produits avec image, prix, remise, évaluation
- **Shop Cards** - Affichage boutiques avec overlay
- **Category Cards** - Catégories avec icône
- **Hero Section** - Banner avec CTA
- **Navigation Dropdown** - Menu utilisateur

## 🚀 Prochaines étapes

### Court terme

- [ ] Connecter à l'API backend pour les produits réels
- [ ] Implémenter la recherche
- [ ] Ajouter le panier fonctionnel
- [ ] Ajouter le système de paiement

### Moyen terme

- [ ] Filtres avancés pour produits
- [ ] Recommandations personnalisées
- [ ] Système d'évaluation
- [ ] Historique de navigation

### Long terme

- [ ] Notifications en temps réel
- [ ] Chat avec support
- [ ] Intégration paiements multiples
- [ ] Analytics utilisateur

## 📝 Notes importantes

1. **Données statiques**: Les données sont actuellement en dur dans le composant. À remplacer par des appels API.

2. **Assets**: Les images produits utilisent des placeholders (via.placeholder.com). À remplacer par les vraies images.

3. **Fonctionnalités**: Panier, paiement et commande ne sont que des interfaces. À intégrer avec le backend.

4. **Styling**: Tous les styles sont en SCSS avec media queries pour responsive design.

## 🔗 Intégration Backend

Pour intégrer avec le backend, vous devrez:

1. **Créer un ProduitsService**:

```typescript
constructor(private http: HttpClient) {}

getProducts(): Observable<Product[]> {
  return this.http.get('/api/produits');
}
```

2. **Créer un BoutiquesService**:

```typescript
getShops(): Observable<Shop[]> {
  return this.http.get('/api/boutiques');
}
```

3. **Remplacer les données statiques** par les données du service

## 🎓 Exemples d'utilisation

### Afficher les produits du API

```typescript
export class CustomerHomeComponent implements OnInit {
  constructor(private produitsService: ProduitService) {}

  ngOnInit() {
    this.produitsService
      .getProducts()
      .subscribe((products) => (this.products = products));
  }
}
```

### Ajouter au panier

```typescript
addToCart(product: Product) {
  this.cartService.add(product);
  // Montrer notification
}
```

---

**Status**: ✅ Layout e-commerce créé avec données statiques
**Prêt pour**: Intégration API et fonctionnalités métier
