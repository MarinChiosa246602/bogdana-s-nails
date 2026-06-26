const fs = require('fs');
const https = require('https');
const path = require('path');

const files = [
    'C:/Users/mrmar/.gemini/antigravity/brain/f376e9a3-7fc0-4529-bcdc-04f8b8f3938b/.system_generated/steps/4/content.md',
    'C:/Users/mrmar/.gemini/antigravity/brain/f376e9a3-7fc0-4529-bcdc-04f8b8f3938b/.system_generated/steps/62/content.md'
];

let urls = new Set();
const regex = /https:\/\/(scontent)[^\"\'\s]+\.jpg[^\"\'\s]*/gi;

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            let url = match[0].replace(/&amp;/g, '&').replace(/\\u0026/g, '&');
            // Try to get high res by removing the resize param
            url = url.replace(/stp=[^&]+&/, '');
            urls.add(url);
        }
    } catch(e) { console.error('Error reading', file); }
});

console.log('Found URLs:', urls.size);
const urlArray = Array.from(urls);

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
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
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    
    let count = 1;
    for (const url of urlArray) {
        console.log('Downloading', count);
        try {
            await download(url, path.join(imagesDir, 'ig_profile_' + count + '.jpg'));
            console.log('Saved ig_profile_' + count + '.jpg');
            count++;
        } catch(e) { console.error('Failed', e.message); }
    }
}
run();
