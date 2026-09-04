const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // We want to keep text-white if it's part of a red/green button, or specific sections like the hero banner text.
    // The hero banner text has text-white. If the whole theme is white, maybe the hero banner has an image background?
    // Let's check Home.tsx hero background.
    
    fs.writeFileSync(file, content);
});
