const fs = require('fs');
const https = require('https');
const path = require('path');

const files = [
    {
        path: 'C:/Users/mrmar/.gemini/antigravity/brain/f376e9a3-7fc0-4529-bcdc-04f8b8f3938b/.system_generated/steps/107/content.md',
        dest: 'bogdana_profile.jpg'
    },
    {
        path: 'C:/Users/mrmar/.gemini/antigravity/brain/f376e9a3-7fc0-4529-bcdc-04f8b8f3938b/.system_generated/steps/108/content.md',
        dest: 'nails_profile.jpg'
    }
];

function downloadProxy(url, dest) {
    return new Promise((resolve, reject) => {
        const proxyUrl = 'https://wsrv.nl/?url=' + encodeURIComponent(url);
        const file = fs.createWriteStream(dest);
        https.get(proxyUrl, (response) => {
            if(response.statusCode !== 200) {
                return reject(new Error('Status: ' + response.statusCode));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    const imagesDir = 'c:/Users/mrmar/Desktop/bogdana nails/images';
    
    for (const item of files) {
        try {
            const content = fs.readFileSync(item.path, 'utf8');
            const match = content.match(/<meta property="og:image" content="([^"]+)"/);
            if (match && match[1]) {
                let imgUrl = match[1].replace(/&amp;/g, '&').replace(/\\u0026/g, '&');
                // Keep the exact URL as is, do not strip stp= to avoid invalidating the signature
                
                console.log(`Downloading via proxy: ${item.dest}`);
                await downloadProxy(imgUrl, path.join(imagesDir, item.dest));
                console.log(`Saved ${item.dest}`);
            } else {
                console.log(`No og:image found in ${item.path}`);
            }
        } catch(e) { console.error('Failed', e.message); }
    }
}
run();
