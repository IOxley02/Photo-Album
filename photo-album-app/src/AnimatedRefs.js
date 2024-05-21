import React from "react"
import {
    Routes as Switch,
    Route,
    useLocation
} from "react-router-dom"

import NavBar from "./NavBar"

import { AnimatePresence } from "framer-motion"

const AnimatedRefs = () => {
    const location = useLocation()

    return (
        <AnimatePresence wait>
            <Switch location={location} key={location.pathname}>
                <Route path='/navbar' element={<NavBar />} />
            </Switch>
        </AnimatePresence>
    )
}

export default AnimatedRefs