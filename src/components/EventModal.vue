<template>
  <div class="eventModalContainer">
    <div class="eventModalContent">
      <header>
        <h2>&times;</h2>
      </header>
      <div class="body">
        <div class="form-element">
          <input type="text" placeholder="Add title" />
        </div>

        <div class="body__date">{{ eventDateFormatted }}</div>

        <!-- color selector -->

        <div class="footer">
          <button>Cancel</button>
          <button>Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IEvent } from "@/pages/Calendar.vue";

const { event } = defineProps<{
  event: IEvent;
}>();

const eventDateFormatted = computed(() => {
  return `${new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  }).format(event.startDate!)}  ${new Intl.DateTimeFormat("en-us", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  }).format(event.startDate!)} - ${new Intl.DateTimeFormat("en-us", {
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  }).format(event.endDate!)}`;
});
</script>

<style scoped>
.eventModalContainer {
  width: 100%;
  max-width: 100%;

  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
}
.eventModalContent {
  width: 500px;
  max-width: 90dvw;
  margin: auto;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  border-radius: 5px;
}

header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 5px;
  background-color: #eee;
  padding-inline: 20px;
  cursor: move;
}

header > h2 {
  cursor: pointer;
  color: #777;
}

.body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-element {
  display: flex;
  flex-direction: column;
}

.form-element > input {
  font-size: 22px;
}

.form-element > input,
.form-element > textarea {
  height: 30px;
  border: none;
  border-bottom: 1px solid rgb(141, 224, 141);
  outline: none;
}

.form-element > textarea {
  background-color: #ecfff6;
  resize: none;
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

.footer > button {
  padding: 10px;
  color: #fff;
  background-color: rgb(141, 224, 141);
  border: none;
  outline: none;
  border-radius: 3px;
  font-weight: bold;
}
</style>
