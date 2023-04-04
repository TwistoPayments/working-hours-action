const core = require('@actions/core')
const YAML = require('yaml')
const {DateTime} = require("luxon");
const Checker = require("./check")

const timezone = core.getInput('timezone')
const calendar = core.getInput('calendar')
const schedule = YAML.parse(core.getInput('schedule', {required: true}))
const check_future_days = parseInt(core.getInput('check_future_days'))
const fail_on_failure = core.getBooleanInput('fail_on_failure')
const types = core.getInput('types').split(',')

const currentTime = DateTime.now().setZone(timezone)

core.startGroup("Initialize working hours checker")
const checker = new Checker(schedule, calendar, {timezone, types})
core.endGroup()

core.startGroup("Check working day")
const working_day = checker.checkWorkingDays(currentTime)
core.info(`${currentTime.toISO()} - working_days: ${working_day}`)
core.endGroup()

core.startGroup("Check working hours")
const working_hours = checker.checkWorkingHours(currentTime)
core.info(`${currentTime.toISO()} - working_hours: ${working_hours}`)
core.endGroup()

let future_working_days = true
for (let i = 0; i < check_future_days; i++) {
    let offsetTime = currentTime.plus({days: i + 1})
    core.startGroup(`Check future day - ${offsetTime.toISO()}`)

    const offsetWorkingTime = checker.checkWorkingDays(offsetTime)
    future_working_days = future_working_days && offsetWorkingTime
    core.info(`${currentTime.toISO()} - working_days: ${offsetWorkingTime}`)
    core.endGroup()
}


if (working_day && working_hours && future_working_days) {
    core.setOutput('working_hours', true)
} else {
    core.setOutput('working_hours', false)
    if (fail_on_failure) {
        core.setFailed("Not working hours");
    }
}
