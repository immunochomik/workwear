import Model from './Model.js';

var WorkPositions = new Model.Model({
  title : 'WorkPositions',
  fields: [
    {name: 'Id', type :'number'},
    {name: 'Description', type :'text'},
    {name: 'WorkweareTypes', type :'textarea', placeholder:'List of workweare type ids'},
  ],
  idTemplate : "_{Id}",
  version : 1
});

export default {
  WorkPositions
}