# Architecture Backend - Plateforme E-Commerce M.E.A.N.

## 📋 Vue d'ensemble

Application backend basée sur **Express.js + MongoDB** pour une plateforme e-commerce multi-boutique avec système de commandes et gestion des avis.

**Stack technologique :**

- Node.js + Express
- MongoDB + Mongoose
- JWT pour l'authentification
- bcryptjs pour le hashage des mots de passe
- Multer pour les uploads (middleware)

---

## 🔐 Modèles de Données

### 1. **User** (Collection principale)

Utilisateur de base avec 3 rôles distincts.

```javascript
{
  _id: ObjectId,
  nom: String (requis),
  prenom: String (requis),
  email: String (unique, requis),
  password: String (hashé, requis),
  role: String ["admin", "boutique", "acheteur"] (requis),
  photo: String (URL ou base64),
  dateCreation: Date (auto: Date.now),
  actif: Boolean (default: true)
}
```

**Logique :**

- Le mot de passe est hasé avec bcryptjs avant la sauvegarde (pre('save'))
- Méthode `comparePassword()` pour vérifier lors de la connexion

---

### 2. **Boutique** (Extension de User)

Profil spécifique pour les vendeurs.

```javascript
{
  _id: ObjectId (référence User._id),
  nomBoutique: String (requis),
  description: String,
  adresse: String,
  telephone: String,
  logo: String,
  modePaiementAcceptes: [String] // ["carte", "espèces", "mobile money"]
  horaires: {
    lundi: { ouverture: "08:00", fermeture: "20:00" },
    mardi: {...},
    // ... samedi, dimanche
  },
  noteMoyenne: Number (default: 0),
  totalAvis: Number (default: 0),
  timestamps: true
}
```

**Logique :**

- Créée automatiquement lors de l'inscription avec rôle "boutique"
- `_id` référence directe à `User._id` (pas de collection multiple)

---

### 3. **Acheteur** (Extension de User)

Profil spécifique pour les clients.

```javascript
{
  _id: ObjectId (référence User._id),
  telephone: String,
  adresseLivraisonParDefaut: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: String (default: "France")
  },
  preferences: [String], // Catégories préférées
  timestamps: true
}
```

**Logique :**

- Créée automatiquement lors de l'inscription avec rôle "acheteur"
- Stocke une adresse par défaut pour les livraisons

---

### 4. **Produit** (Catalogue général)

Produit générique dans le système.

```javascript
{
  _id: ObjectId,
  nom: String (requis),
  description: String,
  categorie: String ["alimentaire", "habillement", "electronique", "maison", "autre"],
  image: String (URL),
  datePeremption: Date (optionnel),
  caracteristiques: Mixed (flexible, key-value),
  timestamps: true
}
```

**Logique :**

- Catalogue centralisé d'admin
- Les boutiques associent des produits via **ProduitParBoutique**

---

### 5. **ProduitParBoutique** (Offre spécifique)

Liaison entre un produit et une boutique avec prix/stock.

```javascript
{
  _id: ObjectId,
  idBoutique: ObjectId (ref: Boutique, requis),
  idProduit: ObjectId (ref: Produit, requis),
  prix: Number (requis, min: 0),
  stock: Number (default: 0, min: 0),
  enPromotion: Boolean (default: false),
  prixPromo: Number,
  timestamps: true
}
```

**Index unique :** `{ idBoutique: 1, idProduit: 1 }` → Un produit par boutique

**Logique :**

- Chaque boutique fixe son propre prix
- Gestion du stock par boutique
- Les promotions s'appliquent sur cette entité

---

### 6. **Promotion**

Remises temporelles sur un produit/boutique.

```javascript
{
  _id: ObjectId,
  idProduitParBoutique: ObjectId (ref: ProduitParBoutique, requis),
  remisePourcentage: Number (requis, 1-100),
  dateDebut: Date (requis),
  dateFin: Date (requis),
  actif: Boolean (default: true),
  timestamps: true
}
```

**Logique :**

- Une promotion est valide si : `actif = true` ET `dateDebut <= now <= dateFin`
- Le prix appliqué = `prix * (1 - remisePourcentage / 100)`
- Vérifié au moment de la création de commande

---

### 7. **Commande**

Achat complet par un acheteur chez une boutique.

