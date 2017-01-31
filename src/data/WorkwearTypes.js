import Model from './Model.js';

var WorkwearTypes = new Model.Model({
  title : 'WorkwearTypes',
  fields: [
    { name: 'Description', type :'text'},
    { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F', Universal: 'U'}},
    { name: 'Sizes', type :'textarea', placeholder:'Can be list of values or,  range 36-48 s:2, default step is 2 so can be omitted'},
  ],
  idTemplate : "_{Description}_{Gender}",
  version : 1
});

// makes sizes array from string representation
// 36 - 42  = [36,38,40,42]
// M;L;XL  => [M,L,XL]
WorkwearTypes.extractSizes = function(doc) {
  var raw = [];
  if(doc.Sizes.match(/^\d+\-\d+/)) {
    var minMax = doc.Sizes.split('-');
    raw = range(minMax[0], minMax[1], 2);
  } else {
    raw = doc.Sizes.split(';').map(it=>{return it.trim()});
  }
  return raw;
};

export default {
  WorkwearTypes
}