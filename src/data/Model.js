import StoreCollection from '../storeCollection';
var _ = require('lodash');
var store = new StoreCollection.Collection('workwear');

var Model = (function() {
  function Model(settings) {
    this.title = settings.title;
    this.uni = this.title.replace(/ /g, '');
    this.fields = settings.fields;
    this.idTemplate = settings.idTemplate || "_{Id}";
    this.version = settings.version || 1;
    this._columns = [];
    var self = this;
    _.each(this.fields, function (item) {
      self._columns.push(item.name);
    });
  };
  Model.prototype.getUni = function() {
    return this.uni;
  };
  Model.prototype.columns = function() {
    return this._columns;
  };
  Model.prototype.getFields = function() {
    return this.fields;
  };
  Model.prototype.setSelect = function(selectId, oKey, oValue) {
    var options = {};
    this.list(function(resp) {
      _.each(resp.rows, function(doc) {
        options[doc.doc[oKey]] = doc.doc[oValue];
      });
      pp('options', options);
      console.log(options);
      var $el = $(selectId);
      $el.empty();
      $.each(options, function(key,value) {
        $el.append("<option value='{0}'>{1}</option>".f([value, key]));
      });
    });
  };
  Model.prototype.list = function(callback, start, end) {
    console.log('LIST');
    start = start || '';
    end = end ? this.uni + '_' + end : '\uffff';
    start = this.uni + '_' + start;
    var args = {
      include_docs: true,
      startkey: start,
      endkey: end,
    };
    console.log(this.uni);
    //pp(args);
    store.allDocs(args).then(res => {
      //pp(res);
      res.rows = _.filter(res.rows, function(item) {
        return item.id.indexOf(start) == 0;
      });
      res.total_rows = res.rows.length;
      callback(res);
    }).catch(err => {
      console.log('Error', err);
    });
  };
  Model.prototype.get = function(id, callback) {
    store.get(id, callback);
  };
  Model.prototype.upsert = function(id, item, callback) {
    item['ver_'] = this.uni + this.version;
    item['_id'] = id || this.makeId(item);
    store.upsert(item, callback);
  };
  Model.prototype.removeById = function(id, callback) {
    store.removeById(id,callback);
  };
  Model.prototype.makeId = function(data) {
    return this.uni + this.idTemplate.f(data);
  };
  return Model;
})();

export default {
  Model,
}