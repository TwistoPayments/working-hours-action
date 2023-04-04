const Checker = require('../lib/check')
const {test, expect} = require("@jest/globals")
const {DateTime} = require("luxon");

test("Test init pass", () => {
    let checker = new Checker();
    expect(checker.schedule).toStrictEqual({})
    expect(checker.holidays).toStrictEqual(null)

    const schedule = {monday: {startHour: 0, endHour: 19}}
    checker = new Checker(schedule, "US")
    expect(checker.schedule).toStrictEqual(schedule)
    expect(checker.holidays).not.toBeNull()
})

test("Test working days", () => {
    const checker = new Checker({
        monday: {startHour: 0, endHour: 19},
        tuesday: {startHour: 0, endHour: 19},
        wednesday: null,
        sontag: {startHour: 0, endHour: 19}
    });
    let date = DateTime.fromISO("2000-01-10")

    expect(checker.checkWorkingDays(date.set({weekday: 1}))).toBeTruthy()
    expect(checker.checkWorkingDays(date.set({weekday: 2}))).toBeTruthy()
    expect(checker.checkWorkingDays(date.set({weekday: 3}))).toBeTruthy()
    expect(checker.checkWorkingDays(date.set({weekday: 4}))).toBeFalsy()
    expect(checker.checkWorkingDays(date.set({weekday: 5}))).toBeFalsy()
    expect(checker.checkWorkingDays(date.set({weekday: 6}))).toBeFalsy()
    expect(checker.checkWorkingDays(date.set({weekday: 7}))).toBeFalsy()
})

test("Test working hours", () => {
    const checker = new Checker({monday: {startHour: 9, endHour: 10}});
    let date = DateTime.fromISO("2000-01-10T09:00:00")

    expect(checker.checkWorkingHours(date.set({weekday: 1, hour: 9, minute: 0, second: 0}))).toBeTruthy()
    expect(checker.checkWorkingHours(date.set({weekday: 1, hour: 9, minute: 10}))).toBeTruthy()
    expect(checker.checkWorkingHours(date.set({weekday: 1, hour: 9, minute: 59, second: 59}))).toBeTruthy()
    expect(checker.checkWorkingHours(date.set({weekday: 1, hour: 10, minute: 0, second: 0}))).toBeFalsy()
})

test("Test working all hours", () => {
    const checker = new Checker({monday: {startHour: 0, endHour: 24}});
    let date = DateTime.fromISO("2000-01-10T09:00:00")

    expect(checker.checkWorkingHours(date.set({weekday: 1, hour: 9}))).toBeTruthy()
    expect(checker.checkWorkingHours(date.set({weekday: 1, hour: 23, minute: 59}))).toBeTruthy()
})

test("Test holidays", () => {
    const checker = new Checker({
        monday: null,
        tuesday: null,
        wednesday: null,
        friday: null,
        saturday: null,
        sunday: null
    }, "US");
    let date = DateTime.fromISO("2000-12-30T09:00:00")

    expect(checker.checkWorkingDays(date)).toBeTruthy()
    expect(checker.checkWorkingDays(date.plus({days: 1}))).toBeFalsy()
})

test("Test holiday types", () => {
    const checker = new Checker({
        monday: null,
        tuesday: null,
        wednesday: null,
        friday: null,
        saturday: null,
        sunday: null
    }, "CZ", {types: ['bank', 'public']});
    let date = DateTime.fromISO("2023-04-04T09:00:00")

    expect(checker.checkWorkingDays(date)).toBeTruthy()
    expect(checker.checkWorkingDays(date.plus({days: 1}))).toBeTruthy()
})
