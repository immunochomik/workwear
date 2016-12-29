<template>
  <h1>{{title}}</h1>
</template>
<script>
  export default {
    name: 'Inventory',
    data: function () {
      return {
        title:'Inventory'
      }
    },
    route: {
      data: function (to) {
        document.title = 'Inventory';
        toggleTopNavActive('topNavLiInventory');
      }
    },
    methods: {}
  }
</script>

<style>
</style>