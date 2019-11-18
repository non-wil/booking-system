import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import ImageList from 'components/ImageList'
import Booking from 'components/Booking'
import CheckBookingAvailability from 'components/CheckBookingAvailability'
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
              <Link to="/bookings/check">Check Booking Availability</Link>
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
          <Route path="/bookings/check">
            <CheckBookingAvailability />
          </Route>
          <Route path="/">
            <ImageList />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
