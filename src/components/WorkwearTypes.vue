<template>
  {{title}}
</template>

<script>
  export default {
    name: 'WorkwearTypes',
    data: function () {
      return {
        'title': 'WorkWearTypes'
      }
    },
    route: {
      data: function (to) {
        document.title = 'WorkWearTypes';
        toggleTopNavActive('topNavLiWorkwearTypes');
      }
    },
    methods: {}
  }
</script>

<style>
</style>