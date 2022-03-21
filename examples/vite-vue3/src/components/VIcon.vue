<script setup lang="ts">
  defineProps<{ icon: Object }>()
</script>

<template>
  <i class="v-icon">
    <slot>
      <component :is="icon" />
    </slot>
  </i>
</template>

<style scoped>
  .v-icon {
    display: inline-block;
    width: 1em;
    height: 1em;
    font-size: 1em;
  }

  .v-icon > svg {
    width: 100%;
    height: 100%;
  }
</style>