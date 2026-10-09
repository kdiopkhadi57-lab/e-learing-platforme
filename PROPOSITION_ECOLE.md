# Proposition de Plateforme E-Learning
## Solution Numérique d'Enseignement pour Établissements Scolaires

---

**Destinataire :** Direction / Service Informatique  
**Préparé par :** Moussa M. Pthioune  
**Contact :** moussampthioune@gmail.com  
**Date :10 Juillet 2026

---

## 1. Présentation Générale

Nous proposons à votre établissement une **plateforme e-learning complète**, développée sur mesure, conçue pour centraliser l'ensemble des activités pédagogiques numériques : cours en ligne, examens intelligents, classes virtuelles, bibliothèque numérique et suivi de la progression des étudiants.

La solution est **100 % web**, accessible depuis n'importe quel navigateur (ordinateur, tablette, smartphone), sans installation requise côté utilisateur.

---

## 2. Profils Utilisateurs

La plateforme gère trois niveaux d'accès distincts :

| Profil | Rôle |
|--------|------|
| **Administrateur** | Gestion globale des utilisateurs, cours, examens et statistiques |
| **Enseignant** | Création de cours, d'examens, animation de classes virtuelles |
| **Étudiant** | Accès aux cours, examens, bibliothèque et suivi personnel |

### Filières prises en charge
La plateforme supporte nativement les spécialisations suivantes, extensibles selon vos besoins :
- Génie Logiciel
- Réseaux & Télécommunications
- Comptabilité & Gestion
- Sciences de la Santé

---

## 3. Fonctionnalités Détaillées

### 3.1 Gestion des Cours

- **Création de cours** structurés en leçons par les enseignants
- **Upload de contenus** : vidéos, PDF, documents Word, supports de cours
- **Lecteur intégré** pour visionner les vidéos directement dans la plateforme
- **Suivi de progression** par leçon et par étudiant
- **Catalogue public** accessible avant inscription

### 3.2 Examens Intelligents avec Correction par IA

C'est l'une des fonctionnalités les plus innovantes de la plateforme :

- **Modèle d'examen en ligne** : l'enseignant prépare le sujet, importe la liste des étudiants et publie l'examen avec un accès unique par étudiant
- **Gestion des étudiants** : chaque étudiant est associé à son email, son nom et un token d'accès personnel pour sécuriser la passation
- **Sauvegarde des réponses** : chaque réponse est stockée en base de données, avec un historique de soumission et les notes associées à chaque question
- **Archivage texte par étudiant** : les réponses soumises peuvent aussi être exportées ou conservées sous forme de fichiers texte pour chaque étudiant afin de faciliter l'archive, la vérification et le suivi
- **Planification temporelle** : date d'ouverture et de fermeture automatiques
- **Correction automatique par Intelligence Artificielle** (Claude AI — Anthropic) :
  - Les copies numériques sont analysées et notées automatiquement
  - **Correction de copies papier scannées** : un enseignant photographie ou scanne la copie d'un étudiant, l'IA la lit et la corrige avec une note détaillée
  - Rapport de correction envoyé par email à l'étudiant
- **Historique complet** des soumissions et résultats

#### Modèle d’examen en ligne retenu

Le système prend en charge un flux complet d’examen numérique inspiré du modèle suivant :

1. L’enseignant télécharge la liste des étudiants (Excel, PDF, Word, CSV ou texte).
2. Chaque étudiant reçoit un accès défini par son email et un identifiant sécurisé.
3. Le sujet est publié en ligne avec une durée estimée et une date de fermeture.
4. Les étudiants répondent dans le navigateur et leurs réponses sont enregistrées immédiatement en base de données.
5. Les réponses sont conservées aussi sous forme de texte par étudiant pour une traçabilité et un archivage faciles.
6. L’enseignant consulte les résultats, les rapports détaillés et les copies scannées ou numériques.

Ce modèle garantit un suivi rigoureux de la passation, une meilleure sécurité et un stockage fiable des productions d’étudiants.

### 3.3 Classes Virtuelles (Visioconférence Intégrée)

- **Salles de visioconférence intégrées** directement dans la plateforme (aucun outil externe requis)
- Planification des sessions avec date, heure et durée
- **Enregistrement des sessions** : la vidéo et l'audio (microphone + système) sont capturés automatiquement
- Les enregistrements sont stockés dans la plateforme et accessibles aux étudiants dans l'onglet "Passées"
- **Miniature automatique** générée pour chaque enregistrement
- Lecture directe avec bouton Play/Pause intégré (style YouTube)
- Gestion des participants : admission, liste des connectés en temps réel
- Suppression des enregistrements par l'enseignant créateur ou l'administrateur

