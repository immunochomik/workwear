import Model from './Model.js';

var ReleaseHistory = new Model.Model({
  title : 'ReleaseHistory',
  fields: [
    { name: 'DateTime', type: 'text', 'class': 'datetime' },
    { name: 'Employee', type :'text', placeholder:'Start typing'},
    { name: 'Workweare', type :'text'},
    { name: 'Qty', type :'number', value:1},
  ],
  idTemplate : "_{Id}",
  version : 1
});

export default {
  ReleaseHistory
}