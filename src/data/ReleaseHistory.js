import Model from './Model.js';

var ReleaseHistory = new Model.Model({
  title : 'ReleaseHistory',
  fields: [
    { name: 'DateTime', type: 'text', 'class': 'datetime',
      onUpsert: function(value) {
        return value ? value : now();
      },
      placeholder: 'Equals to now if blank'
    },
    { name: 'Employee', type :'text', placeholder:'Start typing'},
    { name: 'Workwear', type :'select', options: {}},
    { name: 'Qty', type :'number', value:1, attrs: {min:1, step:1}},
  ],
  idTemplate : "_{DateTime}_{Employee}_{Workwear}",
  version : 1
});

export default {
  ReleaseHistory
}