# Guide d'Intégration CRUD Utilisateurs - Frontend & Backend

## 📋 Vue d'ensemble

Intégration complète du CRUD utilisateurs entre le frontend Angular et le backend Express.js.

---

## 🔧 Modifications Backend

### 1. Contrôleur Utilisateur (`userController.js`)

Créé avec les méthodes suivantes :

| Méthode            | Route                             | Auth     | Description                 |
| ------------------ | --------------------------------- | -------- | --------------------------- |
| `getAllUsers()`    | GET `/api/users`                  | 🔒 Admin | Liste tous les utilisateurs |
| `getUserById()`    | GET `/api/users/:id`              | 🔒 Admin | Détail d'un utilisateur     |
| `updateUser()`     | PUT `/api/users/:id`              | 🔒 Admin | Modifier un utilisateur     |
| `deleteUser()`     | DELETE `/api/users/:id`           | 🔒 Admin | Supprimer un utilisateur    |
| `changePassword()` | PUT `/api/users/:id/password`     | 🔒 Admin | Changer mot de passe        |
| `toggleActif()`    | PUT `/api/users/:id/toggle-actif` | 🔒 Admin | Activer/Désactiver          |
| `getUsersByRole()` | GET `/api/users/role/:role`       | 🔒 Admin | Utilisateurs par rôle       |
| `getUserStats()`   | GET `/api/users/stats`            | 🔒 Admin | Statistiques                |

**Logique :**

- Chaque route vérifie l'authentification (JWT) et le rôle (admin)
- Retour des données sans le mot de passe
- Validation des données entrantes
- Gestion d'erreurs complète

### 2. Routes Utilisateur (`routes/users.js`)

```javascript
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { admin } = require("../middleware/role");

// 🔒 TOUTES LES ROUTES SONT PROTÉGÉES
router.get("/", auth, admin, userController.getAllUsers);
router.get("/stats", auth, admin, userController.getUserStats);
router.get("/role/:role", auth, admin, userController.getUsersByRole);
router.get("/:id", auth, admin, userController.getUserById);
router.put("/:id", auth, admin, userController.updateUser);
router.delete("/:id", auth, admin, userController.deleteUser);
router.put("/:id/password", auth, admin, userController.changePassword);
router.put("/:id/toggle-actif", auth, admin, userController.toggleActif);
```

**⚠️ Important :** L'ordre des routes est critique !

- Routes spécifiques AVANT les routes paramétrées
- `/stats` avant `/:id`
- `/role/:role` avant `/:id`

### 3. Mise à jour `server.js`

Ajout de la route users :

```javascript
app.use("/api/users", require("./routes/users"));
```

Placement : Entre les routes publiques et les routes protégées.

---

## 🎨 Modifications Frontend

### 1. Service Utilisateur (`user.service.ts`)

Remplacement du mock HTTP par de vrais appels API :

```typescript
private baseUrl = 'https://m1p13mean-onitsoa-anthony.onrender.com/api/users';

// Méthodes :
- getUsers(): Observable<User[]>
- getUserById(id): Observable<any>
- createUser(user): Observable<User>
- updateUser(id, user): Observable<any>
- deleteUser(id): Observable<any>
- toggleActif(id): Observable<any>
- changePassword(id, newPassword): Observable<any>
- getUsersByRole(role): Observable<User[]>
- getUserStats(): Observable<any>
```

**Fallback intégré :** Si le backend est down, les données mock sont utilisées.

### 2. Composant Formulaire (`user-form.component.ts`)

**Nouveautés :**

- `isLoading` - État du chargement
- `errorMessage` - Affichage des erreurs
- `successMessage` - Confirmation de succès
- Gestion complète des erreurs avec messages

**Flux :**

1. Validation du formulaire
2. Appel API (create ou update)
3. Affichage du message de succès/erreur
4. Redirection après 1.5s

### 3. Composant Liste (`user-list.component.ts`)

**Nouvelles fonctionnalités :**

- `isLoading` - Spinner pendant le chargement
- `errorMessage` - Affichage d'erreurs
- `editUser()` - Navigation vers le formulaire edit
- Gestion d'erreurs lors de delete/toggle
- Recharge automatique après action

---

## 🔒 Sécurité

### Authentification JWT

```
Request Header: Authorization: Bearer <token>
```

**Le middleware `auth` :**

1. Extrait le token du header
2. Vérifie la signature avec `JWT_SECRET`
3. Populate `req.user` avec `{ id, role, email }`
4. Retourne 401 si invalide

### Authorization (RBAC)

```javascript
const { admin, boutique, acheteur } = require("./middleware/role");

// Middleware pour chaque rôle
app.use("/api/users", auth, admin, routes);
```

**Routes utilisateurs :** Admin seulement ✅

---

## 🔄 Flux Complet d'une Action

### Créer un utilisateur

```
Frontend                          Backend
   |                                |
   |-- POST /api/users ----------->|
   |   (nom, prenom, email, role)  |
   |                                |
   |<-- 201 {user} ---------------|
   |                                |
   |-- Redirect /users ------------>|
```

### Modifier un utilisateur

