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

        // Replace with new version code
        content = content.replace(versionCodeRegex, `versionCode ${newVersionCode}`);

        fs.writeFileSync(gradlePath, content, 'utf8');
        console.log(`✅ Bumped Android versionCode from ${currentVersionCode} to ${newVersionCode}`);
    } else {
        console.error('❌ Could not find versionCode in build.gradle');
        process.exit(1);
    }
} catch (err) {
    console.error('❌ Error bumping version:', err);
    process.exit(1);
}
