# 🎓 ELearning Platform

Une plateforme e-learning complète construite avec **Spring Boot 3** et **Angular 17**, intégrant un IDE en ligne, des classes virtuelles, un assistant IA, et un système de progression complet.

---

## 🗂️ Structure du projet

```
elearning-platform/
├── backend/           → Spring Boot 3.2 (Java 17)
└── frontend/          → Angular 17 (Bootstrap 5)
```

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 🔐 **Auth email** | Inscription, vérification email, connexion JWT, reset mot de passe |
| 👤 **Profils** | Étudiant / Professeur / Admin |
| 📚 **Cours** | Vidéos, PDF, Exercices de code, Quiz — 7 cours démo |
| � **Examens en ligne** | Sujet, liste des étudiants, accès unique par étudiant, réponses enregistrées en base |
| 💾 **Archivage des réponses** | Sauvegarde des réponses en base de données et conservation en texte par étudiant |
| �💻 **IDE intégré** | Java, Python, JavaScript, SQL — anti copier-coller |
| 📈 **Progression** | Suivi par leçon et par cours, statistiques détaillées |
| 🎥 **Classes virtuelles** | Sessions live avec lien Zoom/Meet |
| 🤖 **Assistant IA** | Powered by Claude API (claude-sonnet-4) |
| 👨‍🏫 **Espace Professeur** | Création et gestion de cours, publication |

---

## 🚀 Installation

### Prérequis
- Java 17+, Maven 3.8+
- Node.js 18+, Angular CLI 17+
- PostgreSQL 15+

### Base de données

```sql
CREATE DATABASE elearning_db;
```

### Backend

```bash
cd backend
# Configurez src/main/resources/application.properties (BDD + mail SMTP)
mvn spring-boot:run
```

L'API démarre sur **http://localhost:8080**
Swagger UI : **http://localhost:8080/swagger-ui.html**

### Frontend

```bash
cd frontend
npm install
ng serve
```

L'app démarre sur **http://localhost:4200**

---

## 👤 Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| 🔑 Admin | admin@elearning.com | Admin@2024 |
| 👨‍🏫 Professeur | teacher@elearning.com | Teacher@2024 |
| 👨‍🎓 Étudiant | student@elearning.com | Student@2024 |

---

## 🔧 Configuration

### Mail (Gmail)
Dans `application.properties` :
```properties
spring.mail.username=votre@gmail.com
spring.mail.password=votre-app-password  # Mot de passe d'application Gmail
```

### API Claude (IA)
Dans `ai-assistant.component.ts`, l'appel API est déjà configuré.
Aucune clé API nécessaire côté frontend — les appels passent via l'API Anthropic.

---

## 🗄️ Architecture Backend

```
com.elearning/
├── config/          → Security, WebSocket, CORS, DataInitializer
├── controller/      → Auth, Course, Progress, IDE, VirtualClass, User
├── dto/             → Request/Response DTOs
├── entity/          → User, Course, Lesson, Progress, VirtualClass, CodeExecution
├── exception/       → GlobalExceptionHandler
├── repository/      → JPA Repositories
├── security/        → JWT Utils, Auth Filter, UserDetailsService
└── service/         → AuthService, EmailService, CodeExecutionService
```

## 🧩 Architecture Frontend

```
src/app/
├── core/
│   ├── models/      → User, Course, Lesson, Progress
│   ├── services/    → AuthService, CourseService, ProgressService, IdeService
│   ├── guards/      → authGuard, teacherGuard
│   └── interceptors → JWT, Error handlers
├── features/
│   ├── auth/        → Login, Register, Verify Email, Forgot Password
│   ├── dashboard/   → Tableau de bord avec stats et progression
│   ├── courses/     → Liste, Détail, Player, Mon Apprentissage
│   ├── ide/         → IDE en ligne (Java, Python, JS, SQL) — anti-paste
│   ├── virtual-class→ Gestion des sessions live
│   ├── ai-assistant → Chat avec Claude AI
│   ├── profile/     → Profil utilisateur + changement mot de passe
│   └── admin/       → Gestion des cours (Professeur)
└── shared/
    └── components/  → Navbar, Sidebar
```

