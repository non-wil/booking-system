import React, { useState } from 'react'
import moment from 'moment'
import queryString from 'query-string'
import {
  getBookingsForDay,
  getBookingsForWeek,
  getBookingsForMonth,
  getTextTodayTomorrow
} from 'utils'
import ScheduleItem from './scheduleItem'
import './style.scss'

//------------------------------------------------
// BEGIN: Constant variable
//------------------------------------------------
const DOT_COLOR = ['#3DC7D2', '#23CF5F', 'F3814A']
const TABS = [
  {
    title: 'THIS WEEK',
    value: 0
  },
  {
    title: 'NEXT WEEK',
    value: 1
  },
  {
    title: 'WHOLE MONTH',
    value: 2
  }
]

// NOTE: Set today to be 28 Sep 2019 for the sake of the booking data
const TODAY_DATE = moment('2019-09-28 00:00:00')
const WEEK_NUMBER = moment('2019-09-28 00:00:00').isoWeek()
//------------------------------------------------
// END: Constant variable
//------------------------------------------------

const Booking = () => {
  const query = queryString.parse(window.location.search)
  const roomId = query.roomId
  const todaySchedules = getBookingsForDay(
    roomId,
    TODAY_DATE.format('YYYY-MM-DD hh:mm:ss')
  )

  const [activeTab, setActivetab] = useState(0)
  const [schedules, setSchedules] = useState([])

  const onChangeTab = tabIndex => {
    setActivetab(tabIndex)

    switch (tabIndex) {
      case 1: {
        // NOTE: NEXT WEEK
        const schedules = getBookingsForWeek(roomId, WEEK_NUMBER + 1)
        setSchedules(schedules)
        break
      }
      case 2: {
        // NOTE: WHOLE MONTH
        const schedules = getBookingsForMonth(
          roomId,
          TODAY_DATE.format('YYYY-MM-DD hh:mm:ss')
        )
        setSchedules(schedules)
        break
      }
      case 0: // NOTE: THIS WEEK
      default: {
        const schedules = getBookingsForWeek(roomId, WEEK_NUMBER)
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
            <ScheduleItem
              key={index}
              dotColor={DOT_COLOR[index % 3]}
              startTime={moment(schedule.startTime).format('HH:mm')}
              endTime={moment(schedule.endTime).format('HH:mm')}
              title={schedule.title}
            />
          )
        } else {
          currentDay = moment(schedule.startTime)
          return (
            <div key={index}>
              <small className="date-title">
                {`${getTextTodayTomorrow(TODAY_DATE, currentDay)} ${moment(
                  schedule.startTime
                ).format('ddd, DD MMM')}`}
              </small>
              <ScheduleItem
                key={index}
                dotColor={DOT_COLOR[index % 3]}
                startTime={moment(schedule.startTime).format('HH:mm')}
                endTime={moment(schedule.endTime).format('HH:mm')}
                title={schedule.title}
              />
            </div>
          )
        }
      })
    }
  }

  return (
    <div style={{ background: '#bbc2d1', padding: '5em 0' }}>
      <div className="container">
        {/* BEGIN: Left box */}
        <div className="left-box">
          <div className="room-no-box">
            <span>{roomId}</span>
          </div>
          <div className="date-box">
            <small>Upcoming</small>
            <h1>
              <span>{TODAY_DATE.format('dddd')}</span> <br />
              {TODAY_DATE.format('DD MMM')}
            </h1>
          </div>
          <div className="today-schedule">
            {todaySchedules.map((scheduleItem, index) => {
              return (
                <ScheduleItem
                  key={index}
                  startTime={moment(scheduleItem.startTime).format('HH:mm')}
                  endTime={moment(scheduleItem.endTime).format('HH:mm')}
                  title={scheduleItem.title}
                />
              )
            })}
          </div>
        </div>
        {/* END: Left Box */}

        {/* BEGIN: Right Box */}
        <div className="right-box">
          <div className="tab-header">
            {TABS.map(tab => {
              return (
                <div
                  className={`tab-title ${
                    activeTab === tab.value ? 'tab-active' : ''
                  }`}
                  onClick={() => onChangeTab(tab.value)}
                >
                  <span>{tab.title}</span>
                </div>
              )
            })}
          </div>
          <div className="tab-body">{renderSchedule()}</div>
        </div>
        {/* END: Right Box */}
      </div>
    </div>
  )
}

export default Booking
