# Image de base Node.js
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste du code
COPY . .

# Exposer le port (celui de ton .env ou 3000 par défaut)
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]