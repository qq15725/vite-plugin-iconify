<script lang="ts" setup>
  import VButton from './components/VButton.vue'
  import VIcon from './components/VIcon.vue'
  import IconMdiDelete from '~icons/mdi/delete'
</script>

<template>
  <v-button prepend-icon="mdi-delete" />
  <v-icon icon="mdi-delete" />
  <v-icon><icon-mdi-delete /></v-icon>
  <v-icon><icon-dashboard /></v-icon>
  <v-icon><icon-settings /></v-icon>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2C3E50;
    margin-top: 60px;
    font-size: 30px;
  }
</style>
