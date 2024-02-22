<template>
  <div class="mainLayout">
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Header from "@components/Header.vue";
</script>

<style scoped>
.mainLayout {
  min-height: 100dvh;
}
</style>
