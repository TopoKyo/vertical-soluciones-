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
    
    // Fix the broken class replacements
    content = content.replace(/text-slate-9000/g, 'text-slate-500');
    content = content.replace(/text-white0/g, 'text-slate-500');
    content = content.replace(/text-slate-900\/(\d+)/g, 'text-slate-900/$1');
    content = content.replace(/bg-slate-50\/(\d+)/g, 'bg-slate-50/$1');
    
    // In Navbar, we want the links on the mobile menu to not be white if it's white theme,
    // they were replaced to text-slate-900.
    
    fs.writeFileSync(file, content);
});
console.log("Fixed typos.");
