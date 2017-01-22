<template>
  <div class="container-fluid">
    <crud
        :model="model"
        :extension="extension"
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
        extension : {
          extend : function(vm) {
            inventory.generateOptions({
              oKey : ['Description', 'Size', 'Origin'],
              callback: function(options) {
                vm.fieldsObject.Workwear.options = options;
              },
              typeObject : 1,
            });
          }
        }
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
        var self = this;
        this.$nextTick(function () {
          self.$nextTick(function() {
            employeeAutocomplete(self);
          });
        });
      }
    },
    events: {
      crudSubmit: function(e) {
        console.log(e);
      }
    },
    methods: {
      refresh: function() {
        this.$broadcast('refresh');
      }
    },
  }

  function employeeAutocomplete (self) {
    $( "#EmployeeReleaseHistory" ).autocomplete({
      source: function(req, show) {
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
  }

</script>

