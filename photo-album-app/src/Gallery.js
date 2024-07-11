import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Gallery = () => {
    const { year } = useParams();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [favorites, setFavorites] = useState(null);
    const [favoritesData, setFavoritesData] = useState(null)


    useEffect(() => {
        if (year) {
            getPhotos(year);
            getFavorites(year);
        }
    }, [year]);

    useEffect(() => {
        console.log(photos)
        console.log(favorites)
        const tempFavoritesData = Array(photos.length).fill(false);
        photos.forEach((photoPath, photoIndex) => {
            const photoFilename = photoPath.split('/').pop();

            favorites.forEach((favoritePath) => {
                const favoriteFilename = favoritePath.split('/').pop();
                if (photoFilename === favoriteFilename) {
                    tempFavoritesData[photoIndex] = true;
                }
            });
        })
        setFavoritesData(tempFavoritesData)
    }, [favorites]); 

    const getPhotos = async (year) => {
        try {
            const response = await fetch(`http://localhost:5000/photos/${year}`);
            const data = await response.json();
            const publicPhotos = data.map(photo => `${photo.substring(photo.indexOf('/'))}`);
            setPhotos(publicPhotos);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const getFavorites = async (year) => {
        try {
            const response = await fetch(`http://localhost:5000/favorites/read/${year}`);
            const data = await response.json();
            const favoritesPhotos = data.map(photo => `${photo.substring(photo.indexOf('/'))}`);
            setFavorites(favoritesPhotos)
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const handlePhotoClick = (index) => {
        setSelectedPhoto(selectedPhoto === index ? null : index);
    };

    const handleHeartClick = async (event, index) => {
        event.stopPropagation();
        const newFavoritesData = [...favoritesData];
        newFavoritesData[index] = !newFavoritesData[index];
        setFavoritesData(newFavoritesData);

        let photoPath = photos[index].substring('/photos'.length);
        const destination = '/Favorites' + photoPath;

        try {
            const response = await fetch('http://localhost:5000/favorites/write/addPhoto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ photoPath, destination }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
            } else {
                console.error('Error copying photo:', result.message);
            }
        } catch (error) {
            console.error('Error copying photo:', error);
        }
    };

    const renderPhotoGrid = () => {
        return (
            <div className="row photo-grid mt-4">
                {photos.map((photo, index) => (
                    <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                        <div className={`photo-container ${selectedPhoto === index ? 'selected' : ''}`} onClick={() => handlePhotoClick(index)}>
                            <img className="img-fluid" src={process.env.PUBLIC_URL + photo} alt={`Photo ${index}`} />
                            <div className="heart-icon" onClick={(event) => handleHeartClick(event, index)}>
                                <i className={`${favoritesData[index] ? 'bi bi-heart-fill' : 'bi bi-heart'}`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div id="galleryBody">
                <h1> {year} </h1>
                {renderPhotoGrid()}
            </div>
        </div>
    );
};

export default Gallery