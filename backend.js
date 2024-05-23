const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

function getFiles(baseDirectory, directory) {
    let fileList = [];
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            fileList = fileList.concat(getFiles(baseDirectory, filePath)); // Recursively get files in subdirectories
        } else {
            const relativePath = path.relative(baseDirectory, filePath);
            fileList.push(`/photos/${relativePath.replace(/\\/g, '/')}`); // Add relative file path to the list
        }
    });
    return fileList;
}

function getDirectories(baseDirectory, directory) {
    let directoryList = [];
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        console.log('testing')
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            const relativePath = path.relative(baseDirectory, filePath);
            directoryList.push(`${relativePath.replace(/\\/g, '/')}`); // Add relative directory path to the list
        }
    });
    return directoryList;
}

app.get('/directories', (req, res) => {
    const photosDirectory = path.resolve(__dirname, 'photo-album-app/public/photos');
    try {
        const directories = getDirectories(photosDirectory, photosDirectory);
        res.json(directories);
    } catch (error) {
        console.error('Error fetching directories:', error);
        res.status(500).json({ message: 'Error fetching directories', error });
    }
});

app.get('/photos', (req, res) => {
    const photosDirectory = path.resolve(__dirname, 'photo-album-app/public/photos');
    try {
        const photos = getFiles(photosDirectory, photosDirectory);
        res.json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ message: 'Error fetching photos', error });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});