import React, { Fragment, useState, useEffect } from "react"
import {
    Link,
} from "react-router-dom"

import AnimatedRefs from './AnimatedRefs.js'

const Navbar = () => {

    const [activeIndex, setActiveIndex] = useState(null)
    const [directories, setDirectories] = useState([]);

    useEffect(() => {
        getDirectories();
    }, []);

    useEffect(() => {
        makeNavbar()
    }, [directories]);

    const getDirectories = async () => {
        try {
            const response = await fetch('http://localhost:5000/directories');
            const data = await response.json();
            // Update the photo URLs to be relative to the public directory
            const publicDirectories = data.map(directory => `${directory.substring(directory.indexOf('/'))}`);
            setDirectories(publicDirectories);
        } catch (error) {
            console.error('Error fetching directories:', error);
        }
    };

    const updateNavbar = (index) => {
        setActiveIndex(index);
        console.log(activeIndex)
    };

    const makeNavbar = () => {
        let navItems = [];
        const directoriesLength = directories.length;
        let count = 0;
    
        while (count < directoriesLength) {
            const ulItems = [];
            // Generate 15 <li> elements or less if the remaining items are fewer than 15
            for (let i = 0; i < 15 && count < directoriesLength; i++) {
                const directory = directories[count];
                ulItems.push(
                    <li className="nav-item" key={directory} onClick={() => updateNavbar(i)} >
                        <a className={`nav-link ${count === activeIndex ? 'nav-link active' : ''}`} href="#">
                            {directory}
                        </a>
                    </li>
                );
                count++;
            }
            // Push the <ul> element containing the <li> items into the navItems array
            navItems.push(
                <ul className="navbar-nav" key={`ul-${count}`}>
                    {ulItems}
                </ul>
            );
        }
    
        return <>{navItems}</>;
    }

    return (
        <Fragment>
            {/*Navbar */}
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand" onClick={() => updateNavbar(-2)}>
                        <h3 className="nav-link">
                            <i className="bi bi-heart"></i>
                        </h3>
                    </Link>
                    <button className="navbar-toggler my-2" type="button" data-toggle="collapse" data-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-column align-items-center ml-lg-2 ml-0" id="navbarCollapse">
                        {makeNavbar()}
                    </div>
                    <Link to="/" className="navbar-brand" onClick={() => updateNavbar(-1)}>
                        <h3 className="nav-link">
                            <i className="bi bi-folder-plus"></i>
                        </h3>
                    </Link>
                </div>
            </nav>

            {/*All react components are displayed here */}
            <AnimatedRefs />
        </Fragment >
    )
}

export default Navbar;