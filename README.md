# 🏥 MedFlow — Application de Gestion de Clinique

MedFlow est une application web complète de gestion médicale, développée avec **Next.js 14**, **TypeScript**, **Prisma ORM**, et **PostgreSQL**.  
Elle permet la gestion des cliniques, du personnel médical, des patients, des services, des rendez-vous, et plus encore.

---

## 🚀 Stack Technique

| Technologie | Description |
|-------------|-------------|
| **Next.js 14 (App Router)** | Framework React moderne avec rendu côté serveur |
| **TypeScript** | Typage fort et sécurité du code |
| **Tailwind CSS** | Design rapide et responsive |
| **NextAuth.js** | Authentification sécurisée avec sessions et JWT |
| **Prisma ORM** | ORM pour PostgreSQL (gestion des modèles et migrations) |
| **PostgreSQL** | Base de données relationnelle principale |
| **React Hook Form + Zod** | Validation des formulaires côté client |

---

## 🧩 Fonctionnalités

### 🧭 Sprint 1 — Authentification & Onboarding & Dashboard
- Inscription / Connexion avec **NextAuth**
- Création de **clinique** via un **onboarding multi-étapes**
- Ajout initial de **services**
- Configuration de la **clinique**
- Invitation de **membres de l’équipe**
- **Dashboard** avec sidebar (Staff, Services, Settings)

### 👥 Sprint 2 — Gestion Patients / Services / Rendez-vous
- CRUD complet pour les **patients**
- CRUD complet pour les **services**
- Gestion des **rendez-vous** (prise, liste, statut)
- Liaison entre patients, services et cliniques

### 🩺 Sprint 3 — Consultations & Ordonnances
- Saisie de **consultations médicales**
- Génération d’**ordonnances en PDF**
- Historique des consultations par patient

### 💳 Sprint 4 — Facturation & Paiement
- Génération de **factures** à partir des consultations
- Gestion des **paiements**
- Portail **patient** pour voir ses factures et rendez-vous

### 📊 Sprint 5 — Bonus & Analytics
- **Tableaux de bord analytiques**
- **Calendrier avancé**
- **Notifications email**

---

## ⚙️ Installation & Lancement

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/ton-projet/medflow.git
cd medflow
````
### 2️⃣  Installer les dépendances
````
npm install
````
### 3️⃣ Configurer les variables d’environnement

````
DATABASE_URL="postgresql://user:password@localhost:5432/medflow"
NEXTAUTH_SECRET="ta_secret_key"
NEXTAUTH_URL="http://localhost:3000"

````
#### 4️⃣ Lancer le serveur
````
npm run dev

