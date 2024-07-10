import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Gallery = () => {
    const { year } = useParams();
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [favorites, setFavorites] = useState(null);


    useEffect(() => {
        if (year) {
            getPhotos(year);
            getFavorites(year);
            setFavorites(Array(photos.length).fill(false))
        }
    }, [year]);

    useEffect(() => {
        setFavorites(Array(photos.length).fill(false)); 
    }, [photos]); 

    useEffect(() => {
        console.log(favorites); 
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
            console.log(data)
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const handlePhotoClick = (index) => {
        setSelectedPhoto(selectedPhoto === index ? null : index);
    };

    const handleHeartClick = (index) => {
        console.log(index)
        const newFavorites = [...favorites];
        newFavorites[index] = !newFavorites[index];
        setFavorites(newFavorites);
    };

    const renderPhotoGrid = () => {
        return (
            <div className="row photo-grid mt-4">
                {photos.map((photo, index) => (
                    <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                        <div className={`photo-container ${selectedPhoto === index ? 'selected' : ''}`} onClick={() => handlePhotoClick(index)}>
                            <img className="img-fluid" src={process.env.PUBLIC_URL + photo} alt={`Photo ${index}`} />
                            <div className="heart-icon">
                                <i className={`bi bi-heart ${favorites[index] === true ? 'bi bi-heart-fill' : 'bi bi-heart'}`} onClick={() => handleHeartClick(index)}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div id="galleryHeader">
                <h1>Hello World!</h1>
            </div>
            <div id="galleryBody">
                {renderPhotoGrid()}
            </div>
        </div>
    );
};

export default Gallery