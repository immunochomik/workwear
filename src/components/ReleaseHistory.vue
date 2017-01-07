<template>
  <div class="container-fluid">
    <crud
        :model="model"
        ></crud>
  </div>

</template>

<script>
  import ReleaseHistory from '../data/ReleaseHistory.js'
  import Workers from '../data/Workers.js';
  import Inventory from '../data/Inventory.js';
  var workers = Workers.Workers;
  var inventory = Inventory.Inventory;
  export default {
    name: 'ReleaseHistory',
    data: function() {
      return {
        title: 'ReleaseHistory',
        model : ReleaseHistory.ReleaseHistory,
        workers : {},
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
        var self = this;
        this.$nextTick(function () {
          inventory.setSelect('#WorkwearReleaseHistory', ['Description', 'Size', 'Origin']);
          self.$nextTick(function() {
            $( "#EmployeeReleaseHistory" ).autocomplete({
              source: function(req, show) {
                console.log(req, show);
                workers.list(function(data) {
                  var list = [];
                  _.each(data.rows, function(doc) {
                    self.workers[doc.doc.Name] = doc;
                    list.push(doc.doc.Name);
                  });
                  show(list)
                }, req.term)
              }
            });
          });
        });
      }
    },
    methods: {
      callObject: function() {
        this.$broadcast('callObject');
      },
      refresh: function() {
        this.$broadcast('refresh');
      }
    },
  }
</script>

