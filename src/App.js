import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import ImageList from 'components/ImageList'
import Booking from 'components/Booking'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/img-list">Image List</Link>
            </li>
            <li>
              <Link to="/booking">Booking</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/img-list">
            <ImageList />
          </Route>
          <Route path="/booking">
            <Booking />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
