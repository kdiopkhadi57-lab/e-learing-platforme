# Kubernetes Configuration - elearning-platform

Cette directory contient les fichiers de configuration Kubernetes pour le déploiement de l'application elearning-platform avec MySQL.

---

## 📋 Description des ressources Kubernetes

### 1. **mysql-secret.yml** - Secret
Stocke les informations sensibles nécessaires pour MySQL en tant que Secret Kubernetes.

**Contient:**
- `root-password` : Mot de passe de l'utilisateur root MySQL
- `user-password` : Mot de passe de l'utilisateur elearning

**Rôle:** Protéger les données sensibles et les injecter de manière sécurisée dans les conteneurs via variables d'environnement.

```yaml
Ressource: Secret
Type: Opaque
Namespace: default
```

### 2. **mysql-configmap.yml** - ConfigMap
Contient la configuration non-sensible pour MySQL et l'application Spring Boot.

**Contient:**
- `MYSQL_DATABASE` : Nom de la base de données (elearning_db)
- `MYSQL_USER` : Utilisateur MySQL (elearning)
- `mysql-init.sql` : Script SQL d'initialisation

**Rôle:** Gérer les variables de configuration et scripts d'initialisation, séparés des données sensibles.

```yaml
Ressource: ConfigMap
Namespace: default
```

### 3. **mysql-deployment.yml** - Deployment + Service
Définit le déploiement et l'exposition de MySQL en Kubernetes.

**Deployment:**
- Image: `mysql:8.0`
- Replicas: 1
- Container: mysql
- Expose le port 3306
- Utilise les ConfigMap et Secret pour les variables d'environnement
- Volume: stockage temporaire en `emptyDir`

**Service:**
- Type: `ClusterIP`
- Nom: `mysql`
- Port: 3306
- Rend MySQL accessible aux autres Pod internes du cluster

```yaml
Ressources: Deployment + Service
Namespace: default
```

---

## 🚀 Guide de déploiement

### Prérequis
- Cluster Kubernetes actif (minikube, Docker Desktop, EKS, AKS, GKE, etc.)
- `kubectl` configuré et connecté au cluster
- Namespace `default` disponible

### Étapes de déploiement

**1. Créer le Secret (IMPORTANT: Faire en premier)**
```bash
kubectl apply -f k8s/mysql-secret.yml
```
⚠️ Le Secret doit être créé en premier car le Deployment en dépend.

**2. Créer la ConfigMap**
```bash
kubectl apply -f k8s/mysql-configmap.yml
```

**3. Déployer MySQL**
```bash
kubectl apply -f k8s/mysql-deployment.yml
```

### Option: Déploiement en une seule commande
```bash
kubectl apply -f k8s/
```
Cette commande appliquera tous les fichiers du dossier k8s/ dans le bon ordre (Secret en premier).

---

## ✅ Vérification du déploiement

### Vérifier les ressources créées
```bash
# Lister les Secrets
kubectl get secrets

# Lister les ConfigMaps
kubectl get configmaps

# Lister les Deployments
kubectl get deployments

# Lister les Services
kubectl get services

# Lister les Pods
kubectl get pods

# Vérifier le statut détaillé
kubectl describe deployment mysql-deployment
kubectl describe service mysql
```

### Vérifier que MySQL est prêt
```bash
# Attendre que le Pod soit en état Running
kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s

# Vérifier les logs
kubectl logs -l app=mysql

# Vérifier les variables d'environnement injectées
kubectl exec -it <pod-name> -- env | grep MYSQL
```

---

## 🔌 Connexion à MySQL

### 1. Accès depuis l'intérieur du cluster (depuis d'autres Pods)
```
Host: mysql
Port: 3306
User: elearning
Password: elearning123
Database: elearning_db
```

### 2. Accès local via port-forward
```bash
# Créer un tunnel vers MySQL
kubectl port-forward svc/mysql 3306:3306

# Dans un autre terminal, se connecter
mysql -h localhost -u elearning -p elearning_db
```

