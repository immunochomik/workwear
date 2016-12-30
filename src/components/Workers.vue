<template>
  <div class="container-fluid">
     <crud :title="title"
           :fields="fields"
           unique="Workers"
           id-template="_{Start}_{Name}"></crud>
  </div>
</template>

<script>

  import Crud from './Crud.vue';
  export default {
    name: 'Workers',
    data: function() {
      return {
        title: 'Workers',
        fields: [
          { name: 'Name', type :'text'},
          { name: 'Position', type: 'text'},
          { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F'}},
          { name: 'Start', type: 'text', 'class': 'date' },
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

