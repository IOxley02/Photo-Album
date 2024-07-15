const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { promisify } = require('util');
const { exec } = require('child_process');

const app = express();
const port = 5000;
const baseDirectory = path.resolve(__dirname, 'photo-album-app/public/photos');

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

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

app.get('/open-explorer', (req, res) => {
    const directory = path.resolve(__dirname, baseDirectory);
    exec(`explorer "${directory}"`, (err) => {
        if (err) {
            console.error('Error opening file explorer:', err);
            return res.status(500).json({ message: 'Error opening file explorer', error: err });
        }
        res.status(200).json({ message: 'File explorer opened successfully' });
    });
});

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
    const directory = req.params.directory ? path.join(baseDirectory,'/Favorites', req.params.directory) : baseDirectory;
    try {
        const favorites = getFiles(baseDirectory, directory);
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});

app.post('/favorites/write/addPhoto', (req, res) => {
    const { photoPath, destination } = req.body;
    const sourcePath = photoPath ? path.join(baseDirectory, photoPath) : baseDirectory;
    const destPath = destination ? path.join(baseDirectory, destination) : baseDirectory;
    fs.copyFile(sourcePath, destPath, (err) => {
        if (err) {
            console.error('Error copying file:', err);
            return res.status(500).json({ message: 'Error copying file', error: err });
        }
        res.status(200).json({ message: 'File copied successfully' });
    });
});

app.post('/favorites/write/deletePhoto', (req, res) => {
    const { destination } = req.body;
    const sourcePath = destination ? path.join(baseDirectory, destination) : baseDirectory;
    fs.rm(sourcePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file', error: err });
        }
        res.status(200).json({ message: 'File deleted successfully' });
    })
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});