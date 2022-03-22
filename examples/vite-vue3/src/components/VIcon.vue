<script setup lang="ts">
  // Utils
  import { computed } from 'vue'

  // Compositions
  import { useIcons } from '../compositions/icons'

  const props = defineProps<{
    icon?: string | object
  }>()

  const icons = useIcons()

  const componentIcon = computed(() => {
    if (!props.icon) return

    if (typeof props.icon === 'string' && props.icon in icons.aliases) {
      return icons.aliases[props.icon]
    }

    return props.icon
  })
</script>

<template>
  <i class="v-icon">
    <slot>
      <component :is="componentIcon" />
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