const fs = require('fs');
const code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const lines = code.split('\n');

const startIndex = lines.findIndex(l => l.includes('{/* Latest News / Forum */}'));
let endIndex = -1;
for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i].includes('</section>')) {
        endIndex = i;
        break;
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const sectionLines = lines.splice(startIndex, endIndex - startIndex + 1);
    
    // Find where to insert it: before {/* Services Grid */}
    const insertIndex = lines.findIndex(l => l.includes('{/* Services Grid */}'));
    if (insertIndex !== -1) {
        lines.splice(insertIndex, 0, ...sectionLines, '');
        fs.writeFileSync('src/pages/Home.tsx', lines.join('\n'));
        console.log("Moved section successfully");
    } else {
        console.log("Could not find insert point");
    }
} else {
    console.log("Could not find section to move");
}
