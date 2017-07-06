
<template>
  <div id="app">
    <top-nav></top-nav>
    <router-view
        class="view"
        keep-alive
        transition
        transition-mode="out-in">
    </router-view>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
export default {
  components: {
    TopNav
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
  padding-top: 4em;
}
</style>
