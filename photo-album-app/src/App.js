import React, { Fragment } from "react"

import { 
  BrowserRouter as Router,
} from "react-router-dom"

import './App.css';
import NavBar from "./NavBar"

function App() {

  return (
    <Router>
      <Fragment>
        <NavBar />
    </Fragment>
    </Router>
  );

}

export default App;
