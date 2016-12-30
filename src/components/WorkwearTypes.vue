<template>
  <div class="container-fluid">
    <crud :title="title"
          :fields="fields"
          id-template="_{Start}_{Name}"></crud>
  </div>
</template>

<script>

  import Crud from './Crud.vue';
  export default {
    name: 'WorkwearTypes',
    data: function() {
      return {
        title: 'Workwear Types',
        fields: [
          { name: 'Description', type :'text'},
          { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F'}},
          { name: 'Sizes', type :'text'},
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