import React from 'react'
import moment from 'moment'
import { BOOKINGS } from './bookingData'

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

  const checkAvailability = (roomId, startTime, endTime) => {
    const overlapSchedules = getOverlapSchedule(roomId, startTime, endTime)
    return overlapSchedules.length > 0 ? false : true
  }

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

  console.log(
    'checkAvailability',
    checkAvailability('A101', '2019-10-06 14:00:00', '2019-10-06 15:00:00')
  )

  const weeknumber = moment('2019-09-28 00:00:00').isoWeek()
  console.log('getBookingsForWeek', getBookingsForWeek('A102', 40))
  return (
    <div>
      <h1>Booking System</h1>
      <div></div>
    </div>
  )
}

export default Booking
