
import Model from './Model.js';


var Workers = new Model.Model({
  title : 'Workers',
  fields: [
    { name: 'Name', type :'text'},
    { name: 'Position', type: 'select', options: {}},
    { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F'}},
    { name: 'Start', type: 'text', 'class': 'date' },
    { name: 'Sizes', type: 'text'},
  ],
  idTemplate : "_{Name}_{Start}",
  version : 1
});

export default {
  Workers
}