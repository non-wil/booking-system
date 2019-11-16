import moment from 'moment'
import { BOOKINGS } from './bookingData'

/* Params getOverlapSchedule
 * roomId: string
 * startTime: string => '2019-10-06 14:00:00' || momentObject
 * endTime: string => '2019-10-06 14:00:00' || momentObject
 */
export const getOverlapSchedule = (roomId, startTime, endTime) => {
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

/* Params checkAvailability
 * roomId: string
 * startTime: string => '2019-10-06 14:00:00' || momentObject
 * endTime: string => '2019-10-06 14:00:00' || momentObject
 */
export const checkAvailability = (roomId, startTime, endTime) => {
  const overlapSchedules = getOverlapSchedule(roomId, startTime, endTime)
  return overlapSchedules.length > 0 ? false : true
}

/* Params getBookingsForDay
 * roomId: string
 * date: string => '2019-10-06 14:00:00' || momentObject
 */
export const getBookingsForDay = (roomId, date) => {
  const _startTime = moment(date).format('YYYY-MM-DD 00:00:00')
  const _endTime = moment(date).format('YYYY-MM-DD 23:59:59')

  const overlapSchedules = getOverlapSchedule(roomId, _startTime, _endTime)
  const sortedSchedule = overlapSchedules.sort((a, b) => {
    return moment(a.startTime) - moment(b.startTime)
  })
  return sortedSchedule
}

/* Params getBookingsForWeek
 * roomId: string
 * weekNo: number => 46
 */
export const getBookingsForWeek = (roomId, weekNo) => {
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

/* Params getBookingsForMonth
 * roomId: string
 * date: string => '2019-10-06 14:00:00' || momentObject
 */
export const getBookingsForMonth = (roomId, date) => {
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

/* Params getTextTodayTomorrow
 * rotodayomId: string => '2019-10-06 14:00:00' || momentObject
 * checkedDate: string => '2019-10-06 14:00:00' || momentObject
 */
export const getTextTodayTomorrow = (today, checkedDate) => {
  if (moment(today).isSame(moment(checkedDate), 'day')) return 'Today'
  if (
    moment(today)
      .add(1, 'day')
      .isSame(moment(checkedDate), 'day')
  )
    return 'Tomorrow'
  return ''
}