```javascript
{
  _id: ObjectId,
  idAcheteur: ObjectId (ref: User, requis),
  idBoutique: ObjectId (ref: Boutique, requis),
  dateCommande: Date (default: Date.now),
  statut: String ["en_attente", "confirmée", "préparée", "expédiée", "livrée", "annulée"],
  articles: [{
    idProduitParBoutique: ObjectId (ref: ProduitParBoutique),
    nomProduit: String,
    prixUnitaire: Number,
    quantite: Number (min: 1),
    remise: Number (pourcentage appliqué, default: 0)
  }],
  adresseLivraison: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: String
  },
  fraisLivraison: Number (default: 0),
  total: Number (requis),
  modePaiement: String,
  paiementEffectue: Boolean (default: false),
  timestamps: true
}
```

**Logique :**

1. Vérification du stock disponible
2. Application des promotions actives
3. Calcul du total TTC
4. Réduction du stock dans ProduitParBoutique
5. Création d'une Livraison associée

---

### 8. **Avis**

Évaluation et commentaire sur un produit.

```javascript
{
  _id: ObjectId,
  idAcheteur: ObjectId (ref: User, requis),
  idProduitParBoutique: ObjectId (ref: ProduitParBoutique, requis),
  note: Number (requis, 1-5),
  commentaire: String,
  reponseBoutique: {
    commentaire: String,
    date: Date
  },
  timestamps: true
}
```

**Index unique :** `{ idAcheteur: 1, idProduitParBoutique: 1 }` → Un avis par produit/acheteur

**Logique :**

- Utilisé pour calculer `noteMoyenne` et `totalAvis` de Boutique
- La boutique peut répondre aux avis

---

### 9. **Livraison**

Suivi de livraison pour une commande.

```javascript
{
  _id: ObjectId,
  idCommande: ObjectId (ref: Commande, requis),
  statut: String ["en_attente", "en_cours", "livree"],
  livreur: String (nom du livreur),
  numeroSuivi: String (tracking number),
  dateEstimee: Date,
  dateLivraison: Date,
  timestamps: true
}
```

**Logique :**

- Créée automatiquement lors de la création d'une commande
- Statut initial : "en_attente"

---

### 10. **TarifLivraison**

Configuration des frais de livraison par boutique.

```javascript
{
  _id: ObjectId,
  idBoutique: ObjectId (ref: Boutique, unique),
  tarifs: [{
    distanceMin: Number,
    distanceMax: Number,
    prix: Number
  }],
  zoneGratuite: Number (distance max en km pour livraison gratuite, default: 0),
  timestamps: true
}
```

**Logique :**

- Tarification progressive selon la distance
- Zone de livraison gratuite possible

---

## 🔐 Authentification & Autorisation

### Middleware `auth.js`

Vérifie la validité du JWT.

```javascript
// Header attendu : Authorization: Bearer <token>
// Fallback : x-auth-token
```

- Extrait le token du header
- Vérifie avec `JWT_SECRET` (env)
- Populate `req.user` avec `{ id, role, email }`

### Middleware `role.js`

Contrôle d'accès basé sur le rôle.

```javascript
const admin = (req, res, next) => {
  /* rôle = "admin" */
};
const boutique = (req, res, next) => {
  /* rôle = "boutique" */
};
const acheteur = (req, res, next) => {
  /* rôle = "acheteur" */
};
```

---

## 📡 Routes & Contrôleurs

### 1️⃣ **AUTH** (`/api/auth`)

| Méthode | Route       | Protection  | Description                                  |
| ------- | ----------- | ----------- | -------------------------------------------- |
| POST    | `/register` | ❌ Publique | Inscription (crée User + profil spécifique)  |
| POST    | `/login`    | ❌ Publique | Connexion (retourne JWT)                     |
| GET     | `/me`       | 🔒 Auth     | Récupère le profil de l'utilisateur connecté |

**Logique :**

- `register` : crée User + Boutique/Acheteur selon le rôle
- Mot de passe hashé automatiquement
- JWT valide 7 jours

---

### 2️⃣ **PRODUITS** (`/api/produits`)

| Méthode | Route              | Protection  | Rôle     | Description                      |
| ------- | ------------------ | ----------- | -------- | -------------------------------- |
| GET     | `/`                | ❌ Publique | -        | Liste tous les produits          |
| GET     | `/:id`             | ❌ Publique | -        | Détail + boutiques qui vendent   |
| GET     | `/categorie/:cat`  | ❌ Publique | -        | Produits par catégorie           |
| GET     | `/recherche?q=...` | ❌ Publique | -        | Recherche par nom/desc/catégorie |
| POST    | `/`                | 🔒 Auth     | Admin    | Créer un produit (catalogue)     |
| POST    | `/boutique`        | 🔒 Auth     | Boutique | Ajouter un produit à sa boutique |
| PUT     | `/boutique/:id`    | 🔒 Auth     | Boutique | Modifier prix/stock              |
| DELETE  | `/boutique/:id`    | 🔒 Auth     | Boutique | Retirer un produit               |
| POST    | `/:id/promotion`   | 🔒 Auth     | Boutique | Ajouter une promotion            |
| DELETE  | `/:id/promotion`   | 🔒 Auth     | Boutique | Supprimer une promotion          |

