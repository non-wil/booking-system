import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import ImageList from 'components/ImageList'
import Booking from 'components/Booking'
import './App.css'

function App() {
  return (
    <div>
      <Router>
        <nav className="nav">
          <ul>
            <li>
              <Link to="/img-list">Image List</Link>
            </li>
            <li>
              <Link to="/bookings/today?roomId=A101">Booking</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/img-list">
            <ImageList />
          </Route>
          <Route path="/bookings/today">
            <Booking />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
