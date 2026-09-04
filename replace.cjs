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
    
    // Backgrounds
    content = content.replace(/bg-slate-950/g, 'bg-slate-50');
    content = content.replace(/bg-slate-900/g, 'bg-white');
    content = content.replace(/bg-slate-800/g, 'bg-slate-100');
    
    // Borders
    content = content.replace(/border-slate-800/g, 'border-slate-200');
    content = content.replace(/border-slate-900/g, 'border-slate-300');
    
    // Text colors
    content = content.replace(/text-slate-50/g, 'text-slate-900');
    content = content.replace(/text-slate-300/g, 'text-slate-700');
    content = content.replace(/text-slate-400/g, 'text-slate-600');
    
    // Special handling for text-white. We only want to replace it if it's NOT inside a red button or green background.
    // Actually, text-white is used heavily. Let's just do a smart regex or replace manually in text.
    // Often it's `text-white`, let's just replace `text-white` with `text-slate-900` EXCEPT when preceded by `bg-red`, `bg-green`, `bg-blue`, `from-red`, etc.
    // A simpler way is to replace all `text-white` and then fix the buttons.
    
    fs.writeFileSync(file, content);
});
console.log('Done replacing backgrounds and slate texts.');
