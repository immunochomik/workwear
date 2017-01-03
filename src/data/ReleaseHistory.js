import Model from './Model.js';

var ReleaseHistory = new Model.Model({
  title : 'ReleaseHistory',
  fields: [
    { name: 'DateTime', type: 'text', 'class': 'datetime' },
    { name: 'Employee', type :'text', placeholder:'Start typing'},
    { name: 'Workwear', type :'select'},
    { name: 'Qty', type :'number', value:1},
  ],
  idTemplate : "_{DateTime}_{Employee}_{Workwear}",
  version : 1
});

export default {
  ReleaseHistory
}