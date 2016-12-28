var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-quick-search/lib'));
var _ = require('lodash');

function myDeltaFunction(doc) {
  doc.counter = doc.counter || 0;
  doc.counter++;
  return doc;
}


var Collection = (function() {
  function Collection(name) {
    this.db = new PouchDB(name);
  }
  Collection.prototype.search = function(text, fields) {
    return this.db.search({
      query: text,
      fields: fields,
      include_docs: true
    });
  };
  Collection.prototype.put = function(doc) {
    return this.db.put(doc);
  };
  Collection.prototype.update = function(item) {
    if(!item._rev && item._id) {
      this.db.get(item._id).then(res => {
        item._rev = res._rev;
        this.db.put(item).then(res => {
          console.log('Update', res);
        }).catch(err => {
          console.log('U Error', err);
        });
      }).catch(err => {
        this.db.put(item);
      });
    } else {
      return this.db.put(item);
    }
  };
  Collection.prototype.get = function(id) {
    return this.db.get(id);
  };
  Collection.prototype.query = function(index, criteria) {
    return this.db.query(index, criteria);
  };
  Collection.prototype.allDocs = function(options) {
    return this.db.allDocs(options);
  };
  Collection.prototype.compact = function () {
    this.db.compact().then(res => {
        console.log(res);
    }).catch(err => {
        console.log('Error', err);
    });
  };
  Collection.prototype.all = function() {
    return this.db.allDocs({
      include_docs:true
    });
  };
  Collection.prototype.allSorted = function(list, callback, criteria) {
    var tempList = [];
    criteria = criteria || {include_docs:true};
    this.db.allDocs(criteria).then(res => {
          _.each(res.rows, function(item) {
              if (item.doc) {
                  tempList.push(item.doc);
              }
          });
          tempList = _.sortBy(tempList, callback);
          _.each(tempList, function (item) {
              list.push(item);
          })
      }).catch(err => {
          console.log('Error ' + err);
      })
  };
  Collection.prototype.remove = function(item) {
    return this.db.remove(item);
  };

  Collection.prototype.removeById = function(id) {
    var self = this;
    this.db.get(id).then(doc => {
      return self.db.remove(doc);
    }).catch(err => {
      console.log('Error', err);
    });
  };
  Collection.prototype.init = function(ddoc) {
    var promiss = this.update(ddoc);
    if(promiss) {
      promiss.then(res => {
        console.log(res);
      }).catch(err => {
        console.log('Error', err);
      });
    }
  };
  Collection.prototype.ensureIndexes = function(ddoc)
  {
      var self = this;
      this.get('_design/index').then(res => {
          //if there than do nothing
      }).catch(err => {
          if(err.status === 404) {
              self.init(ddoc);
          } else {
              console.log('Error', err);
          }
      });
  };
  Collection.prototype.destroy = function() {
    this.db.destroy().then(res => {
        console.log(res);
    }).catch(err => {
        console.log('Error', err);
    });
  }
  return Collection;
})();

export default {
  Collection : Collection
}
