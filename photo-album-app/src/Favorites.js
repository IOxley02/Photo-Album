import React, { Fragment, useState, useEffect } from "react";

const Favorites = () => {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [favorites, setFavorites] = useState(null);


    useEffect(() => {
        getPhotos();
    }, []);

    useEffect(() => {
        setFavorites(Array(photos.length).fill(true)); 
    }, [photos]); 

    useEffect(() => {
        console.log(favorites); 
    }, [favorites]); 

    const getPhotos = async () => {
        try {
            const response = await fetch('http://localhost:5000/photos/Favorites');
            const data = await response.json();
            // Update the photo URLs to be relative to the public directory
            const publicPhotos = data.map(photo => `${photo.substring(photo.indexOf('/'))}`);
            setPhotos(publicPhotos);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const makeCarousel = () => {
        return (
            photos.map((photo, index) => (
                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                    <img className="d-block w-100" src={process.env.PUBLIC_URL + photo} alt={`Slide ${index}`} />
                </div>
            ))
        );
    };

    const renderPhotoGrid = () => {
        return (
            <div className="row photo-grid mt-4">
                {photos.map((photo, index) => (
                    <div className="col-6 col-md-4 col-lg-3 mb-4" key={index}>
                        <div className={`photo-container ${selectedPhoto === index ? 'selected' : ''}`} onClick={() => handlePhotoClick(index)}>
                            <img className="img-fluid" src={process.env.PUBLIC_URL + photo} alt={`Photo ${index}`} />
                            <div className="heart-icon" onClick={(event) => handleHeartClick(event, index)}>
                                <i className={`${favorites[index] ? 'bi bi-heart-fill' : 'bi bi-heart'}`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const handlePhotoClick = (index) => {
        setSelectedPhoto(selectedPhoto === index ? null : index);
    };

    const handleHeartClick = (event, index) => {
        event.stopPropagation();
        const newFavorites = [...favorites];
        newFavorites[index] = !newFavorites[index];
        setFavorites(newFavorites);
    };

    return (
        <Fragment>
            <div className="container" id="favoritesHeader">
                <div className="row justify-content-center">
                    <div className="col-12 text-center title">
                        <h2>Mia & Ian</h2>
                        <h1>Photo Album</h1>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-12">
                        <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                {makeCarousel()}
                            </div>
                            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div id="favoritesBody">
                <h1> Favorites </h1>
                {renderPhotoGrid()}
            </div>

        </Fragment>
    );
};

export default Favorites;
