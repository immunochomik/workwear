
import Model from './Model.js';


var Workers = new Model.Model({
  title : 'Workers',
  fields: [
    { name: 'Name', type :'text'},
    { name: 'Position', type: 'select', options: {}},
    { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F'}},
    { name: 'Start', type: 'text', 'class': 'date',
      onUpsert: function(value) {
       return value ? value : today();
      }},
    { name: 'Sizes', type: 'textarea', attrs:{rows: 10},
      onUpsert: function(text) {
        return text.replace(/\/\/.*\n/g, '\n').replace(/\/\/\ reference.*$/, '');
      }},
  ],
  idTemplate : "_{Name}_{Start}",
  version : 1
});

export default {
  Workers
}