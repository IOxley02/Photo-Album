import React, { Fragment } from "react"

import { 
  BrowserRouter as Router,
} from "react-router-dom"

import './App.css';

import Navbar from "./Navbar";

function App() {

  return (
    <Router>
      <Fragment>
        <Navbar />
    </Fragment>
    </Router>
  );

}

export default App;