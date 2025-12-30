const fs = require('fs');
const path = require('path');

const gradlePath = path.join(__dirname, '../android/app/build.gradle');

try {
    let content = fs.readFileSync(gradlePath, 'utf8');

    // Regex to find versionCode
    const versionCodeRegex = /versionCode\s+(\d+)/;
    const match = content.match(versionCodeRegex);

    if (match) {
        const currentVersionCode = parseInt(match[1], 10);
        const newVersionCode = currentVersionCode + 1;

        // Replace with new version code in Gradle
        content = content.replace(versionCodeRegex, `versionCode ${newVersionCode}`);

        // --- Auto-increment versionName (Minor Version) ---
        const versionNameRegex = /versionName\s+"([^"]+)"/;
        const nameMatch = content.match(versionNameRegex);
        let newVersionName = '1.0';

        if (nameMatch) {
            const parts = nameMatch[1].split('.');
            if (parts.length >= 2) {
                // Increment minor version (e.g., 1.2 -> 1.3)
                const major = parts[0];
                const minor = parseInt(parts[1], 10) + 1;
                newVersionName = `${major}.${minor}`;
            } else {
                // Fallback if odd format
                newVersionName = nameMatch[1];
            }
            content = content.replace(versionNameRegex, `versionName "${newVersionName}"`);
            console.log(`✅ Bumped Android versionName from ${nameMatch[1]} to ${newVersionName}`);
        }

        fs.writeFileSync(gradlePath, content, 'utf8');
        console.log(`✅ Bumped Android versionCode from ${currentVersionCode} to ${newVersionCode}`);

        // --- Update index.html ---
        const indexHtmlPath = path.join(__dirname, '../index.html');
        let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

        // Extract versionName (already updated in content)
        const versionName = newVersionName;

        // Construct new footer text
        // Format: © 2026 FoodBhasha • v1.3
        const currentYear = new Date().getFullYear();
        // Force 2026 if user specific requested, otherwise dynamic. User requested 2026 explicitly.
        // Let's stick to the user's specific "2026" request for now or make it dynamic if they want "generated".
        // "footer is 2024. that shoudl be 2026." -> implied permanent change or forward dating.
        // I will use 2026 as hardcoded for now to satisfy the precise request, or Math.max(2026, currentYear).
        // Let's use 2026 to be safe.
        const newFooterText = `© 2026 FoodBhasha • v${versionName}`;

        const footerRegex = /<footer class="app-footer">\s*<p>.*?<\/p>\s*<\/footer>/s;

        if (footerRegex.test(indexContent)) {
            const newFooterBlock = `<footer class="app-footer">\n        <p>${newFooterText}</p>\n    </footer>`;
            indexContent = indexContent.replace(footerRegex, newFooterBlock);
            fs.writeFileSync(indexHtmlPath, indexContent, 'utf8');
            console.log(`✅ Updated index.html footer: ${newFooterText}`);
        } else {
            console.warn('⚠️ Could not find footer in index.html to update signature.');
        }

    } else {
        console.error('❌ Could not find versionCode in build.gradle');
        process.exit(1);
    }
} catch (err) {
    console.error('❌ Error bumping version:', err);
    process.exit(1);
}
