<template>
  <div class="container-fluid">
    <crud :title="title"
          :fields="fields"
          :form-active="false"
          :list-active="true"
          id-template="_{Id}"></crud>
  </div>
</template>

<script>

  import Crud from './Crud.vue';
  export default {
    name: 'WorkwearTypes',
    data: function() {
      return {
        title: 'WorkwearTypes',
        fields: [
          { name: 'Id', type :'number'},
          { name: 'Description', type :'text'},
          { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F', Universal: 'U'}},
          { name: 'Sizes', type :'textarea', placeholder:'Can be list of values or,  range 36-48 s:2, default step is 2 so can be omitted'},
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