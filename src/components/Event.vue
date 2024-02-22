<template>
  <div :style="styles" class="eventContainer">
    <span class="title">(No title) </span>
    <span class="times">{{ time }}</span>
  </div>
</template>

<script setup lang="ts">
import { IEvent } from "@/pages/Calendar.vue";
import { computed } from "vue";

const { styles, event } = defineProps<{
  styles: any;
  event: IEvent;
}>();

const time = computed(() => {
  return `${extractTimeFromDate(event.startDate!)} - ${extractTimeFromDate(
    event.endDate!
  )}`;
});

function extractTimeFromDate(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
</script>

<style scoped>
.eventContainer {
  pointer-events: none;
  box-shadow: 0px 7px 17px -2px rgba(145, 145, 145, 0.75);
  -webkit-box-shadow: 0px 7px 17px -2px rgba(145, 145, 145, 0.75);
  -moz-box-shadow: 0px 7px 17px -2px rgba(145, 145, 145, 0.75);
}

span {
  color: #fff;
  font-size: 13px;
}
</style>
