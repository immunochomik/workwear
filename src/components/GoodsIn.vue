<template>
  <div class="container-fluid">
    <crud
        :model="model"
        :extension="extension"
        ></crud>
  </div>

</template>

<script>
  /**
   * If you want to add return item thtoug goods in you need to add that row to inventory first
   * or we add that permutation to inventory population script.
   */
  import GoodsIn from '../data/GoodsIn.js'
  import Inventory from '../data/Inventory.js';
  var inventory = Inventory.Inventory;
  export default {
    data: function() {
      return {
        title: 'GoodsIn',
        model : GoodsIn.GoodsIn,
        workers : {},
        extension : {
          extend : function(vm) {
            inventory.generateOptions({
              // we need to being able to accept goods only that have row in inventory
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
      }
    },
    events: {
      crudSubmit: function(e) {
        var itemId = e.postEdit.Workwear + 'fdsaf',
            qty = e.postEdit.Qty;
        if(!qty || !itemId) {
          return;
        }
        var self = this;
        if(!e.id) {
          // if id is null take of inventory
          inventory.updateQuantity(itemId, qty, function() {
            self.success("Inventory item {0} qty increase by {1}".f([itemId, qty]))
          }, function() {
            self.error("Inventory item not found for " + itemId);
          });
          return;
        }
        if(qty > e.preEdit.Qty) {
          // else if qty was increased take of inventory
          var dif = qty - e.preEdit.Qty;
          inventory.updateQuantity(itemId, dif, function() {
            self.success("Inventory item {0} qty increase by {1}".f([itemId, dif]))
          });
        } else {
          self.warning("Pre edit value is higher that post edit," +
              " I do not know what to do, you need to update Inventory yourself for " +
              itemId);
        }
      }
    },
    methods: {
      onDelete: function(doc) {
        console.log('OnDElete', doc);
      },
      warning: function(message) {
        this.$broadcast('userMessage', {
          type: 'warning',
          message : message,
        });
      },
      error: function(message) {
        this.$broadcast('userMessage', {
          type: 'error',
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



</script>

