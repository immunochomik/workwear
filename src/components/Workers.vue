<template>
  <div class="container-fluid">
     <crud
           :model="model"
           ></crud>
  </div>
</template>

<script>
  import Workers from '../data/Workers.js'
  import WorkPositions from '../data/WorkPositions.js';
  var workPositions = WorkPositions.WorkPositions;

  var selectsDone = false;

  export default {
    name: 'Workers',
    data: function() {
      return {
        title: 'Workers',
        model: Workers.Workers,
        positions : {},
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
        if(! selectsDone) {
          this.$nextTick(function () {
            workPositions.setSelect('#PositionWorkers', 'Description');
          });
          selectsDone = true;
        }
      }
    },
    methods: {
      refresh: function() {
        this.$broadcast('refresh');
      }
    },
  }
</script>

