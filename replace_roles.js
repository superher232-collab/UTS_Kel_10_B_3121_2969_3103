const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace 'CUSTOMER' with 'OPERATOR'
    content = content.replace(/'CUSTOMER'/g, "'OPERATOR'");
    content = content.replace(/"CUSTOMER"/g, '"OPERATOR"');
    content = content.replace(/Role\.CUSTOMER/g, "Role.OPERATOR");
    content = content.replace(/CUSTOMER PORTAL/g, "OPERATOR PORTAL");
    content = content.replace(/CUSTOMER CARE/g, "OPERATOR CARE");
    content = content.replace(/AKSI CEPAT CUSTOMER/g, "AKSI CEPAT OPERATOR");
    content = content.replace(/USER ID CUSTOMER/g, "USER ID OPERATOR");
    content = content.replace(/Customer \(Pengirim\)/g, "Operator (Cabang)");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(srcDir);
console.log("Replacement complete.");
