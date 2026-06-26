const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchProfileImage(username, filename) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.instagram.com',
            port: 443,
            path: `/${username}/`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        };

        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Find og:image
                const match = data.match(/<meta property="og:image" content="([^"]+)"/);
                if (match && match[1]) {
                    let imgUrl = match[1].replace(/&amp;/g, '&');
                    // Try to remove resize params to get a larger image
                    imgUrl = imgUrl.replace(/stp=[^&]+&/, '');
                    console.log(`Found image for ${username}: ${imgUrl.substring(0, 50)}...`);
                    
                    const dest = path.join('c:/Users/mrmar/Desktop/bogdana nails/images', filename);
                    const file = fs.createWriteStream(dest);
                    https.get(imgUrl, (imgRes) => {
                        imgRes.pipe(file);
                        file.on('finish', () => {
                            file.close(() => {
                                console.log(`Saved ${filename}`);
                                resolve();
                            });
                        });
                    }).on('error', err => reject(err));
                } else {
                    console.error(`Could not find og:image for ${username}`);
                    resolve();
                }
            });
        }).on('error', err => reject(err));
    });
}

async function run() {
    await fetchProfileImage('bogdana.zosim', 'bogdana_profile.jpg');
    await fetchProfileImage('nails_bogdana_', 'nails_profile.jpg');
}

run();
