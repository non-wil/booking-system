import React, { useState } from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import MyGithub from 'components/MyGithub'
import { checkAvailability } from 'utils'
import './style.scss'

const CheckBookingAvailability = () => {
  const [roomId, setRoomId] = useState('A101')
  const [startTime, setStartTime] = useState(moment.utc('2019-09-28 10:00:00'))
  const [endTime, setEndTime] = useState(moment('2019-09-28 16:00:00'))
  const [isRoomAvailable, setIsRoomAvailable] = useState(null)

  return (
    <div className="checking-box">
      <h1>CheckBookingAvailability</h1>
      <div>
        <span> Select Room </span>
        <select
          value={roomId}
          onChange={event => {
            setRoomId(event.target.value)
          }}
        >
          <option value="A101">A101</option>
          <option value="A102">A102</option>
          <option value="Auditorium">Auditorium</option>
        </select>
        <div>
          <br />
          <span> Start Time: </span>
          <Datetime value={startTime} onChange={date => setStartTime(date)} />
          <span> End Time: </span>
          <Datetime value={endTime} onChange={date => setEndTime(date)} />
        </div>
      </div>
      <br />
      <button
        onClick={() => {
          setIsRoomAvailable(checkAvailability(roomId, startTime, endTime))
        }}
      >
        Check
      </button>
      {isRoomAvailable !== null && (
        <div>
          Room {roomId} is {isRoomAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'} on{' '}
          {startTime.format('YYYY-MM-DD hh:mm:ss')} to{' '}
          {endTime.format('YYYY-MM-DD hh:mm:ss')}
        </div>
      )}

      <div>
        <br />
        <a
          href="https://github.com/non-wil/booking-system/blob/master/src/utils/bookingData.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          Booking schedule (for reference)
        </a>
      </div>
      <MyGithub title="Github: CheckBookingAvailability" url="" />
    </div>
  )
}

export default CheckBookingAvailability
