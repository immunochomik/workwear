<template>
  <div class="container-fluid">
     <crud
           :model="model"
           :extension="extension"
           ></crud>
  </div>
</template>

<script>
  import Workers from '../data/Workers.js'
  import WorkPositions from '../data/WorkPositions.js';
  import WorkwearTypes from '../data/WorkwearTypes.js'
  var workPositions = WorkPositions.WorkPositions;
  var wTypes = WorkwearTypes.WorkwearTypes;
  var selectsDone = false;

  export default {
    name: 'Workers',
    data: function() {
      return {
        title: 'Workers',
        model: Workers.Workers,
        positions : {},
        extension : {
          extend: function(vm) {
            vm.$watch('fieldsObject.Gender.value', gender => {
              wTypes.generateOptions({
                oKey: ['Description', 'Gender'],
                oValue: ['Description', 'Gender', 'Sizes'],
                condition: function (doc) {
                  return doc.Sizes && (doc.Gender === 'U' || doc.Gender === gender);
                },
                callback:function(options) {
                  vm.fieldsObject.SizesHelper.options = options;
                },
                typeObject: true
              });
            });
            vm.$watch('fieldsObject.SizesHelper.value', clothesType => {
              console.log(clothesType);
            });
          }
        }
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

