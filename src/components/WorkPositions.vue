<template>
  <div class="container-fluid">
    <crud :title="title"
          :fields="fields"
          unique="WorkwearPos"
          id-template="_{Description}_{Gender}_"></crud>
  </div>
</template>

<script>

  import Crud from './Crud.vue';
  export default {
    name: 'WorkPositions',
    data: function() {
      return {
        title: 'Work Positions',
        fields: [
          {name: 'Description', type :'text'},
          {name: 'Workweare types', type :'text'},

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