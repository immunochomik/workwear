<template>
  <h1>{{title}}</h1>
</template>

<script>
  export default {
    name: 'WorkPositions',
    data: function () {
      return {
        title:'Work Positions'
      }
    },
    route: {
      data: function (to) {
        document.title = 'Work Positions';
        toggleTopNavActive('topNavLiWorkPositions');
      }
    },
    methods: {}
  }
</script>

<style>
</style>