---

## 🔒 Sécurité IDE

- Copier-coller désactivé (événement `paste` bloqué)
- Menu contextuel désactivé
- Timeout d'exécution : 10 secondes
- Imports système bloqués (File, Process, Runtime, os.system...)
- Sandboxing par répertoire temporaire avec cleanup automatique

Comptabilité Générale & Analytique — Licence 3

Partie A — Comptabilité générale

QCM 1 — Le bilan
Le bilan d’une entreprise présente principalement :
A. Les produits et les charges de l’exercice
B. Le patrimoine de l’entreprise à une date donnée
C. Les flux de trésorerie uniquement
D. Le chiffre d’affaires mensuel

QCM 2 — Équilibre du bilan
La relation fondamentale du bilan est :
A. Actif = Produits − Charges
B. Actif = Passif
C. Passif = Charges + Produits
D. Actif + Passif = Résultat

QCM 3 — Immobilisation
Lequel des éléments suivants constitue généralement une immobilisation corporelle ?
A. Stock de marchandises
B. Créance client
C. Machine industrielle
D. Banque

QCM 4 — Achat à crédit
Une entreprise achète des marchandises pour 1 000 000 FCFA HT à crédit. Quelle écriture est correcte concernant l’achat et la dette fournisseur ?
A. Débit Achats 1 000 000 / Crédit Fournisseurs 1 000 000
B. Débit Fournisseurs 1 000 000 / Crédit Achats 1 000 000
C. Débit Banque 1 000 000 / Crédit Achats 1 000 000
D. Débit Achats 1 000 000 / Crédit Banque 1 000 000


QCM 5 — TVA
La TVA collectée correspond à :
A. La TVA payée aux fournisseurs
B. La TVA facturée aux clients
C. La TVA sur les immobilisations uniquement
D. Une charge définitive pour l’entreprise


QCM 6 — Amortissement
L’amortissement d’une immobilisation permet principalement :
A. D’augmenter la valeur de l’immobilisation
B. De constater la consommation progressive des avantages économiques de l’immobilisation
C. De constater une entrée de trésorerie
D. D’augmenter automatiquement le résultat


QCM 7 — Résultat
Le résultat comptable d’un exercice est généralement déterminé par :
A. Actif − Passif
B. Produits − Charges
C. Charges − Produits
D. Capitaux propres − Dettes


QCM 8 — Créance client
Lorsqu’une entreprise vend des marchandises à crédit :
A. Sa créance client augmente
B. Sa dette fournisseur augmente
C. Sa trésorerie augmente immédiatement
D. Ses charges diminuent nécessairement


QCM 9 — Provision
Une provision est notamment constatée lorsqu’il existe :
A. Une certitude absolue de réaliser un bénéfice
B. Un risque ou une obligation dont l’échéance ou le montant présente une incertitude
C. Une augmentation certaine de la trésorerie
D. Un apport en capital


QCM 10 — Compte de résultat
Le compte de résultat permet principalement de connaître :
A. La situation patrimoniale à une date précise
B. La performance économique sur une période
C. Le montant exact des stocks physiques uniquement
D. Le montant du capital social uniquement


Partie B — Comptabilité analytique

QCM 11 — Objectif
La comptabilité analytique sert principalement à :
A. Déterminer uniquement la TVA
B. Analyser les coûts et la rentabilité des produits, activités ou centres
C. Remplacer totalement la comptabilité générale
D. Enregistrer uniquement les opérations bancaires


QCM 12 — Charges directes
Une charge directe est une charge :
A. Qui concerne nécessairement toute l’entreprise
B. Qui peut être directement affectée à un produit ou objet de coût
C. Qui ne peut jamais être calculée
D. Qui correspond uniquement aux salaires


QCM 13 — Charges indirectes
Une charge indirecte :
A. Peut toujours être affectée directement à un seul produit sans calcul
B. Nécessite généralement une répartition entre plusieurs objets de coût
C. Est toujours une charge variable
D. Est toujours une charge fixe


