## ISLAMCRAFT v2.0

Jeu Three.js servi par Express avec Socket.IO. Le serveur sert le client, les données du quiz et un point de contrôle `GET /health`.

### Lancer localement

```powershell
npm ci
npm start
```

Ouvrir ensuite `http://localhost:3000`.

### Déployer avec Render

Créer un **Web Service** depuis le dépôt Git qui contient ce dossier, avec :

- Runtime : Node
- Build command : `npm ci`
- Start command : `npm start`
- Health check path : `/health`
- Node : 22 ou supérieur

Render fournit automatiquement la variable `PORT`, déjà utilisée par le serveur. Ne pas versionner `node_modules`.
