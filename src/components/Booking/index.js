import React, { useState } from 'react'
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

  // ---------------------------------------------------
  // NOTE: 02 - Venue Booking System (checkAvailability)
  // ---------------------------------------------------
  const checkAvailability = (roomId, startTime, endTime) => {
    const overlapSchedules = getOverlapSchedule(roomId, startTime, endTime)
    return overlapSchedules.length > 0 ? false : true
  }
  console.log(
    'checkAvailability',
    checkAvailability('A101', '2019-10-06 14:00:00', '2019-10-06 15:00:00')
  )
  // -------------------------------------------------

  // ----------------------------------------------------
  // NOTE: 02 - Venue Booking System (getBookingsForWeek)
  // ----------------------------------------------------
  const getBookingsForWeek = (roomId, weekNo) => {
    const _startTime = moment()
      .day('Monday')
      .week(weekNo)
      .format('YYYY-MM-DD 00:00:00')
    const _endTime = moment(_startTime)
      .add(6, 'days')
      .format('YYYY-MM-DD 23:59:59')

    const bookingForWeek = getOverlapSchedule(roomId, _startTime, _endTime)
    const sortedbookingForWeek = bookingForWeek.sort((a, b) => {
      return moment(a.startTime) - moment(b.startTime)
    })
    return sortedbookingForWeek
  }
  // ----------------------------------------------------

  const getBookingsForDay = (roomId, date) => {
    const _startTime = moment(date).format('YYYY-MM-DD 00:00:00')
    const _endTime = moment(date).format('YYYY-MM-DD 23:59:59')

    const overlapSchedules = getOverlapSchedule(roomId, _startTime, _endTime)
    const sortedSchedule = overlapSchedules.sort((a, b) => {
      return moment(a.startTime) - moment(b.startTime)
    })
    return sortedSchedule
  }

  const getBookingsForMonth = (roomId, date) => {
    const days = moment(date, 'YYYY-MM').daysInMonth()

    const _startTime = moment(date)
      .set('date', 1)
      .format('YYYY-MM-DD 00:00:00')
    const _endTime = moment(date)
      .set('date', days)
      .format('YYYY-MM-DD 00:00:00')

    const overlapSchedules = getOverlapSchedule(roomId, _startTime, _endTime)
    const sortedSchedule = overlapSchedules.sort((a, b) => {
      return moment(a.startTime) - moment(b.startTime)
    })

    return sortedSchedule
  }

  const query = queryString.parse(window.location.search)
  const roomId = query.roomId
  const todayDate = moment('2019-09-28 00:00:00')
  const weekNumber = moment('2019-09-28 00:00:00').isoWeek()
  const todaySchedules = getBookingsForDay(roomId, todayDate)

  const [activeTab, setActivetab] = useState(0)
  const [schedules, setSchedules] = useState([])

  const onChangeTab = tabIndex => {
    setActivetab(tabIndex)

    switch (tabIndex) {
      case 1: {
        // NEXT WEEK
        const schedules = getBookingsForWeek(roomId, weekNumber + 1)
        setSchedules(schedules)
        break
      }
      case 2: {
        const schedules = getBookingsForMonth(roomId, todayDate)
        setSchedules(schedules)
        break
      }
      case 0: // THIS WEEK
      default: {
        const schedules = getBookingsForWeek(roomId, weekNumber)
        setSchedules(schedules)
        break
      }
    }
  }

  const getTextTodayTomorrow = (today, checkedDate) => {
    if (moment(today).isSame(moment(checkedDate), 'day')) return 'Today'
    if (
      moment(today)
        .add(1, 'day')
        .isSame(moment(checkedDate), 'day')
    )
      return 'Tomorrow'
    return ''
  }

  const renderSchedule = () => {
    if (schedules[0]) {
      let currentDay
      return schedules.map((schedule, index) => {
        if (moment(schedule.startTime).isSame(currentDay, 'day')) {
          return (
            <div key={index} className="schedule-detail">
              <div className="time">
                <div
                  className="dot"
                  style={{ background: DOT_COLOR[index % 3] }}
                ></div>
                <small>{`${moment(schedule.startTime).format(
                  'HH:mm'
                )} - ${moment(schedule.endTime).format('HH:mm')}`}</small>
              </div>
              <p>{schedule.title}</p>
            </div>
          )
        } else {
          currentDay = moment(schedule.startTime)
          return (
            <div key={index}>
              <small className="date-title">
                {`${getTextTodayTomorrow(todayDate, currentDay)} ${moment(
                  schedule.startTime
                ).format('ddd, DD MMM')}`}
              </small>
              <div className="schedule-detail">
                <div className="time">
                  <div
                    className="dot"
                    style={{ background: DOT_COLOR[index % 3] }}
                  ></div>
                  <small>{`${moment(schedule.startTime).format(
                    'HH:mm'
                  )} - ${moment(schedule.endTime).format('HH:mm')}`}</small>
                </div>
                <p>{schedule.title}</p>
              </div>
            </div>
          )
        }
      })
    }
  }

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
            <div
              className={`tab-title ${activeTab === 0 ? 'tab-active' : ''}`}
              onClick={() => onChangeTab(0)}
            >
              <span>THIS WEEK</span>
            </div>
            <div
              className={`tab-title ${activeTab === 1 ? 'tab-active' : ''}`}
              onClick={() => onChangeTab(1)}
            >
              <span>NEXT WEEK</span>
            </div>
            <div
              className={`tab-title ${activeTab === 2 ? 'tab-active' : ''}`}
              onClick={() => onChangeTab(2)}
            >
              <span>WHOLE MONTH</span>
            </div>
          </div>
          <div className="tab-body">{renderSchedule()}</div>
        </div>
      </div>
    </div>
  )
}

export default Booking
