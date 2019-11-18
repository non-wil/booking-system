import React from 'react'

const ScheduleItem = props => {
  const { dotColor, startTime, endTime, title, theme } = props
  return (
    <div className="schedule-detail">
      <div className="time">
        {dotColor && (
          <div className="dot" style={{ background: dotColor }}></div>
        )}
        <small>{`${startTime} - ${endTime}`}</small>
      </div>
      <p>{title}</p>
    </div>
  )
}

export default ScheduleItem
