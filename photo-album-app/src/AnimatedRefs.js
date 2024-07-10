import React from "react"
import {
    Routes as Switch,
    Route,
    useLocation
} from "react-router-dom"

import Navbar from "./Navbar";
import Favorites from "./Favorites";
import Gallery from "./Gallery";

import { AnimatePresence } from "framer-motion"

const AnimatedRefs = () => {
    const location = useLocation()

    return (
        <AnimatePresence wait>
            <Switch location={location} key={location.pathname}>
                <Route path='/navbar' element={<Navbar />} />
                <Route path='/' element={<Favorites />} />
                <Route path='/gallery/:year' element={<Gallery />} />
            </Switch>
        </AnimatePresence>
    )
}

export default AnimatedRefs