**Logique :**

- Produits sont créés par admin (catalogue commun)
- Chaque boutique ajoute les produits qu'elle vend avec son prix
- Promotions appliquées au moment de la commande

---

### 3️⃣ **COMMANDES** (`/api/commandes`)

| Méthode | Route           | Protection | Rôle           | Description                    |
| ------- | --------------- | ---------- | -------------- | ------------------------------ |
| POST    | `/`             | 🔒 Auth    | Acheteur       | Créer une commande             |
| GET     | `/acheteur`     | 🔒 Auth    | Acheteur       | Mes commandes                  |
| GET     | `/boutique`     | 🔒 Auth    | Boutique       | Commandes reçues               |
| GET     | `/admin`        | 🔒 Auth    | Admin          | Toutes les commandes           |
| GET     | `/:id`          | 🔒 Auth    | -              | Détail (propriétaire ou admin) |
| PUT     | `/:id/statut`   | 🔒 Auth    | Boutique/Admin | Modifier le statut             |
| PUT     | `/:id/paiement` | 🔒 Auth    | Acheteur/Admin | Marquer comme payée            |
| PUT     | `/:id/annuler`  | 🔒 Auth    | Acheteur/Admin | Annuler la commande            |

**Logique de création :**

1. ✅ Vérifier les articles (min 1)
2. ✅ Vérifier existence et stock de chaque produit
3. ✅ Vérifier appartenance à la boutique
4. ✅ Appliquer les promotions actives
5. ✅ Calculer le total TTC
6. ✅ Créer la commande
7. ✅ Réduire les stocks
8. ✅ Créer la Livraison associée

---

### 4️⃣ **BOUTIQUES** (`/api/boutiques`)

_À détailler selon vos implémentations spécifiques_

---

### 5️⃣ **AVIS** (`/api/avis`)

_À détailler selon vos implémentations spécifiques_

---

## 🔄 Flux d'une Commande

```
1. Acheteur crée une commande
   ↓
2. Backend vérifie stocks & promotions
   ↓
3. Réduit les stocks dans ProduitParBoutique
   ↓
4. Crée la Commande (statut: "en_attente")
   ↓
5. Crée la Livraison (statut: "en_attente")
   ↓
6. Boutique confirme (statut: "confirmée")
   ↓
7. Boutique marque comme préparée (statut: "préparée")
   ↓
8. Boutique marque comme expédiée (statut: "expédiée")
   ↓
9. Livreur met à jour Livraison (statut: "en_cours")
   ↓
10. Livraison complétée (statut: "livree")
   ↓
11. Commande finalisée (statut: "livrée")
```

---

## 🔗 Diagramme de Relations

```
User
├── Boutique (1-to-1, _id = User._id)
└── Acheteur (1-to-1, _id = User._id)

Produit (catalogue admin)
└── ProduitParBoutique (M-to-N avec Boutique)
    ├── Promotion (1-to-many)
    └── Avis (1-to-many)

Commande
├── Livraison (1-to-1)
├── Acheteur (ref User)
├── Boutique (ref Boutique)
└── Articles (ref ProduitParBoutique)

TarifLivraison (1-to-1 avec Boutique)
```

---

## 🛡️ Sécurité Implémentée

✅ **JWT Token** - Authentification par token signé (7j expiration)  
✅ **Password Hashing** - bcryptjs (10 salts)  
✅ **Role-Based Access Control** - Admin, Boutique, Acheteur  
✅ **Validation Stock** - Vérification avant commande  
✅ **Index Unique** - Évite doublons (email, produit/boutique, avis)  
✅ **Timestamps** - Traçabilité des modifications

---

## 🚀 Points Clés de Conception

1. **Séparation des rôles** : Chaque type d'utilisateur a son propre profil
2. **Flexibilité prix** : Chaque boutique fixe son prix pour un produit
3. **Promotions temporelles** : Appliquées au moment de la commande
4. **Avis uniques** : Un acheteur ne peut faire qu'un avis par produit/boutique
5. **Traçabilité complète** : Commandes, statuts, livraisons, timestamps
6. **Stock décentralisé** : Géré par boutique, réduit lors de commande

---

## 📝 Variables d'Environnement Requises

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mean-app
JWT_SECRET=votre_secret_key_tres_securisee
NODE_ENV=development
```

---

**Dernière mise à jour :** Février 2026
