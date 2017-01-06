import Model from './Model.js';

var WorkPositions = new Model.Model({
  title : 'WorkPositions',
  fields: [
    {name: 'Description', type :'text'},
    {name: 'WorkweareTypesHelper', type:'select',
      'class':'ignore-input on-change', onchange:function(vm) {
      var val =  vm.fieldsObject.WorkweareTypesHelper.value;
      vm.fieldsObject.WorkweareTypes.value += val + ' => 12;\n';
    }},
    {name: 'WorkweareTypes', type :'textarea', placeholder:'List of workweare type ids'},
  ],
  idTemplate : "_{Description}",
  version : 1
});

export default {
  WorkPositions
}