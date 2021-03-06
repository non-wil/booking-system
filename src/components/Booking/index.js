import React, { useState, useEffect } from 'react'
import moment from 'moment'
import queryString from 'query-string'
import MyGithub from 'components/MyGithub'
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
const DOT_COLOR = ['#3DC7D2', '#23CF5F', '#F3814A']
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
const ROOMS = ['A101', 'A102', 'Auditorium']

// NOTE: Set today to be 28 Sep 2019 for the sake of the booking data.
const TODAY_DATE = moment('2019-09-28 00:00:00')
const WEEK_NUMBER = moment('2019-09-28 00:00:00').isoWeek()
//------------------------------------------------
// END: Constant variable
//------------------------------------------------

const Booking = () => {
  const query = queryString.parse(window.location.search)
  const roomId = query.roomId

  const [activeTab, setActivetab] = useState(0)
  const [todaySchedules, setTodaySchedules] = useState([])
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    // NOTE: Get default schedules
    const _todaySchedules = getBookingsForDay(
      roomId,
      TODAY_DATE.format('YYYY-MM-DD hh:mm:ss')
    )
    setTodaySchedules(_todaySchedules)
    const thisWeekSchedule = getBookingsForWeek(roomId, WEEK_NUMBER)
    setSchedules(thisWeekSchedule)
  }, [roomId])

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
      case 0: // NOTE: THIS WEEK (Default)
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
        let diffTimeSpacing = 0
        // NOTE: Check for shcedule in the 'SAME' day
        if (moment(schedule.startTime).isSame(currentDay, 'day')) {
          // NOTE: Check if we need to compare this schedule and next schedule
          if (
            index + 1 < schedules.length &&
            moment(schedules[index + 1].startTime).isSame(currentDay, 'day')
          ) {
            // NOTE: Find diff time between this schedule and next schedule
            // to determine the spacing between schedule.
            const timeDiffHour = moment
              .duration(
                moment(schedule.endTime).diff(
                  moment(schedules[index + 1].startTime)
                )
              )
              .hours()
            diffTimeSpacing = timeDiffHour * -50
          }

          return (
            <div
              style={diffTimeSpacing ? { marginBottom: diffTimeSpacing } : {}}
              key={index}
            >
              <ScheduleItem
                dotColor={DOT_COLOR[index % 3]}
                startTime={moment(schedule.startTime).format('HH:mm')}
                endTime={moment(schedule.endTime).format('HH:mm')}
                title={schedule.title}
              />
            </div>
          )
        } else {
          // NOTE: Check for shcedule in the 'NEXT' day
          currentDay = moment(schedule.startTime)
          return (
            <React.Fragment key={index}>
              <div style={{ margin: '2.5em -4em 1.5em -4em' }}>
                <small className="date-title">
                  {`${getTextTodayTomorrow(TODAY_DATE, currentDay)} ${moment(
                    schedule.startTime
                  ).format('ddd, DD MMM')}`}
                </small>
              </div>
              <ScheduleItem
                key={index}
                dotColor={DOT_COLOR[index % 3]}
                startTime={moment(schedule.startTime).format('HH:mm')}
                endTime={moment(schedule.endTime).format('HH:mm')}
                title={schedule.title}
              />
            </React.Fragment>
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
                  key={tab.value}
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
      <div className="other-room">
        {ROOMS.filter(room => room !== roomId).map(room => {
          return (<a href={`/bookings/today?roomId=${room}`}>{room}</a>)
        })}
      </div>
      <MyGithub
        title="Github: Booking"
        url="https://github.com/non-wil/booking-system/blob/master/src/components/Booking/index.js"
      />
    </div>
  )
}

export default Booking
