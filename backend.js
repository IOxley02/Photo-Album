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
            fileList = fileList.concat(getFiles(baseDirectory, filePath));
        } else {
            const relativePath = path.relative(baseDirectory, filePath);
            const extension = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(extension)) {
                fileList.push(`/photos/${relativePath.replace(/\\/g, '/')}`);
            }
        }
    });
    return fileList;
}

function getFavorites(baseDirectory, directory) {
    const favoritesFilePath = path.join(directory, 'Favorites.txt');
    if (fs.existsSync(favoritesFilePath)) {
        const favoritesContent = fs.readFileSync(favoritesFilePath, 'utf8');
        return favoritesContent;
    }

    return '';
}

function getDirectories(baseDirectory, directory) {
    let directoryList = [];
    const files = fs.readdirSync(directory);
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            const relativePath = path.relative(baseDirectory, filePath);
            if (relativePath !== 'Favorites') {
                directoryList.push(`${relativePath.replace(/\\/g, '/')}`);
            }
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

app.get('/photos/:directory?', (req, res) => {
    const baseDirectory = path.resolve(__dirname, 'photo-album-app/public/photos');
    const directory = req.params.directory ? path.join(baseDirectory, req.params.directory) : baseDirectory;
    try {
        const photos = getFiles(baseDirectory, directory);
        res.json(photos);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ message: 'Error fetching photos', error });
    }
});

app.get('/favorites/read/:directory?', (req, res) => {
    const baseDirectory = path.resolve(__dirname, 'photo-album-app/public/photos');
    const directory = req.params.directory ? path.join(baseDirectory, req.params.directory) : baseDirectory;
    try {
        const favorites = getFavorites(baseDirectory, directory);
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});