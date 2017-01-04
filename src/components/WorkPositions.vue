<template>
  <div class="container-fluid">
    <crud
          :model="model"
          ></crud>
  </div>
</template>

<script>
  import WorkPositions from '../data/WorkPositions.js'
  import Crud from './Crud.vue';
  import WorkwearTypes from '../data/WorkwearTypes.js';
  var wTypes = WorkwearTypes.WorkwearTypes;

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
        if(!selectsDone) {
          var self = this;
          this.$nextTick(function () {
            var selectHelper = '#WorkweareTypesHelperWorkPositions';
            wTypes.setSelect(selectHelper, ['Description', 'Gender']);
            $(selectHelper).on('change', function(e) {
              self.$broadcast('appendInput',
                  {name:'WorkweareTypes', value: $(this).val() + ' => 12;\n' });
            });
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
    components: {
      crud : Crud,
    },
  }
</script>