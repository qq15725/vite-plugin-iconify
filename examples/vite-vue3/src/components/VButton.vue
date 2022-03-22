<script setup lang="ts">
  import VIcon from './VIcon.vue'

  defineProps<{
    prependIcon?: string | object
  }>()
</script>

<template>
  <button class="v-button">
    <v-icon v-if="$slots['prepend-icon'] || prependIcon" :icon="prependIcon">
      <slot name="prepend-icon" />
    </v-icon>
    <span><slot /></span>
  </button>
</template>

<style>
  .v-button {
    display: inline-flex;
    align-items: center;
  }
  .v-button .v-icon {
    margin-inline-end: 4px;
  }
</style>