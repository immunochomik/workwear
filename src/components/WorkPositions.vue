<template>
  <div class="container-fluid">
    <crud :title="title"
          :fields="fields"
          id-template="_{Id}"></crud>
  </div>
</template>

<script>
  import Crud from './Crud.vue';
  export default {
    name: 'WorkPositions',
    data: function() {
      return {
        title: 'WorkPositions',
        fields: [
          {name: 'Id', type :'number'},
          {name: 'Description', type :'text'},
          {name: 'WorkweareTypes', type :'textarea', placeholder:'List of workweare type ids'},
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