```
Frontend                          Backend
   |                                |
   |-- GET /api/users/:id -------->|
   |                                |
   |<-- {user, profile} ----------| (Chargement du form)
   |                                |
   |-- PUT /api/users/:id -------->|
   |   (nom, prenom, email, photo) |
   |                                |
   |<-- {msg: '...', user} ------|
   |                                |
   |-- Redirect /users ------------>|
```

### Supprimer un utilisateur

```
Frontend                          Backend
   |                                |
   |-- DELETE /api/users/:id ----->|
   |                                |
   |<-- {msg: 'Utilisateur supprimé'}|
   |                                |
   |-- Reload list users ----------|
```

---

## 📝 Modèle de Données - User

```typescript
interface User {
  _id: string; // ObjectId MongoDB
  nom: string; // Requis
  prenom: string; // Requis
  email: string; // Unique, requis
  password?: string; // Non retourné par API (sauf register)
  role: "admin" | "boutique" | "acheteur"; // Requis
  photo: string; // URL de la photo
  dateCreation: Date; // Auto generated
  actif: boolean; // true/false
}
```

---

## 🧪 Test de l'Intégration

### 1. Démarrer le Backend

```bash
cd backend
npm start
```

Le serveur doit tourner sur `https://m1p13mean-onitsoa-anthony.onrender.com`

### 2. Démarrer le Frontend

```bash
cd frontend
npm start
```

### 3. Tester les Endpoints

**Avec Postman ou Thunder Client :**

#### GET - Lister les utilisateurs

```
GET https://m1p13mean-onitsoa-anthony.onrender.com/api/users
Header: Authorization: Bearer <token>
```

#### POST - Créer un utilisateur

```
POST https://m1p13mean-onitsoa-anthony.onrender.com/api/users
Content-Type: application/json
Header: Authorization: Bearer <token>

{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@example.com",
  "role": "acheteur",
  "photo": "url",
  "actif": true
}
```

#### PUT - Modifier un utilisateur

```
PUT https://m1p13mean-onitsoa-anthony.onrender.com/api/users/:id
Content-Type: application/json
Header: Authorization: Bearer <token>

{
  "nom": "Dupont",
  "prenom": "Jean",
  "photo": "new-url"
}
```

#### DELETE - Supprimer un utilisateur

```
DELETE https://m1p13mean-onitsoa-anthony.onrender.com/api/users/:id
Header: Authorization: Bearer <token>
```

#### PUT - Toggle Actif

```
PUT https://m1p13mean-onitsoa-anthony.onrender.com/api/users/:id/toggle-actif
Header: Authorization: Bearer <token>
```

---

## ⚠️ Erreurs Courantes

### 1. "Pas de token, autorisation refusée"

**Cause :** Token manquant dans le header Authorization

**Solution :**

```javascript
// Bon
headers: {
  Authorization: `Bearer ${token}`;
}

// Mauvais
headers: {
  Authorization: token;
}
```

### 2. "Token invalide"

**Cause :** Token expiré ou JWT_SECRET incorrect

**Solution :**

- Vérifier que `process.env.JWT_SECRET` est défini
- Vérifier la durée d'expiration (7j par défaut)
- Se reconnecter si expiré

### 3. "Accès réservé aux administrateurs"

**Cause :** L'utilisateur n'a pas le rôle admin

**Solution :**

- Vérifier le rôle dans le token
- Utiliser un compte admin pour tester les routes `/api/users`

### 4. "Cet email est déjà utilisé"

**Cause :** Tentative de créer avec un email existant

**Solution :**

- Utiliser un email unique
- Ou modifier l'email lors de l'update

### 5. Fallback aux données mock

**Cause :** Backend inaccessible

**Behavior :**

- Les opérations continuent avec les données mock
- Les modifications ne sont sauvegardées que localement
- Un message d'erreur s'affiche dans la console

---

## 🎯 Checklist d'Intégration

- ✅ Contrôleur utilisateur créé (`userController.js`)
- ✅ Routes utilisateur créées (`routes/users.js`)
- ✅ Routes enregistrées dans `server.js`
- ✅ Service utilisateur mis à jour (`user.service.ts`)
- ✅ Formulaire mise à jour avec gestion d'erreurs
- ✅ Liste mise à jour avec gestion d'erreurs
- ✅ JWT authentification active
- ✅ RBAC (roles) en place
- ✅ Fallback mock intégré

---

## 📦 Variables d'Environnement

```env
# Backend (.env)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mean-app
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

```typescript
// Frontend (environment.ts)
export const environment = {
  production: false,
  apiUrl: "https://m1p13mean-onitsoa-anthony.onrender.com/api",
};
```

---

## 🚀 Déploiement

Avant de déployer en production :

1. ✅ Changer `JWT_SECRET` avec une clé forte
2. ✅ Configurer CORS pour le domaine frontend
3. ✅ Utiliser HTTPS
4. ✅ Implémenter rate limiting
5. ✅ Ajouter la validation des données côté serveur
6. ✅ Implémenter les logs pour audit
7. ✅ Sauvegarder les credentials de DB

---

## 📚 Ressources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Angular HttpClient](https://angular.io/guide/http)
- [JWT Authentication](https://jwt.io/)

---

**Dernière mise à jour :** Février 2026
