/**
 * create-release-archive.js
 * 
 * This script creates a ZIP archive of the "docs" directory.
 * The output file is named using the displayName and version from the package.json file.
 * The archive is saved in the "release" directory.
 */

const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Path to the package.json file
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = require(packageJsonPath);

// Construct the output file name and path
const outputFileName = `${packageJson.name}_v${packageJson.version}.zip`;
const outputFilePath = path.join(__dirname, '..', 'release', outputFileName);
const sourceDirPath = path.join(__dirname, '..', 'docs');

// Ensure the release directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'release'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'release'));
}

// Create the ZIP archive
const output = fs.createWriteStream(outputFilePath);
const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression level
});

output.on('close', function () {
    console.log(`Archive ${outputFileName} created: ${archive.pointer()} bytes`);
});

archive.on('error', function (err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append files from the source directory
archive.directory(sourceDirPath, false);

// Finalize the archive (i.e., write all files to the ZIP)
archive.finalize();
