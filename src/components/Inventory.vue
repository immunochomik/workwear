<template>
  <div class="container-fluid">
    <crud :title="title"
          :fields="fields"
          id-template="_{Description}_{Size}_{Origin}"></crud>
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
          { name: 'Description', type :'text'},
          { name: 'WorkweareId', type :'number'},
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