QCM 14 — Coût d’achat
Le coût d’achat d’une matière première comprend généralement :
A. Prix d’achat + frais d’approvisionnement liés à l’achat
B. Prix de vente − marge
C. Charges administratives uniquement
D. Coût de production + résultat


QCM 15 — Coût de production
Le coût de production comprend notamment :
A. Les charges liées à la fabrication du produit
B. Uniquement le prix d’achat des matières
C. Uniquement les frais financiers
D. Uniquement les frais commerciaux


QCM 16 — Coût de revient
Le coût de revient correspond généralement :
A. Au coût d’achat uniquement
B. Au coût de production uniquement
C. À l’ensemble des coûts supportés jusqu’à la mise à disposition ou vente du produit
D. Au chiffre d’affaires


QCM 17 — Charges fixes
Une charge fixe est une charge qui :
A. Varie exactement avec chaque unité produite
B. Reste globalement stable dans une certaine plage d’activité
C. Est toujours nulle lorsque la production augmente
D. Est toujours une charge directe


QCM 18 — Charges variables
Une charge variable :
A. Évolue en fonction du niveau d’activité selon une relation donnée
B. Ne dépend jamais du niveau d’activité
C. Est toujours indirecte
D. Est toujours une charge financière


QCM 19 — Marge sur coût variable
La marge sur coût variable est calculée par :
A. Chiffre d’affaires − coûts variables
B. Chiffre d’affaires − coûts fixes
C. Coûts fixes − coûts variables
D. Résultat + chiffre d’affaires


QCM 20 — Seuil de rentabilité
Le seuil de rentabilité correspond au niveau de chiffre d’affaires pour lequel :
A. L’entreprise réalise son bénéfice maximum
B. Le résultat est nul
C. Les charges variables sont nulles
D. Les charges fixes sont nulles


🧮 Partie C — QCM avec calculs
QCM 21
Une entreprise réalise un chiffre d’affaires de 20 000 000 FCFA. Ses charges variables sont de 12 000 000 FCFA.
La marge sur coût variable est de :
A. 8 000 000 FCFA
B. 12 000 000 FCFA
C. 20 000 000 FCFA
D. 32 000 000 FCFA


QCM 22
Une entreprise possède :
- Chiffre d’affaires : 30 000 000 FCFA
- Charges variables : 18 000 000 FCFA
- Charges fixes : 8 000 000 FCFA
Le résultat est :
A. 4 000 000 FCFA
B. 8 000 000 FCFA
C. 12 000 000 FCFA
D. 20 000 000 FCFA


QCM 23
Une entreprise réalise un chiffre d’affaires de 40 000 000 FCFA et une marge sur coût variable de 16 000 000 FCFA.
Le taux de marge sur coût variable est :
A. 20 %
B. 30 %
C. 40 %
D. 60 %


QCM 24
Une entreprise a des charges fixes de 10 000 000 FCFA et un taux de marge sur coût variable de 25 %.
Son seuil de rentabilité en chiffre d’affaires est :
A. 2 500 000 FCFA
B. 25 000 000 FCFA
C. 40 000 000 FCFA
D. 50 000 000 FCFA


QCM 25
Une entreprise vend un produit 10 000 FCFA l’unité. Le coût variable unitaire est de 6 000 FCFA.
La marge sur coût variable unitaire est :
A. 2 000 FCFA
B. 4 000 FCFA
C. 6 000 FCFA
D. 16 000 FCFA

git filter-branch --force --index-filter "git rm --cached --ignore-unmatch --quiet 'target/elearning-backend-1.0.0.jar'" --prune-empty -- --all
git push --force-with-lease origin master

#bikb ptdd gvwe swvy itecom app password
 1. Solution durable (recommandée) : enregistrer les vidéos comme fichiers sur un volume Railway, et non dans MySQL. L'envoi se ferait en fichier (multipart, sans base64), avec lecture en streaming. Cela modifie le backend et le frontend. Votre projet a déjà des volumes Railway, mais ils sont détachés : il faudrait en attacher un au service backend.
