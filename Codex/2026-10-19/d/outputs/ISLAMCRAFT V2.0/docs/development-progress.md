# ISLAMCRAFT V2.0

## État

Développement en cours.

Arborescence verrouillée.

---

# Progression

## Core

✅ 100 %

## Engine

✅ 100 %

## World

✅ 100 %

## Entities

✅ 100 %

## Gameplay

### Movement

✅ 100 %

### Interactions

✅ 100 %

### Quiz

✅ 100 %

### Loot

✅ 100 %

### Progression

✅ 100 %

### Score

✅ 100 %

### State

✅ ClientStateMachine.js

✅ LobbyState.js

✅ PlayingState.js

✅ RestartState.js

⬜ VictoryState.js

---

# Architecture actuelle

RestartState est responsable :

- de l'écran de redémarrage ;
- de la réinitialisation des systèmes de jeu ;
- du retour au lobby ;
- de l'émission des événements de réinitialisation.

Il coopère avec :

- ClientStateMachine ;
- UIManager ;
- EventBus ;
- World ;
- PlayerManager ;
- EntityManager ;
- ScoreController ;
- ProgressionController.

---

# Prochain fichier

client/src/gameplay/state/VictoryState.js

---

# Roadmap

### Network

✅ ClientPrediction.js

✅ ClientReconciliation.js

✅ ConnectionManager.js

✅ InputBuffer.js

✅ NetworkClock.js

✅ NetworkManager.js

✅ NetworkMetrics.js

✅ RemoteExtrapolation.js

✅ RemoteInterpolation.js

✅ SnapshotBuffer.js

⬜ SocketClient.js

---

Prochain fichier :

client/src/network/SocketClient.js