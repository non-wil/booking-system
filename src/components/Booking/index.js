import React from 'react'
import { BOOKINGS } from './bookingData'

const Booking = () => {
  console.log(BOOKINGS)

  const checkAvailability = (roomId, startTime, endTime) => {
    const roomSchedules = BOOKINGS.filter(booking => {
      return booking.roomId === roomId
    })

    const _startTime = new Date(startTime)
    const _endTime = new Date(endTime)

    const overlapSchedule = roomSchedules.filter(schedule => {
      const scheduleStartTime = new Date(schedule.startTime)
      const scheduleEndTime = new Date(schedule.endTime)

      if (_endTime > scheduleStartTime && _startTime < scheduleEndTime)
        return true
      else return false
    })

    return overlapSchedule.length > 0 ? false : true
  }

  console.log(`
        @d1 |--------| @d2       
            .        . |--------| @d2 < start_date  **Available
            .        |--------|   @d2 = start_date  **Available
 |--------| .        .            end_date < @d1    **Available
   |--------|        .            end_date = @d1    **Available
     |--------|      .                              **NOT Available
            .      |--------|                       **NOT Available
            |--------|                              **NOT Available
            . |----| .                              **NOT Available
            |------------|                          **NOT Available`)
  console.log(
    checkAvailability('A101', '2019-09-27 13:00:00', '2019-09-28 10:00:00')
  )

  Date.prototype.getWeek = function() {
    var target = new Date(this.valueOf())
    var dayNr = (this.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)
    var firstThursday = target.valueOf()
    target.setMonth(0, 1)
    if (target.getDay() != 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000)
  }

  var d = new Date()
  alert(d.getWeek())

  const getDateOfISOWeek = (w, y) => {
    var simple = new Date(y, 0, 1 + (w - 1) * 7)
    var dow = simple.getDay()
    var ISOweekStart = simple
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
    return ISOweekStart
  }

  const getBookingsForWeek = (roomId, weekNo) => {
    return []
  }
  console.log(getDateOfISOWeek(46, 2019), new Date().getWeek())
  return (
    <div>
      <h1>Booking System</h1>
      <div></div>
    </div>
  )
}

export default Booking
