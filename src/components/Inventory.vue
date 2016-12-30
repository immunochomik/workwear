<template>
  <div class="container-fluid">
    <crud :title="title"
          :fields="fields"
          id-template="_{Name}_{Size}_{Origin}"></crud>
  </div>
</template>

<script>

  import Crud from './Crud.vue';
  export default {
    name: 'Inventory',
    data: function() {
      return {
        title: 'Inventory',
        fields: [
          { name: 'Name', type :'text'},
          { name: 'Qty', type :'number'},
          { name: 'Size', type :'text'},
          { name: 'Origin', type :'select', options : {New: 'new', Return : 'return'}},
        ]
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