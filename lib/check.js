const Holidays = require("date-holidays");
const scheduleMapping = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


class Checker {
    constructor(schedule, country) {
        this.schedule = schedule || {}
        if (country) {
            this.holidays = new Holidays(country)
        } else {
            this.holidays = null
        }
    }

    dayFromSchedule(date) {
        return this.schedule[scheduleMapping[date.weekday - 1]];
    }

    checkWorkingDays(date) {
        if (this.holidays && this.holidays.isHoliday(date)) {
            return false
        }

        if (this.dayFromSchedule(date) === undefined) {
            return false
        }

        return true
    }

    checkWorkingHours(date) {
        const schedule_day = this.dayFromSchedule(date)

        if (schedule_day === undefined || schedule_day.startHour === undefined || schedule_day.endHour === undefined) {
            return false
        }

        if (date.hour < schedule_day.startHour || date.hour >= schedule_day.endHour) {
            return false
        }

        return true
    }
}

module.exports = Checker
