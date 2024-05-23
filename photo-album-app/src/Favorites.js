import React, { Fragment, useState, useEffect } from "react";

const Favorites = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        getPhotos();
    }, []);

    useEffect(() => {
        console.log(photos);
        makeCarousel()
    }, [photos]);

    const getPhotos = async () => {
        try {
            const response = await fetch('http://localhost:5000/photos');
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


return (
    <Fragment>
        <div className="container" id="headerContainer">
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
    </Fragment >
)
}
export default Favorites;