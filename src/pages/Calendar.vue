<template>
  <div class="calendarContainer">
    <div class="header">
      <div class="placeholder"></div>
      <div class="header__days">
        <div
          :class="[
            'header__day',
            new Date().getDate() === day.dayNumber ? 'highlight-day' : '',
          ]"
          v-for="(day, index) in daysHeader"
          :key="index"
        >
          <p class="header__dayString">{{ day.dayString }}</p>
          <p class="header__dayNumber">{{ day.dayNumber }}</p>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="times-column placeholder">
        <p class="single-time-container" v-for="hour in HOURS" :key="hour">
          <span class="hour">{{ hour }}</span>
        </p>
      </div>
      <div class="main">
        <div
          class="main__day-col"
          v-for="(day, colIndex) in daysHeader"
          :key="day.dayNumber"
          ref="columnElementRefs"
        >
          <div
            class="hourCell"
            v-for="(hour, rowIndex) in HOURS"
            :key="hour"
            @mousedown.left="
              handleMousedown(
                $event,
                new Date(concatDateAndTime(daysOfCurrentWeek[colIndex], hour)),
                colIndex,
                rowIndex
              )
            "
            @mouseup="handleMouseup"
            @mouseover.left="
              handleMouseover(
                colIndex,
                rowIndex,
                new Date(concatDateAndTime(daysOfCurrentWeek[colIndex], hour))
              )
            "
          >
            {{ hour }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h, render } from "vue";
import Event from "@components/Event.vue";

export interface IEvent {
  id: number;
  title: string;
  description?: string;
  startDate: Date | null;
  endDate: Date | null;
  color?: string;
}
interface IEventHeader {
  dayString: string;
  dayNumber: number;
}
type IEventHeaders = IEventHeader[];

const CELL_HEIGHT = 40;
const HOURS = generateTimeArray();

const eventElementStyles = ref({
  position: "absolute",
  width: "",
  height: CELL_HEIGHT + "px",
  backgroundColor: "rgb(141, 224, 141)",
  zIndex: "100",
  top: "",
  left: "",
  bottom: "",
});

const isModalVisible = ref(false);

const daysOfCurrentWeek = ref<Date[]>(getDaysOfCurrentWeek());

const columnElementRefs = ref<HTMLDivElement[] | null>(null);
const isClicked = ref<boolean>(false);
const indexOfClickedColumn = ref<number>(-1);

const daysHeader = computed((): IEventHeaders => {
  return getDaysOfCurrentWeek().map((date) => ({
    dayString: getDayName(date),
    dayNumber: date.getDate(),
  }));
});

const newEvent = ref<IEvent>({
  id: 1,
  title: "New Event Title",
  description: "New Event Description",
  startDate: null,
  endDate: null,
  color: "rgb(141, 224, 141)",
});

function concatDateAndTime(date: Date, time: string): Date {
  return new Date(`${date.toISOString().slice(0, 10)}T${time}:00`);
  //   const originalDate = new Date("Mon Feb 12 2024 00:00:00 GMT+0100 (UTC+01:00)");
  // const timeString = "15:00";

  // // Extract time components
  // const [hour, minute] = timeString.split(":").map(Number);

  // // Create a new Date object with the same date but updated time
  // const updatedDate = new Date(
  //   originalDate.getFullYear(),
  //   originalDate.getMonth(),
  //   originalDate.getDate(),
  //   hour,
  //   minute
  // );
}

function generateTimeArray(): string[] {
  const timesOfDay: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    timesOfDay.push(`${formattedHour}:00`);
  }
  return timesOfDay;
}

function getDayName(date: Date): string {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return daysOfWeek[date.getDay()].substring(0, 3).toUpperCase();
}

function getDaysOfCurrentWeek(): Date[] {
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  const monday = new Date(today);
  monday.setDate(
    today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)
  );

  const daysOfWeek: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    daysOfWeek.push(date);
  }

  return daysOfWeek;
}

onMounted(() => {
  getDaysOfCurrentWeek();
});

function resetStyles() {
  eventElementStyles.value = {
    position: "absolute",
    width: "",
    height: CELL_HEIGHT + "px",
    backgroundColor: "rgb(141, 224, 141)",
    zIndex: "100",
    top: "",
    left: "",
    bottom: "",
  };
}

function resetNewEvent() {
  newEvent.value = {
    id: 1,
    title: "New Event Title",
    description: "New Event Description",
    startDate: null,
    endDate: null,
    color: "rgb(141, 224, 141)",
  };
}

function renderComponent(component: any, parent: any, props: any) {
  const vueComponent = h(component, props);
  render(vueComponent, parent);
}

function handleMousedown(
  _: Event,
  startDate: Date,
  index: number,
  rowIndex: number
): void {
  indexOfClickedColumn.value = index;
  isClicked.value = true;
  resetNewEvent();
  resetStyles();
  newEvent.value.startDate = startDate;
  newEvent.value.endDate = new Date(startDate.getTime() + 60 * 60_000);

  eventElementStyles.value.width = `180.58px`;

  eventElementStyles.value.top = `${rowIndex * CELL_HEIGHT}px`;

  renderComponent(Event, columnElementRefs.value![index], {
    styles: eventElementStyles.value,
    event: newEvent.value,
  });
}

