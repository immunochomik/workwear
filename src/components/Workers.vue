<template>
  <div class="container-fluid">
     <crud
           :model="model"
           ></crud>
  </div>
</template>

<script>
  import Workers from '../data/Workers.js'
  import Crud from './Crud.vue';
  import WorkPositions from '../data/WorkPositions.js';
  var workPositions = WorkPositions.WorkPositions;

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
        var self = this;
        setTimeout(function () {
          console.log('trying');
          $("#PositionWorkers").autocomplete({
            source: function (req, show) {
              workPositions.list(function (data) {
                var list = [];
                _.each(data.rows, function (doc) {
                  //self.positions[doc.doc.Description] = doc;
                  //list.push(doc.doc.Name);
                });
                show(list)
              })
            }
          });
        }, 800);
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

