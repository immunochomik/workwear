<template>
  <div class="container-fluid">
    <crud
        :model="model"
        ></crud>
  </div>
</template>

<script>
  import Inventory from '../data/Inventory.js'
  import Crud from './Crud.vue';
  export default {
    name: 'Inventory',
    data: function() {
      return {
        title:'Inventory',
        model: Inventory.Inventory,
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