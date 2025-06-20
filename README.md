# 🛒 BabaPanta - Site E-commerce

Ce projet est une application e-commerce développée avec **React (TypeScript)** pour le frontend et **Spring Boot (Java)** pour le backend.

---

## 🚀 Choix des technologies

### Backend : Spring Boot (Java)
Nous avons choisi **Java avec Spring Boot** car c’est le langage que nous utilisons dans notre environnement professionnel. Spring Boot nous permet de développer rapidement une API REST robuste, bien structurée et évolutive.

### Frontend : React (TypeScript)
Nous avons opté pour **React** car nous sommes familiers avec cette technologie. Elle est largement utilisée pour son approche **modulaire**, **réactive** et son **écosystème riche** qui facilite le développement d'interfaces utilisateur dynamiques.

### Tests
Nous utilisons :
- **JUnit 5**
- **Spring Boot Test**
- **MockMvc**

Cela nous permet de réaliser des **tests d’intégration complets** pour valider le comportement de notre API en simulant des requêtes HTTP.

---

## 🎯 Objectif du projet

Grâce à ce projet, nous souhaitons approfondir les compétences suivantes afin d'être plus à l'aise en entreprise :
- L'écriture de tests automatisés
- La maîtrise du cycle de développement complet (backend + frontend)
- La structuration d’un projet fullstack en conditions proches du réel

---

## 📦 Données utilisées

Nous utilisons ce projet GitLab comme source de données :  
👉 [`https://gitlab.com/maxcouraud272/jsonserver`](https://gitlab.com/maxcouraud272/jsonserver)

Ces données sont servies via `json-server` pour simuler une API de produits et permettre le développement frontend de manière autonome.

---

## 💻 Commandes à connaître

### 📁 Installation des dépendances (frontend)

```bash
npm install
```

---

### 🌐 Lancer le json-server

```bash
npm install -g json-server
json-server data.json --port 3000
```

Le serveur sera accessible à l’adresse suivante :  
👉 [http://localhost:3000](http://localhost:3000)

---

### ⚛️ Lancer le frontend (port 3001)

```bash
$env:PORT=3001; npm start
```

(Windows PowerShell)  
L'application React sera alors accessible ici :  
👉 [http://localhost:3001](http://localhost:3001)

---

### ☕ Lancer le backend Spring Boot

```bash
mvn spring-boot:run
```

---

### 🧪 Exécuter les tests

```bash
mvn test
```

---

## 📘 Remarques

Ce projet est un bon support pour apprendre à :
- Gérer les sessions et le panier côté backend
- Intégrer une API REST dans React
- Travailler avec des outils de test modernes

---
