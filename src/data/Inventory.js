import Model from './Model.js';
import WorkwearTypes from './WorkwearTypes.js';
var wTypes = WorkwearTypes.WorkwearTypes;

var Inventory = new Model.Model({
  title : 'Inventory',
  fields: [
    { name: 'Description', type :'select',  extend:function(vm) {
      vm.$watch('fieldsObject.Description.value', function (cur) {
        wTypes.get(cur, function(doc) {
          vm.fieldsObject.Size.options = {};
          _.each(wTypes.extractSizes(doc), function(it) {
            if(it.trim) {
              it = it.trim();
            }
            vm.fieldsObject.Size.options[it] = it;
          });
        })
      });
    } },
    { name: 'Qty', type :'number', value:0},
    { name: 'Size', type :'select', options: {}},
    { name: 'Origin', type :'select', options : {New: 'new', Return : 'return'}},
  ],
  idTemplate : "_{Description}_{Size}_{Origin}",
  version : 1
});

export default {
  Inventory
}