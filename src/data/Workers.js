
import Model from './Model.js';


var Workers = new Model.Model({
  title : 'Workers',
  fields: [
    { name: 'Name', type :'text'},
    { name: 'Position', type: 'select', options: {}},
    { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F'}},
    { name: 'Start', type: 'text', 'class': 'date' },
    { name: 'SizesHelper', type: 'select', 'class' :'ignore-input', options: {}},

    { name: 'Sizes', type: 'textarea'},
  ],
  idTemplate : "_{Name}_{Start}",
  version : 1
});

export default {
  Workers
}