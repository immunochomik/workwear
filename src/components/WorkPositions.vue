<template>
  <div class="container-fluid">
    <crud
          :model="model"
          ></crud>
  </div>
</template>

<script>
  import WorkPositions from '../data/WorkPositions.js'
  var selectsDone;
  export default {
    name: 'WorkPositions',
    data: function() {
      return {
        title: 'WorkPositions',
        model: WorkPositions.WorkPositions,
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
  }
</script>