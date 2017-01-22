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
        var itemId = e.postEdit.Workwear,
            qty = e.postEdit.Qty;
        if(!qty || !itemId) {
          return;
        }
        var self = this;
        // if id is null take of inventory
        if(!e.id) {
          inventory.updateQuantity(itemId, qty, function() {
            self.success("Inventory item {0} qty decreased by {1}".f([itemId, qty]))
          });
          return;
        }
        // else if qty was increased take of inventory
        console.log(qty, e.preEdit.Qty);
        if(qty > e.preEdit.Qty) {
          var dif = qty - e.preEdit.Qty;
          inventory.updateQuantity(itemId, dif, function() {
            self.success("Inventory item {0} qty decreased by {1}".f([itemId, dif]))
          });
        } else {
          self.warning("Pre edit value is higher that post edit," +
              " I do not know what to do, you need to update Inventory yourself for " +
              itemId);
        }
      }
    },
    methods: {
      warning: function(message) {
        this.$broadcast('userMessage', {
          type: 'warning',
          message : message,
        });
      },
      success: function(message) {
        this.$broadcast('userMessage', {
          type: 'success',
          message : message,
        });
      },
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

