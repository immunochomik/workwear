import Model from './Model.js';
import WorkwearTypes from './WorkwearTypes.js';
var wTypes = WorkwearTypes.WorkwearTypes;

var Inventory = new Model.Model({
  title : 'Inventory',
  fields: [
    { name: 'Description', type :'select', 'class': 'extend-vm', call:function(vm) {
      vm.$watch('fieldsObject.Description.value', function (cur) {
        wTypes.get(cur, function(doc) {
          vm.fieldsObject.Size.options = {};
          var raw = [];
          if(doc.Sizes.match(/^\d+\-\d+/)) {
            var minMax = doc.Sizes.split('-');
            raw = range(minMax[0], minMax[1], 2);
          } else {
            raw = doc.Sizes.split(';');
          }
          _.each(raw, function(it) {
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