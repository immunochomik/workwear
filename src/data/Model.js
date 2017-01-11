import StoreCollection from '../storeCollection';
var _ = require('lodash');
var store = new StoreCollection.Collection('workwear');
import helpers from '../helpers/helpers.js';
_.extend(window, helpers);


var debug;
var Model = (function() {
  function Model(settings) {
    this.title = settings.title;
    this.uni = this.title.replace(/ /g, '');
    this.fields = settings.fields;
    this.fieldsObject = {};
    var self = this;
    _.each(this.fields, function(item) {
      self.fieldsObject[item.name] = item;
      if(!self.fieldsObject[item.name].value && self.fieldsObject[item.name].value !== 0) {
        self.fieldsObject[item.name].value = "";
      }
    });
    this.idTemplate = settings.idTemplate || "_{Id}";
    this.version = settings.version || 1;
    this._columns = [];
    for(var i = 0; i< this.fields.length; i++) {
      if(this.fields[i].class && this.fields[i].class.indexOf('ignore-input') != -1) {
        continue;
      }
      self._columns.push(this.fields[i].name);
    }
  };
  Model.prototype.getUni = function() {
    return this.uni;
  };
  Model.prototype.columns = function() {
    return this._columns;
  };
  Model.prototype.getFieldsObject = function() {
    return this.fieldsObject;
  };
  Model.prototype.getFields = function() {
    return this.fields;
  };
  Model.prototype.setSelect = function(selectId, oKey, oValue, condition) {
    var options = [];
    if(!Array.isArray(oKey)) {
      oKey = [oKey];
    }
    var self = this;
    this.list(function(resp) {
      _.each(resp.rows, function(doc) {
        if(condition && !condition(doc.doc)) {
          return;
        }
        var usedKey = [];
        _.each(oKey, function(part) {
          usedKey.push(doc.doc[part]);
        });
        usedKey = usedKey.join('_').replace(/_$/g, '');
        var usedValue = oValue ? doc.doc[oValue] : usedKey;
        options.push([usedKey, usedValue]);
      });
      options.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);});
      debug && pp('options', options);
      self.replaceSelect(selectId, options);
    });
  };
  Model.prototype.replaceSelect = function(selectId, options) {
    var $el = $(selectId);
    $el.empty();
    _.each(options, function(row) {
      $el.append("<option value='{1}'>{0}</option>".f(row));
    });
  };
  Model.prototype.list = function(callback, start, end) {
    debug && console.log('LIST');
    start = start || '';
    end = end ? this.uni + '_' + end : '\uffff';
    start = this.uni + '_' + start;
    var args = {
      include_docs: true,
      startkey: start,
      endkey: end,
    };
    debug && pp(args);
    store.allDocs(args).then(res => {
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
    if(id.indexOf(this.uni) !== 0) {
      id = this.uni + '_' + id;
    }
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