import Model from './Model.js';

var Inventory = new Model.Model({
  title : 'Inventory',
  fields: [
    { name: 'Description', type :'select'},
    { name: 'Qty', type :'number', value:0},
    { name: 'Size', type :'text'},
    { name: 'Origin', type :'select', options : {New: 'new', Return : 'return'}},
  ],
  idTemplate : "_{Description}_{Size}_{Origin}",
  version : 1
});

export default {
  Inventory
}