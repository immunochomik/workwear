<template>
  <div class="container-fluid">
    <crud
        :model="model"
        :extension="extension"
        ></crud>
  </div>
</template>

<script>
  import Inventory from '../data/Inventory.js'
  import WorkwearTypes from '../data/WorkwearTypes.js';
  var wTypes = WorkwearTypes.WorkwearTypes;
  var inventory = Inventory.Inventory;
  var selectsDone;
  export default {
    name: 'Inventory',
    data: function() {
      return {
        title:'Inventory',
        model: inventory,
        extension : {
          extend: function (vm) {
            vm.additionalButtons = [{
              id:'insertWorkwearTypes',
              name:'Insert Workwear Types'
            }];
            vm.addedMethods = {
              insertWorkwearTypes : function() {
                // get data from types
                wTypes.list(function(res) {
                  _.each(res.rows, insertItemIfNotInInventory);
                });
              }
            }
          }
        }
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
        if(1 || !selectsDone) {
          this.$nextTick(function() {
            wTypes.setSelect('#DescriptionInventory', ['Description', 'Gender']);
            selectsDone = true;
          });
        }
      }
    },
    methods: {
      refresh: function() {
        this.$broadcast('refresh');
      }
    }
  }

  function insertItemIfNotInInventory(wType) {
    var idBase = wType.id.replace(wTypes.uni, '').replace(/^_/, '');
    var sizes = wTypes.extractSizes(wType.doc);
    _.each(sizes, function(size) {
      var itemId = "{0}_{1}_new".f([idBase, size]);
      inventory.get(itemId, function(doc) {
            console.log('Found', doc);
          },
          function(err) {
            if(err.status !== 404) {
              console.error(err);
              return;
            }
            inventory.put({
              Description: wType.doc.Description,
              Size: size,
              Origin: 'new',
              Qty: 0,
            });
          }
      );
    });
  };

</script>