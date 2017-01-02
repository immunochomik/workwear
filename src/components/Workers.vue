<template>
  <div class="container-fluid">
     <crud
           :model="model"
           ></crud>
  </div>
</template>

<script>
  import Workers from '../data/Workers.js'
  import Crud from './Crud.vue';
  export default {
    name: 'Workers',
    data: function() {
      return {
        title: 'Workers',
        model: Workers.Workers,
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
      }
    },
    methods: {
      refresh: function() {
        this.$broadcast('refresh');
      }
    },
    components: {
      crud : Crud,
    },
  }
</script>

