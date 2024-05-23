import React, { Fragment, useState, useEffect } from "react"
import {
    Link,
} from "react-router-dom"

import AnimatedRefs from './AnimatedRefs.js'

const myNav = {
    currentNav: 0,
}

const Navbar = () => {

    const [fileNav, setFileNav] = useState('nav-link')
    const [directories, setDirectories] = useState([]);

    useEffect(() => {
        getDirectories();
    }, []);

    useEffect(() => {
        console.log(directories);
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

    const makeNavbar = () => {
        let navItems = [];
        let count = 0;
        const directoriesLength = directories.length;
    
        while (count < directoriesLength) {
            const ulItems = [];
            // Generate 15 <li> elements or less if the remaining items are fewer than 15
            for (let i = 0; i < 15 && count < directoriesLength; i++) {
                const directory = directories[count++];
                ulItems.push(
                    <li className="nav-item" key={directory}>
                        <a className="nav-link" href="#">{directory}</a>
                    </li>
                );
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

    //keeps the active navbar equal to the page the user is on
    const updateNavbar = (column) => {
        if (myNav.currentNav === 0) {
        } else if (myNav.currentNav === 1) {
            setFileNav('nav-link')
        }

        if (column === 1) {
            setFileNav('nav-link')
        }
        myNav.currentNav = column
    }

    return (
        <Fragment>
            {/*Navbar */}
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container">
                    <Link to="/" className="navbar-brand" onClick={() => updateNavbar(0)}>
                        <h1 className="py-2 ml-lg-2 mx-3">
                            <i className="bi bi-heart">
                            </i>
                        </h1>
                    </Link>
                    <button className="navbar-toggler my-2" type="button" data-toggle="collapse" data-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-column align-items-center ml-lg-2 ml-0" id="navbarCollapse">
                        {makeNavbar()}
                    </div>
                </div>
            </nav>

            {/*All react components are displayed here */}
            <AnimatedRefs />
        </Fragment >
    )
}

export default Navbar;