### 3.4 Assistant Pédagogique IA

- **Chatbot IA intégré** alimenté par Claude AI (Anthropic)
- Répond aux questions des étudiants en français, de manière pédagogique
- Spécialisé sur les matières enseignées : Java, Python, JavaScript, Angular, Spring Boot, SQL, Algorithmes
- Disponible 24h/24 pour accompagner les étudiants

### 3.5 Bibliothèque Numérique

- **Catalogue de livres** et ressources en ligne
- Annotations personnelles sur les documents (surlignage, commentaires)
- Organisation par matière et filière

### 3.6 IDE (Environnement de Développement) Intégré

- **Éditeur de code en ligne** directement dans le navigateur
- Exécution de code côté serveur (Java, Python, JavaScript, etc.)
- Idéal pour les exercices pratiques de programmation
- Pas besoin d'installer un environnement de développement sur les machines des étudiants

### 3.7 Exercices Pratiques et Projets

- Gestion des **exercices** par cours et par niveau
- Suivi des **projets** des étudiants avec état d'avancement
- Génération automatique de **projets Spring Boot** complets (pour les filières informatique)

### 3.8 Outils Complémentaires

| Outil | Description |
|-------|-------------|
| **Éditeur UML** | Création de diagrammes UML directement dans la plateforme |
| **Tableur intégré** | Feuille de calcul en ligne type Excel |
| **Gestion des références** | Bibliographie et ressources externes par matière |

### 3.9 Tableau de Bord & Statistiques

- **Dashboard personnalisé** selon le profil (étudiant, enseignant, admin)
- Statistiques de progression par étudiant et par cours
- Vue globale des inscriptions, examens passés et résultats
- Gestion des utilisateurs avec import en masse depuis un fichier Excel

---

## 4. Architecture Technique

### Stack Technologique

| Composante | Technologie |
|------------|-------------|
| **Frontend** | Angular 17 (TypeScript) |
| **Backend** | Spring Boot 3 (Java 17) |
| **Base de données** | MySQL 8 |
| **Authentification** | JWT (JSON Web Token) |
| **Visioconférence** | Jitsi Meet (open source) |
| **IA** | Claude AI — Anthropic |
| **Emails** | SMTP Gmail / serveur mail configurable |
| **Déploiement** | Docker / Kubernetes |

### Sécurité

- Authentification sécurisée avec tokens JWT (access + refresh)
- Vérification d'email à l'inscription
- Réinitialisation de mot de passe par email
- Contrôle d'accès par rôle (Admin / Enseignant / Étudiant)
- Protection CSRF et CORS configurée

### Déploiement

La plateforme est livrée entièrement **conteneurisée** (Docker Compose) pour un déploiement simple sur votre infrastructure :

```
docker-compose up
```

Des fichiers Kubernetes sont également fournis pour un hébergement en cluster.

---

## 5. Processus d'Intégration Proposé

| Phase | Durée estimée | Description |
|-------|--------------|-------------|
| **Phase 1** — Installation | 1 semaine | Déploiement sur votre serveur, configuration du domaine et des emails |
| **Phase 2** — Paramétrage | 1 semaine | Création des filières, import des utilisateurs, formation des admins |
| **Phase 3** — Formation | 2 jours | Formation des enseignants à l'utilisation de la plateforme |
| **Phase 4** — Lancement | Jour J | Ouverture aux étudiants, support en ligne |
| **Phase 5** — Suivi | 1 mois | Corrections, ajustements, nouvelles fonctionnalités |

---

## 6. Avantages pour votre Établissement

- **Réduction du papier** : examens, corrections et communications entièrement numériques
- **Gain de temps** pour les enseignants grâce à la correction automatique par IA
- **Accessibilité** : les étudiants accèdent aux cours depuis chez eux à tout moment
- **Centralisation** : un seul outil pour les cours, examens, visioconférence et bibliothèque
- **Évolutivité** : la plateforme peut être enrichie de nouvelles fonctionnalités à la demande
- **Souveraineté des données** : hébergement sur vos propres serveurs, aucune donnée chez un tiers

---

## 7. Démonstration

Une démonstration complète de la plateforme peut être organisée à votre convenance.

**Contact :**  
Moussa M. Pthioune  
Email : moussampthioune@gmail.com

---

*Document confidentiel — Proposition commerciale destinée à l'établissement scolaire destinataire.*
