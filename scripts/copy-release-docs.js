/**
 * copy-release-docs.js
 * 
 * This script copies files from the "public" directory to the "docs" directory,
 * and the "dist/bundle.js" file to the "docs/bundle.js" file. It uses the fs-extra
 * library to handle the file copying.
 */

const copy = require('fs-extra').copy;

// Function to copy files
async function copyFiles() {
    try {
        // Copy the entire "public" directory to "docs"
        await copy('public', 'docs');

        // Copy the "dist/bundle.js" file to "docs/bundle.js"
        await copy('dist/bundle.js', 'docs/bundle.js');

        console.log('Files copied successfully.');
    } catch (error) {
        console.error('Error copying files:', error);
    }
}

// Start the copy process
copyFiles();
