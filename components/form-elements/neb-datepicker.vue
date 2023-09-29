<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import { NebInput } from '#components'
import 'dayjs/locale/hu'

const props = withDefaults(defineProps<{
  modelValue: Date | string | undefined | null
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  closeOnSelect?: boolean
  from?: Date | string
  to?: Date | string
}>(), {
  disabled: false,
  required: false,
  closeOnSelect: true,
  placeholder: 'Válassz egy dátumot...',
})

const emit = defineEmits<{
  'update:modelValue': [date: Date | null]
}>()

dayjs.extend(localeData)
dayjs.locale('hu')

const input = ref<InstanceType<typeof NebInput> | null>(null)

const selectedDay = computed(() => dayjs(props.modelValue || null)) // if modelValue is undefined, we don't want to default to the current date (which dayjs would do by default)
if (selectedDay.value.isValid())
  emitDate(selectedDay.value)

const calendarView = ref<'day' | 'month' | 'year'>('day')
const viewDay = ref(selectedDay.value.isValid() ? selectedDay.value.clone() : dayjs())

const { collectErrors, errorsToShow } = useNebValidate(input, () => {
  if (props.required && !selectedDay.value.isValid())
    return ['valueMissing']
  else
    return []
})

provide(NebValidatorErrorsToShowInjectKey, errorsToShow)

const lastEmittedDate = ref<number | null>(selectedDay.value.toDate().getTime())
watch(selectedDay, () => {
  const currValue = selectedDay.value.toDate().getTime()
  const showErrors = !lastEmittedDate.value || currValue === lastEmittedDate.value
  lastEmittedDate.value = currValue
  collectErrors(showErrors)

  if (selectedDay.value.isValid())
    viewDay.value = selectedDay.value.clone()
})

const daysInView = computed(() => {
  const daysInView = [] as Dayjs[]

  const dayCount = viewDay.value.daysInMonth()
  for (let i = 0; i < dayCount; ++i)
    daysInView.push(viewDay.value.clone().date(i + 1))

  const shiftedDayOfWeek = daysInView[0].day() - 1
  const cellsToAddBefore = shiftedDayOfWeek < 0 ? 6 : shiftedDayOfWeek
  const lastMonth = viewDay.value.subtract(1, 'month')
  for (let i = 0; i < cellsToAddBefore; i++)
    daysInView.unshift(lastMonth.clone().date(lastMonth.daysInMonth() - i))

  const cellsToAddAfter = 42 - (cellsToAddBefore + dayCount)
  const nextMonth = viewDay.value.add(1, 'month')
  for (let i = 0; i < cellsToAddAfter; i++)
    daysInView.push(nextMonth.clone().date(i + 1))

  return daysInView
})

const monthsInView = computed(() => {
  const monthsInView = [] as Dayjs[]

  for (let i = 0; i < 12; ++i)
    monthsInView.push(viewDay.value.clone().month(i))

  return monthsInView
})

const yearInView = computed(() => {
  const yearInView = [] as Dayjs[]

  const yearCountInView = 20
  const yearShift = viewDay.value.year() - Math.ceil((yearCountInView - 1) / 2)
  for (let i = 0; i < 20; ++i)
    yearInView.push(viewDay.value.clone().year(i + yearShift))

  return yearInView
})

const weekdayjs = computed(() => {
  const days = dayjs.weekdaysMin()
  const sunday = days.shift()
  days.push(sunday!)

  return days
})

function handleDayClick(day: Dayjs) {
  emitDate(day)

  if (props.closeOnSelect)
    input.value!.blur()
}
function handleMonthClick(month: Dayjs) {
  viewDay.value = viewDay.value.month(month.month()).clone()
  calendarView.value = 'day'
}
function handleYearClick(year: Dayjs) {
  viewDay.value = viewDay.value.year(year.year()).clone()
  calendarView.value = 'month'
}

function handleAdd() {
  if (calendarView.value === 'day')
    viewDay.value = viewDay.value.add(1, 'month')
  else if (calendarView.value === 'year')
    viewDay.value = viewDay.value.add(10, 'year')
}
function handleSubtract() {
  if (calendarView.value === 'day')
    viewDay.value = viewDay.value.subtract(1, 'month')
  else if (calendarView.value === 'year')
    viewDay.value = viewDay.value.subtract(10, 'year')
}

function getDayButtonType(day: Dayjs) {
  if (day.isSame(selectedDay.value, 'day'))
    return 'primary'

  if (day.date() === dayjs().date() && day.month() === viewDay.value.month())
    return 'secondary-neutral'

  return 'tertiary-neutral'
}
function getMonthButtonType(month: Dayjs) {
  if (month.month() === dayjs().month())
    return 'secondary-neutral'
  else
    return 'tertiary-neutral'
}
function getYearButtonType(year: Dayjs) {
  if (year.year() === dayjs().year())
    return 'secondary-neutral'
  else
    return 'tertiary-neutral'
}

