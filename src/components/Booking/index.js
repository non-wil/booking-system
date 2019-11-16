import React, { useState } from 'react'
import moment from 'moment'
import queryString from 'query-string'
import {
  getBookingsForDay,
  getBookingsForWeek,
  getBookingsForMonth,
  getTextTodayTomorrow
} from 'utils'
import './style.scss'

const DOT_COLOR = ['#3DC7D2', '#23CF5F', 'F3814A']

const Booking = () => {
  const query = queryString.parse(window.location.search)
  const roomId = query.roomId
  const todayDate = moment('2019-09-28 00:00:00')
  const weekNumber = moment('2019-09-28 00:00:00').isoWeek()
  const todaySchedules = getBookingsForDay(
    roomId,
    todayDate.format('YYYY-MM-DD hh:mm:ss')
  )

  const [activeTab, setActivetab] = useState(0)
  const [schedules, setSchedules] = useState([])

  const onChangeTab = tabIndex => {
    setActivetab(tabIndex)

    switch (tabIndex) {
      case 1: {
        // NOTE: NEXT WEEK
        const schedules = getBookingsForWeek(roomId, weekNumber + 1)
        setSchedules(schedules)
        break
      }
      case 2: {
        // NOTE: WHOLE MONTH
        const schedules = getBookingsForMonth(
          roomId,
          todayDate.format('YYYY-MM-DD hh:mm:ss')
        )
        setSchedules(schedules)
        break
      }
      case 0: // NOTE: THIS WEEK
      default: {
        const schedules = getBookingsForWeek(roomId, weekNumber)
        setSchedules(schedules)
        break
      }
    }
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
