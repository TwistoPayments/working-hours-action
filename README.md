# Working hours action

This action checks if datetime is within specified working hours.

## Inputs

### `timezone`

Timezone. Default `UTC`

### `calendar`

Country according to [date-holidays](https://github.com/commenthol/date-holidays#supported-countries-states-regions).
Default none

### `schedule`

**Required** working hours schedule in YAML format as inline string:

```yaml
monday:
    startHour: 9
    endHour: 18
tuesday:
    startHour: 9
    endHour: 18
wednesday:
    startHour: 9
    endHour: 18
thursday: ...
friday: ...
saturday: ...
sunday: ...
```

### `types`

Types of holidays to check for. Separated by `,`. Choose from public, bank, optional, school, observance.

```yaml
types: public,bank
```

### `check_future_days`

Number of days into future to check for additional working days/hours checks. Default `0`.

### `fail_on_failure`

If actions should fail on failed working day/hour check. Default `true`.

## Outputs

### `working_hours`

**boolean** true if working hours

## Example usage

```yaml
uses: TwistoPayments/working-hours-action@v1
with:
    calendar: US
    schedule: |
        monday:
          startHour: 9
          endHour: 18
        tuesday:
          startHour: 9
          endHour: 18
        wednesday:
          startHour: 9
          endHour: 18
    check_future_days: 0
    fail_on_failure: true
```
