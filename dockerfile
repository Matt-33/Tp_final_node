FROM node:20-alpine

# Dossier de travail
WORKDIR /usr/src/app

# Copie package et lock
COPY package*.json ./

# Install des deps
RUN npm install

# Copie du reste
COPY . .

# Port exposé
EXPOSE 3000

# Commande par défaut
CMD ["npm", "run", "dev"]
