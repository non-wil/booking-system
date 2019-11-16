import React from 'react'
import moment from 'moment'
import queryString from 'query-string'
import { BOOKINGS } from './bookingData'
import './style.scss'

/* NOTE: 
        @d1 |--------| @d2       
            .        . |--------| @d2 < start_date  **Available
            .        |--------|   @d2 = start_date  **Available
 |--------| .        .            end_date < @d1    **Available
   |--------|        .            end_date = @d1    **Available
     |--------|      .                              **NOT Available
            .      |--------|                       **NOT Available
            |--------|                              **NOT Available
            . |----| .                              **NOT Available
            |------------|                          **NOT Available
*/
const DOT_COLOR = ['#3DC7D2', '#23CF5F', 'F3814A']

const Booking = () => {
  const getOverlapSchedule = (roomId, startTime, endTime) => {
    const roomSchedules = BOOKINGS.filter(booking => {
      return booking.roomId === roomId
    })

    const _startTime = moment(startTime)
    const _endTime = moment(endTime)

    const overlapSchedules = roomSchedules.filter(schedule => {
      const scheduleStartTime = moment(schedule.startTime)
      const scheduleEndTime = moment(schedule.endTime)
      if (_endTime > scheduleStartTime && _startTime < scheduleEndTime)
        return true
      else return false
    })

    return overlapSchedules
  }

  const checkAvailability = (roomId, startTime, endTime) => {
    const overlapSchedules = getOverlapSchedule(roomId, startTime, endTime)
    return overlapSchedules.length > 0 ? false : true
  }
  console.log(
    'checkAvailability',
    checkAvailability('A101', '2019-10-06 14:00:00', '2019-10-06 15:00:00')
  )

  const getBookingsForWeek = (roomId, weekNo) => {
    const startDate = moment()
      .day('Monday')
      .week(weekNo)
      .format('YYYY-MM-DD 00:00:00')
    const endDate = moment(startDate)
      .add(6, 'days')
      .format('YYYY-MM-DD 23:59:59')

    const bookingForWeek = getOverlapSchedule(roomId, startDate, endDate)
    return bookingForWeek
  }
  const weeknumber = moment('2019-09-28 00:00:00').isoWeek()
  console.log('getBookingsForWeek', getBookingsForWeek('A101', weeknumber))

  const getBookingsForADay = (roomId, date) => {
    const _startTime = moment(date).format('YYYY-MM-DD 00:00:00')
    const _endTime = moment(date).format('YYYY-MM-DD 23:59:59')

    const overlapSchedules = getOverlapSchedule(roomId, _startTime, _endTime)
    const sortedSchedule = overlapSchedules.sort((a, b) => {
      return moment(a.startTime) - moment(b.startTime)
    })
    return sortedSchedule
  }

  const query = queryString.parse(window.location.search)
  const roomId = query.roomId
  const todayDate = moment('2019-09-28 00:00:00')
  const todaySchedules = getBookingsForADay(roomId, todayDate)

  return (
    <div style={{ background: '#bbc2d1', padding: '5em 0' }}>
      <div className="container">
        <div className="left-box">
          <div className="room-no-box">
            <span>{roomId}</span>
          </div>
          <div className="date-box">
            <small>Upcoming</small>
            <h1>
              <span>{todayDate.format('dddd')}</span> <br />
              {todayDate.format('DD MMM')}
            </h1>
          </div>
          <div className="today-schedule">
            {todaySchedules.map((scheduleItem, index) => {
              return (
                <div key={index} className="schedule-item">
                  <small>{`${moment(scheduleItem.startTime).format(
                    'HH:mm'
                  )} - ${moment(scheduleItem.endTime).format('HH:mm')}`}</small>
                  <p>{scheduleItem.title}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="right-box">
          <div className="tab-header">
            <div className="tab-title tab-active">
              <span>THIS WEEK</span>
            </div>
            <div className="tab-title">
              <span>NEXT WEEK</span>
            </div>
            <div className="tab-title">
              <span>WHOLE MONTH</span>
            </div>
          </div>
          <div className="tab-body">
            <small className="date-title">Today (Mon, 28 Sep)</small>
            <div className="schedule-detail">
              <div className="time">
                <div className="dot" style={{ background: DOT_COLOR[0] }}></div>
                <small>13:00 - 14:00</small>
              </div>
              <p>Lunch with petr</p>
            </div>
            <div className="schedule-detail">
              <div className="time">
                <div className="dot" style={{ background: DOT_COLOR[1] }}></div>
                <small>13:00 - 14:00</small>
              </div>
              <p>Lunch with petr</p>
            </div>
            <div className="schedule-detail">
              <div className="time">
                <div className="dot" style={{ background: DOT_COLOR[2] }}></div>
                <small>13:00 - 14:00</small>
              </div>
              <p>Lunch with petr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
