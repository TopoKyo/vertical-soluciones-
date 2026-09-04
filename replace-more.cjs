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
    
    content = content.replace(/from-slate-950/g, 'from-slate-50');
    content = content.replace(/via-slate-950/g, 'via-slate-50');
    content = content.replace(/bg-slate-900\/20/g, 'bg-white/20');
    content = content.replace(/bg-slate-900\/50/g, 'bg-white/50');
    content = content.replace(/bg-slate-900\/90/g, 'bg-white/90');
    content = content.replace(/bg-slate-950\/90/g, 'bg-slate-50/90');
    
    // Replace text-white with text-slate-900 globally FIRST
    content = content.replace(/text-white/g, 'text-slate-900');
    
    // Then fix specific buttons/icons where text-white is needed:
    // red buttons: text-slate-900 in bg-red-600 -> text-white
    content = content.replace(/bg-red-600([^>]*?)text-slate-900/g, 'bg-red-600$1text-white');
    content = content.replace(/bg-red-500([^>]*?)text-slate-900/g, 'bg-red-500$1text-white');
    content = content.replace(/bg-green-500([^>]*?)text-slate-900/g, 'bg-green-500$1text-white');
    
    // selection styling in App.tsx
    content = content.replace(/selection:bg-red-500 selection:text-slate-900/g, 'selection:bg-red-500 selection:text-white');
    
    fs.writeFileSync(file, content);
});
console.log("Done replace-more");