function isPartiallyResizable(colIndex: number): boolean {
  return isClicked.value && colIndex === indexOfClickedColumn.value;
}

function canExtendEventTime(colIndex: number, cellDate: Date): boolean {
  return (
    isPartiallyResizable(colIndex) &&
    cellDate.getTime() >= newEvent.value.endDate!.getTime()
  );
}

function canShrinkEventTime(colIndex: number, cellDate: Date): boolean {
  return (
    isPartiallyResizable(colIndex) &&
    cellDate.getTime() < newEvent.value.endDate!.getTime()
  );
}

function canStartFromBottom(colIndex: number, cellDate: Date): boolean {
  return (
    isPartiallyResizable(colIndex) &&
    cellDate.getTime() < newEvent.value.startDate!.getTime()
  );
}

function getIncreasedEventHeight(
  oldHeight: number,
  increaseBy: number
): number {
  return oldHeight + increaseBy;
}

function getDecreasedEventHeight(
  oldHeight: number,
  decreaseBy: number
): number {
  return oldHeight - decreaseBy;
}

function handleMouseover(
  colIndex: number,
  rowIndex: number,
  cellDate: Date
): void {
  // increase event element height
  if (canExtendEventTime(colIndex, cellDate)) {
    newEvent.value.endDate = new Date(
      newEvent.value.endDate!.getTime() + 60 * 60_000
    );

    eventElementStyles.value.height =
      getIncreasedEventHeight(
        Number(eventElementStyles.value.height.split("px")[0]),
        CELL_HEIGHT
      ) + "px";
    return;
  }

  // if user start moving to top
  if (canStartFromBottom(colIndex, cellDate)) {
    newEvent.value.endDate = new Date(
      newEvent.value.startDate!.getTime() + 60 * 60_000
    );
    newEvent.value.startDate = cellDate;
    const HOURS_IN_DAY = 23;
    eventElementStyles.value.bottom = `${
      CELL_HEIGHT * (HOURS_IN_DAY - (rowIndex + 1))
    }px`;

    eventElementStyles.value.top = "";

    eventElementStyles.value.height =
      getIncreasedEventHeight(
        Number(eventElementStyles.value.height.split("px")[0]),
        CELL_HEIGHT
      ) + "px";

    return;
  }

  // decrease event time
  if (canShrinkEventTime(colIndex, cellDate)) {
    newEvent.value.endDate = new Date(
      newEvent.value.endDate!.getTime() - 60 * 60_000
    );

    eventElementStyles.value.height =
      getDecreasedEventHeight(
        Number(eventElementStyles.value.height.split("px")[0]),
        CELL_HEIGHT
      ) + "px";

    return;
  }
}

function handleMouseup(): void {
  isClicked.value = false;
  isModalVisible.value = true;
}
</script>

<style scoped>
.calendarContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  user-select: none;
  color: #999;
  /* height: 100%; */
}

.header {
  display: flex;
}

.header__days {
  flex: 1;
  display: flex;
}

.header__day {
  padding-left: 10px;
  flex: 1;
  font-weight: 600;
}

.header__dayString {
  font-size: 13px;
}

.highlight-day {
  color: rgb(141, 224, 141);
}

.body {
  /* background-color: #ddd; */
  flex: 1;
  display: flex;
}

.placeholder {
  width: 40px;
}

.times-column {
  /* background-color: #0f0; */
  /* width: 100px; */
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

.single-time-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 8px;
  flex: 1;
  position: relative;
}

.hour {
  position: relative;
  top: -7px;
}

.cells-container {
  background-color: #00f;
  flex: 1;
  /* display: flex;
  flex-direction: column; */
}

.main {
  flex: 1;
  display: flex;
  position: relative;
}

.main__day-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: red;
}

.hourCell {
  /* flex: 1;
  display: flex;
  align-items: center;
  justify-content: center; */
  text-align: center;
  border-left: 0.5px solid #eaeaea;
  border-top: 0.5px solid #eaeaea;
  background-color: #fff;
  position: relative;
  height: 40px;
  background: #333;
}

.main__day-col:first-of-type > .hourCell::before {
  position: absolute;
  content: "";
  top: -0.5px;
  left: -10px;
  width: 10px;
  height: 0.5px;
  background-color: #eaeaea;
}

.main__day-col:first-of-type > .hourCell::after {
  position: absolute;
  content: "";
  top: -10px;
  left: -1.5px;
  width: 0.5px;
  height: 10px;
  background-color: #eaeaea;
}

.main__day-col:not(:first-of-type):nth-child(odd) > .hourCell::after {
  position: absolute;
  content: "";
  top: -10px;
  left: -1.5px;
  width: 0.5px;
  height: 10px;
  background-color: #eaeaea;
}

.main__day-col:not(:first-of-type):nth-child(even) > .hourCell::after {
  position: absolute;
  content: "";
  top: -10px;
  left: -0.5px;
  width: 0.5px;
  height: 10px;
  background-color: #eaeaea;
}

.hourcell: first-of-type;
</style>
