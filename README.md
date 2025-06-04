Sujet de TP Final : Création d'une API RESTful en TS
comments (4 routes - 4 controllers - 1 model - 1 schema)
posts (4 routes - 4 controllers - 1 model - 1 schema)
users (4 routes - 4 controllers - 1 model - 1 schema)
category (4 routes - 4 controllers - 1 model - 1 schema)
Objectif
Votre objectif est de créer une API RESTful. Vous devrez cependant appliquer à ce même projet les notions vues cette semaine, à savoir TypeScript, l'usage d'une base de données et son intégration dans l'architecture MVC (et ce que ca implique, à savoir les variables d'environnements).

Instructions générales
Choix du sujet : Vous êtes libre de choisir le thème de votre API. Quelques exemples de thèmes possibles incluent un système de gestion de bibliothèque, un service de réservation (hôtels, restaurants), ou encore une application de gestion de tâches. Cependant, il est strictement interdit de choisir un blog pour ce TP. Tout simplement car nous l'avons déjà fait et que cela ne serait pas très intéressant de refaire la même chose.

API RESTful : Ce qui implique des méthodes HTTP appropriées, des routes claires, des réponses API normalisées (càd que la réponse API retournera pas des fois tel propriété, des fois une autre propriété, etc...). De plus, cela comprend l'utilisation des méthodes HTTP appropriées pour chaque action, le maintien d'un état sans état pour les requêtes et des réponses avec des codes de statut HTTP adéquats (il doit y avoir un POST PUT GET DELETE pour chacun des blocs, dans la limite du raisonnable, un CRUD complet)

Architecture MVC : Structurez votre application en suivant le modèle M_V_C. Cela implique de séparer clairement tout proprement: le Model pour le CRUD, le Controller pour la logique métier, les Routes qui font appel au controller, et la View bah pas de View n'abusons pas.

Base de données : Vous devrez intégrer une base de données à votre application. Vous devrez utiliser un ORM pour gérer les interactions avec la base de données. Vous devrez également utiliser des variables d'environnement pour stocker les informations de connexion à la base de données. (Vous avez compris que je parle de Drizzle, avec sa configuration, son installation, ses scripts...)

Middlewares : Intégrez au moins deux middlewares personnalisés qui traitent des aspects tels que la journalisation des requêtes, la gestion des erreurs, la vérification de l'authentification, etc...

Authentification : Vous devrez ajouter un système d'authentification à votre API à l'aide de JWT. Vous devrez également gérer les autorisations pour les différentes routes de votre API.

Validation : Vous devrez utiliser zod pour valider les données entrantes dans votre API. Vous devrez également gérer les erreurs de validation et renvoyer des réponses appropriées (2 schémas au total de validations sont OK)

La qualité de votre code Typescript : Vous devrez utiliser TypeScript pour l'ensemble de votre application. ATTENTION !! L'absence de TypeScript est pratiquement éliminatoire. Vous devez utiliser TypeScript pour ce TP.

Évaluation
Votre projet sera évalué sur les critères suivants :

Respect de l'architecture MVC
Conformité aux principes RESTful
Qualité et organisation du code TYPESCRIPT
Utilisation d'une base de données avec ORM
Utilisation de variables d'environnement
Authentification avec JWT
Validation des données avec zod
Utilisation de middlewares
Livrables
Code source complet de l'application dans un repository Github / Gitlab / Bitbucket..... Aucun repository Git = 0. De même pour un commit unique réalisé au dernier moment. Utilisez des commits réguliers pour montrer votre progression.
Fichier README.md pour expliquer un peu votre projet, comment l'installer et l'utiliser.
Bonus
Frontend : Si vous souhaitez ajouter un frontend à votre application, vous pouvez le faire. Cela peut être une simple page HTML ou une application React, Angular, Vue, etc.
Tout autre bonus que vous jugerez utile pour votre application
Ce TP est conçu pour tester votre capacité à créer une application backend bien structurée. Prenez votre temps pour planifier et développer une solution robuste et bien conçue.

Bonne chance ! ;)
