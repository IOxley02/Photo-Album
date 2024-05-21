import React, { Fragment, useState } from "react"
import { 
    Link, 
  } from "react-router-dom"
  
import AnimatedRefs from './AnimatedRefs'

const myNav = {
    currentNav: 0,
  }

const NavBar = () => {

    const[fileNav, setFileNav] = useState('nav-link')

    //keeps the active navbar equal to the page the user is on
    const updateNavbar = (column) => {
        if(myNav.currentNav === 0) {
        } else if(myNav.currentNav === 1) {
            setFileNav('nav-link')
        }

        if(column === 1) {
            setFileNav('nav-link')
        }
        myNav.currentNav = column
    }

    return (
        <Fragment>
            {/*Navbar */}
            <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
                <div className="container">
                    <a href="#home" className="navbar-brand">
                        <i className="bi bi-house-door"></i>
                    </a>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Years
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#">2024</a>
                                <a className="dropdown-item" href="#">2025</a>
                                <a className="dropdown-item" href="#">2026</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>

            <hr />
            {/*All react components are displayed here */}
            <AnimatedRefs />
        </Fragment >
    )
}

export default NavBar;