<template>
  <div class="container-fluid">
    <crud
        :model="model"
        ></crud>
  </div>
</template>

<script>
  import Inventory from '../data/Inventory.js'
  import Crud from './Crud.vue';
  import WorkwearTypes from '../data/WorkwearTypes.js';
  var wTypes = WorkwearTypes.WorkwearTypes;
  var selectsDone;
  export default {
    name: 'Inventory',
    data: function() {
      return {
        title:'Inventory',
        model: Inventory.Inventory,
      }
    },
    route: {
      data: function(to) {
        routerCall(this);
        var self = this;
        if(1 || !selectsDone) {
          this.$nextTick(function() {
            var descriptionId = 'DescriptionInventory';
            wTypes.setSelect('#' + descriptionId, ['Description', 'Gender']);
            document.getElementById(descriptionId).addEventListener('change', function(e) {
              self.$broadcast('call',
                {params: {value: $(this).val()}, func: function(val) {
                  console.log('VAl', val);
               }});
            });
            selectsDone = true;
          });
        }
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