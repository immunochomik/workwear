import StoreCollection from '../storeCollection';
var _ = require('lodash');
var store = new StoreCollection.Collection('workwear');

var Model = (function() {
  function Model(settings) {
    console.log(settings);
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
  Model.prototype.list = function(callback, start, end) {
    start = start || '';
    end = end || '';
    start = this.uni + start;
    end = this.uni + end + '\uffff';
    var args = {
      include_docs: true,
      startkey: start,
      endkey: end,
    };
    store.allDocs(args).then(res => {
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
  }
  return Model;
})();

export default {
  Model,
}