import Model from './Model.js';

var WorkPositions = new Model.Model({
  title : 'WorkPositions',
  fields: [
    {name: 'Description', type :'text'},
    {name: 'WorkweareTypesHelper', type:'select',
      'class':'ignore-input extend-vm', call:function(vm) {
      vm.$watch('fieldsObject.WorkweareTypesHelper.value', function(value) {
        if(value) {
          vm.fieldsObject.WorkweareTypes.value += value + ' => 12;\n';
        }
      })}},
    {name: 'WorkweareTypes', type :'textarea', placeholder:'List of workweare type ids'},
  ],
  idTemplate : "_{Description}",
  version : 1
});

export default {
  WorkPositions
}