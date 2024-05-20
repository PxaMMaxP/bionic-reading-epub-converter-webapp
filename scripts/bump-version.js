/**
 * bump-version.js
 * 
 * This script updates the version number in the package.json file and the src/Config.ts file.
 * It takes a single argument to determine which part of the version number to increment: 
 * 'major', 'minor', or 'patch'. The updated version number is then written back to the package.json file and the src/Config.ts file.
 */

const fs = require('fs');
const path = require('path');

// Path to the package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');

// Path to the Config.ts file
const configTsPath = path.join(__dirname, '..', 'src', 'Config.ts');

// Read the package.json file
const packageJson = require(packageJsonPath);

// Determine which part of the version to increment
const versionPart = process.argv[2]; // 'major', 'minor', 'patch'

// Split the version string into an array of integers
let versionParts = packageJson.version.split('.').map(part => parseInt(part));

/**
 * Increment the appropriate part of the version number
 * - major: increment the first number and reset the others to 0
 * - minor: increment the second number and reset the third to 0
 * - patch: increment the third number
 */
switch (versionPart) {
    case 'major':
        versionParts[0]++;
        versionParts[1] = 0;
        versionParts[2] = 0;
        break;
    case 'minor':
        versionParts[1]++;
        versionParts[2] = 0;
        break;
    case 'patch':
    default:
        versionParts[2]++;
        break;
}

// Join the version parts back into a string
const newVersion = versionParts.join('.');
packageJson.version = newVersion;

// Write the updated package.json back to the file system
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Log the updated version number to the console
console.log(`Version updated to ${packageJson.version}`);

// Update the version number in Config.ts
let configTsContent = fs.readFileSync(configTsPath, 'utf8');
const versionRegex = /public static readonly version = ['"](\d+\.\d+\.\d+)['"]/;
configTsContent = configTsContent.replace(versionRegex, `public static readonly version = '${newVersion}'`);

// Write the updated Config.ts back to the file system
fs.writeFileSync(configTsPath, configTsContent, 'utf8');

console.log(`Version in src/Config.ts updated to ${newVersion}`);
