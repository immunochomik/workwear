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
  var selectsDone;
  export default {
    name: 'Inventory',
    data: function() {
      return {
        title:'Inventory',
        model: Inventory.Inventory,
        extension : {
          extend: function (vm) {
            vm.additionalButtons = [{
              id:'insertWorkwearTypes',
              name:'Insert Workwear Types'
            }];
            vm.addedMethods = {
              insertWorkwearTypes : function() {
                
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
</script>