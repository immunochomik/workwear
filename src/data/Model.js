import StoreCollection from '../storeCollection';
var _ = require('lodash');
var store = new StoreCollection.Collection('workwear');

var debug =1;
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
    var options = [];
    if(!Array.isArray(oKey)) {
      oKey = [oKey];
    }
    this.list(function(resp) {
      _.each(resp.rows, function(doc) {
        var usedKey = [];
        _.each(oKey, function(part) {
          usedKey.push(doc.doc[part]);
        });
        options.push([usedKey.join('_').replace(/_$/g, ''), doc.doc[oValue]]);
      });
      options.sort(function(a,b) {return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0);});
      debug && pp('options', options);
      var $el = $(selectId);
      $el.empty();
      _.each(options, function(row) {
        $el.append("<option value='{1}'>{0}</option>".f(row));
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