function isDayOutOfRange(day: Dayjs) {
  if (props.from && day.isBefore(props.from, 'day'))
    return true

  if (props.to && day.isAfter(props.to, 'day'))
    return true

  return false
}
function isMonthOutOfRange(month: Dayjs) {
  if (props.from && month.isBefore(props.from, 'month'))
    return true

  if (props.to && month.isAfter(props.to, 'month'))
    return true

  return false
}
function isYearOutOfRange(year: Dayjs) {
  if (props.from && year.isBefore(props.from, 'year'))
    return true

  if (props.to && year.isAfter(props.to, 'year'))
    return true

  return false
}

function handleInput(value: string) {
  const date = dayjs(value)

  if (!date.isValid() || isDayOutOfRange(date)) {
    lastEmittedDate.value = null
    emit('update:modelValue', null)
  }
  else {
    emitDate(date)
  }
}

function emitDate(day: Dayjs) {
  const value = day.startOf('day').toDate()
  lastEmittedDate.value = value.getTime()

  emit('update:modelValue', value)
}

const formattedDate = computed(() => {
  if (selectedDay.value.isValid())
    return selectedDay.value.format('YYYY.MM.DD')
  else
    return ''
})
</script>

<template>
  <neb-dropdown class="neb-datepicker">
    <template #trigger="{ open, close }">
      <NebInput
        ref="input"
        :model-value="formattedDate"
        :disabled="disabled"
        :required="required"
        :label="label"
        :placeholder="placeholder"
        leading-icon="material-symbols:calendar-month-outline-rounded"
        lazy
        @update:model-value="handleInput($event as string)"
        @focus="open()"
        @blur="close()"
      />
    </template>

    <template #content>
      <div class="dropdown" @mousedown.prevent="input!.focus()">
        <header>
          <neb-button :disabled="calendarView === 'month'" type="tertiary-neutral" square @click="handleSubtract()">
            <icon name="material-symbols:chevron-left-rounded" />
          </neb-button>

          <div class="current-date">
            <neb-button type="tertiary-neutral" small @click="calendarView = 'year'">
              {{ viewDay.year() }}
            </neb-button>

            <neb-button type="tertiary-neutral" small @click="calendarView = 'month'">
              {{ viewDay.format('MMMM') }}
            </neb-button>
          </div>

          <neb-button :disabled="calendarView === 'month'" type="tertiary-neutral" square @click="handleAdd()">
            <icon name="material-symbols:chevron-right-rounded" />
          </neb-button>
        </header>

        <div v-if="calendarView === 'day'" class="calendar day">
          <span v-for="name in weekdayjs" :key="name">{{ name }}</span>

          <neb-button
            v-for="day in daysInView"
            :key="day.toString()"
            :type="getDayButtonType(day)"
            :disabled="isDayOutOfRange(day)"
            :class="{ 'not-curr-month': day.month() !== viewDay.month() }"
            square
            @click="handleDayClick(day)"
          >
            {{ day.date() }}
          </neb-button>
        </div>

        <div v-else-if="calendarView === 'month'" class="calendar month">
          <neb-button
            v-for="month in monthsInView"
            :key="month.toString()"
            :type="getMonthButtonType(month)"
            :disabled="isMonthOutOfRange(month)"
            square
            @click="handleMonthClick(month)"
          >
            {{ month.format('MMMM') }}
          </neb-button>
        </div>

        <div v-else class="calendar year">
          <neb-button
            v-for="year in yearInView"
            :key="year.toString()"
            :type="getYearButtonType(year)"
            :disabled="isYearOutOfRange(year)"
            square
            @click="handleYearClick(year)"
          >
            {{ year.year() }}
          </neb-button>
        </div>
      </div>
    </template>
  </neb-dropdown>
</template>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
  gap: var(--space-3);
  border: 1px solid var(--neutral-color-200);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-lg);
  background: var(--white-color);
}
.calendar {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-2);

  &.day {
    grid-template-columns: repeat(7, 1fr);

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--neutral-color-400);
      margin-bottom: var(--space-2);
      text-transform: capitalize;
    }

    .not-curr-month {
      opacity: .5;
    }
  }
  &.month {
    grid-template-columns: repeat(3, 1fr);
  }
  &.year {
    grid-template-columns: repeat(4, 1fr);
  }
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-1);
}
.current-date {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark-mode {
  .dropdown {
    border: 1px solid var(--neutral-color-800);
    background: var(--neutral-color-950);
  }
}
</style>
