<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app flow">
    <header>
      <h1><RouterLink to="/">Flash Card Online</RouterLink></h1>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app {
  width: min(100% - 4em, 60em);
  margin-inline: auto;
  padding-block: 3em;
}

h1 {
  font-size: 1.125em;
  font-family: consolas, monospace;
}

h1 a {
  color: #777;
  text-decoration: none;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}
</style>
