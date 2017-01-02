import Model from './Model.js';

var WorkwearTypes = new Model.Model({
  title : 'WorkwearTypes',
  fields: [
    { name: 'Id', type :'text'},
    { name: 'Description', type :'text'},
    { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F', Universal: 'U'}},
    { name: 'Sizes', type :'textarea', placeholder:'Can be list of values or,  range 36-48 s:2, default step is 2 so can be omitted'},
  ],
  idTemplate : "_{Id}",
  version : 1
});

export default {
  WorkwearTypes
}