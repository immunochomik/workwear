
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

/**
 * Get string representation of worker sizes and produce object
 * used in to do generation.
 *  'Kurtka_M => [ 50 ]
 *   Obuwie_U => [ 38 ]'
 *
 *  { Kurtka : [ Kurtka_M_50 ] }
 * @param String sizes
 */
Workers.workerSizes = function(sizes) {
  var out = {};
   sizes = sizes.split('\n').map(function(x) {
     return x.split('=>').map(function(x) {return x.replace(/^ | $/g, '')})});
  _.each(sizes, function(row) {
    var name = row[0].split('_');
    var numbers = row[1].replace(/^\[\ *|\ *\]$/g, '').split(';');
    pp(numbers);
  });
};

export default {
  Workers
}