
<template>
  <div id="app">
      <!-- Navigation -->
      <top-nav></top-nav>
      <!-- main view -->
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

  components:{
    TopNav
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello Vue!!!!!'
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
  padding-top: 4em;
}
</style>
