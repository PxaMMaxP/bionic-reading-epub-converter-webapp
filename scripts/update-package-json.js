/**
 * update-package-json.js
 * 
 * This script updates the name and repository URL in the package.json file.
 * It prompts the user for the new name and Git repository URL.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the package.json file
const packageJsonPath = path.join(__dirname, 'package.json');

// Read the package.json file
const packageJson = require(packageJsonPath);

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for input
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Main function to update package.json
async function updatePackageJson() {
    try {
        // Ask for new name
        const name = await askQuestion('Enter the new name: ');
        // Ask for new repository URL
        const repositoryUrl = await askQuestion('Enter the new Git repository URL: ');

        // Update package.json fields
        packageJson.name = name;
        packageJson.repository.url = repositoryUrl;
        packageJson.bugs.url = `${repositoryUrl}/issues`;
        packageJson.homepage = `${repositoryUrl}#readme`;

        // Write the updated package.json back to the file system
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

        console.log('package.json has been updated successfully.');

    } catch (error) {
        console.error('Error updating package.json:', error);
    } finally {
        rl.close();
    }
}

// Run the main function
updatePackageJson();
