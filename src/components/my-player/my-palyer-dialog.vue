<script lang="ts" setup>
import MyPlayer from "./my-player.vue";
defineProps<{
  url: string;
}>();
const confirmClose = inject<Function>("confirmClose")
</script>

<template>
  <div>
    <my-player :url="url" />
    <button @click="confirmClose()">close</button>
  </div>
</template>
