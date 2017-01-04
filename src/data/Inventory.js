import Model from './Model.js';
import WorkwearTypes from './WorkwearTypes.js';
var wTypes = WorkwearTypes.WorkwearTypes;

var Inventory = new Model.Model({
  title : 'Inventory',
  fields: [
    { name: 'Description', type :'select', 'class': 'on-change', onchange:function(vm) {
      wTypes.get(vm.fieldsObject.Description.value, function(doc) {
        var options = [];
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
          options.push([it, it]);
        });
        vm.model.replaceSelect('#SizeInventory', options)
      })
    } },
    { name: 'Qty', type :'number', value:0},
    { name: 'Size', type :'select'},
    { name: 'Origin', type :'select', options : {New: 'new', Return : 'return'}},
  ],
  idTemplate : "_{Description}_{Size}_{Origin}",
  version : 1
});

export default {
  Inventory
}