### 3. Accès via kubectl exec
```bash
# Se connecter directement dans le Pod MySQL
kubectl exec -it <pod-name> -- mysql -u elearning -p elearning_db
```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│   Kubernetes Cluster (namespace:    │
│           default)                  │
│                                     │
│  ┌──────────────────────────────┐   │
│  │      Secret (mysql-secret)    │   │
│  │  - root-password              │   │
│  │  - user-password              │   │
│  └──────────────────────────────┘   │
│           ↓                          │
│  ┌──────────────────────────────┐   │
│  │   ConfigMap (mysql-config)    │   │
│  │  - MYSQL_DATABASE             │   │
│  │  - MYSQL_USER                 │   │
│  │  - init scripts               │   │
│  └──────────────────────────────┘   │
│           ↓                          │
│  ┌──────────────────────────────┐   │
│  │  Deployment (mysql)           │   │
│  │  ┌────────────────────────┐   │   │
│  │  │  Pod (mysql-xxxxx)     │   │   │
│  │  │  ┌──────────────────┐   │   │   │
│  │  │  │ Container: mysql │   │   │   │
│  │  │  │ Image: mysql:8.0 │   │   │   │
│  │  │  │ Port: 3306       │   │   │   │
│  │  │  └──────────────────┘   │   │   │
│  │  └────────────────────────┘   │   │
│  └──────────────────────────────┘   │
│           ↓                          │
│  ┌──────────────────────────────┐   │
│  │   Service (mysql)             │   │
│  │   Type: ClusterIP             │   │
│  │   Port: 3306                  │   │
│  └──────────────────────────────┘   │
│           ↓                          │
│  (Accessible par d'autres Pods)     │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚙️ Configuration détaillée

### Variables d'environnement injectées
| Variable | Source | Valeur |
|----------|--------|--------|
| `MYSQL_DATABASE` | ConfigMap | elearning_db |
| `MYSQL_USER` | ConfigMap | elearning |
| `MYSQL_PASSWORD` | Secret | elearning123 |
| `MYSQL_ROOT_PASSWORD` | Secret | root |

### Ports
- **Interne (cluster)**: 3306 (via Service `mysql`)
- **Externe (host)**: Accessible via port-forward uniquement

---

## 🔒 Notes de sécurité et production

### Développement
✓ Configuration actuelle convient pour le développement local et testing.

### Production - Points importants à modifier

1. **Stockage des données** ⚠️
   - Actuellement: `emptyDir` (données perdues au redémarrage)
   - À faire: Utiliser `PersistentVolumeClaim` avec stockage durable

2. **Gestion des secrets** ⚠️
   - Actuellement: Secret stocké en plain text
   - À faire: Utiliser Sealed Secrets, HashiCorp Vault, ou AWS Secrets Manager

3. **Réplicas** ⚠️
   - Actuellement: 1 seule instance
   - À faire: Utiliser MySQL en haute disponibilité (cluster, replication)

4. **Ressources** ⚠️
   - Ajouter des `requests` et `limits` pour CPU/mémoire
   - Exemple: `requests: {cpu: 100m, memory: 256Mi}`

5. **Namespace** ⚠️
   - Créer un namespace dédié: `kubectl create namespace elearning`
   - Modifier `namespace: elearning` dans les manifests

### Exemple pour production
```yaml
# Ajouter au Deployment
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"

# Remplacer emptyDir par PersistentVolumeClaim
volumeClaimTemplates:
- metadata:
    name: mysql-storage
  spec:
    accessModes: [ "ReadWriteOnce" ]
    resources:
      requests:
        storage: 10Gi
```

---

## 🗑️ Suppression des ressources

Pour nettoyer et supprimer toutes les ressources:

```bash
# Supprimer tous les manifests du dossier
kubectl delete -f k8s/

# Ou supprimer individuellement
kubectl delete secret mysql-secret
kubectl delete configmap mysql-config
kubectl delete deployment mysql-deployment
kubectl delete service mysql
```

⚠️ **ATTENTION**: Cela supprimera toutes les données stockées dans `emptyDir`.

---

## 📞 Dépannage

### Le Pod ne démarre pas
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Erreur: "Error pulling image"
Vérifier la connectivité réseau ou qu'une image MySQL v8.0 est disponible.

### Erreur: "Secret mysql-secret not found"
Vérifier que le Secret a été créé:
```bash
kubectl get secrets
```

### Impossible de se connecter à MySQL
```bash
# Vérifier que le Service existe
kubectl get svc mysql

# Vérifier que le Pod est en Running
kubectl get pods

# Port-forward et tester
kubectl port-forward svc/mysql 3306:3306
mysql -h localhost -u elearning -p elearning_db
```
