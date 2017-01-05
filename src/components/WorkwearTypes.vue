<template>
  <div class="container-fluid">
    <crud
        :model="model"
          :form-active="false"
          :list-active="true"
        ></crud>
  </div>
</template>

<script>
  import WorkwearTypes from '../data/WorkwearTypes.js'
  export default {
    name: 'WorkwearTypes',
    data: function() {
      return {
        title: 'WorkwearTypes',
        model: WorkwearTypes.WorkwearTypes,
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
    }
  }
</script>