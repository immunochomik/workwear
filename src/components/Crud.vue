<template>
  <div>
    <div class="panel">
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#form{{uni}}">Edit {{title}}</a></li>
        <li><a data-toggle="tab" href="#list{{uni}}">List</a></li>
      </ul>

      <div class="tab-content">
        <div id="form{{uni}}" class="tab-pane fade in active">
          <div class="panel">
            <div class="panel-body">
              <div v-for="item in fields" class="row form-group" style="margin-bottom: 0.5em">
                <label class="control-label col-xs-3 col-md-2 text-right">{{item.name}}</label>
                <div class="col-xs-9 col-md-10">
                  <div  v-if="item.type == 'select' || item.type == 'textarea'">
                  <select v-if="item.type == 'select'" id="{{item.name + uni}}" class="form-control input" name="{{item.name}}">
                    <option v-for="(key, val) in item.options" :value="val" v-text="key"></option>
                  </select>
                  <textarea v-if="item.type == 'textarea'" id="{{item.name  + uni}}" class="form-control input {{item.class}} "
                            name="{{item.name}}" placeholder="{{item.placeholder}}"></textarea>
                  </div>
                  <input v-else id="{{item.name  + uni}}" class="form-control input {{item.class}} "
                         placeholder="{{item.placeholder}}" type="{{item.type}}" name="{{item.name}}"/>
                </div>
              </div>
            </div>
            <div class="panel-footer text-right">
              <button v-if="currentId" @click="cancelEdit">Cancel Edit</button>
              <button class="btn btn-danger" @click="submit">Submit</button>
            </div>
          </div>
        </div>
        <div id="list{{uni}}" class="tab-pane fade in">
          <table @click="tableClick($event)" id="listTable{{uni}}" class="display" width="100%"></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var debug =1;
  import StoreCollection from '../storeCollection';
  var _ = require('lodash');
  var store = new StoreCollection.Collection('workwear');
  export default {
    name: 'Crud',
    props : {
      title : {
        type: String,
        required: true,
      },
      fields: {
        type: Array,
        required: true,
      },
      idTemplate : {
        type: String,
        required: true,
      },
      version : {
        type: Number,
        'default': 1
      },
    },
    data: function() {
      return {
        items: [],
        currentId: null,
        _columns: [],
        _uni: null,
      }
    },
    events: {
      refresh: function() {
        this.refresh();
      }
    },
    computed: {
      uni: function() {
        if(!this._uni) {
          this._uni = this.title.replace(/ /g, '');
        }
        return this._uni;
      },
      columns : function() {
        if(!this._columns) {
          debug && console.log('calculating columns '+ this.uni);
          this._columns = [];
          var self = this;
          _.each(this.fields, function (item) {
            self._columns.push(item.name);
          });
        }
        debug && console.log(this._columns);
        return this._columns;
      },
    },
    methods: {
      refresh: function() {
        debug && console.log('REFRESHING');
        var self = this;
        self.items = [];
        store.allDocs({
          include_docs: true,
          startkey: this.title,
          endkey: this.title + '\uffff',
        }).then(res => {
          _.each(res.rows, function(doc) {
            self.items.push(self.docToRow(doc.doc));
          });
          self.renderTable();
        }).catch(err => {
          console.log('Error', err);
        });
      },
      renderTable: function() {
        debug && console.log('RENDER');
        var columns = [];
        _.each(this.columns, function(col) {
          columns.push({title:col});
        });
        columns.push({title:""});
        var data = {
          data: this.items,
          columns: columns,
          destroy:true,
        };
        var table = $('#listTable'+ this.uni);
        table.destroy && table.destroy();
        table.DataTable(data);
      },
      docToRow: function(doc) {
        var row = [];
        _.each(this.columns, function(col) {
          row.push(doc[col] || "");
        });
        var temp = '<button class="btn btn-xs btn-danger delete-item" data-id="{0}">Delete</button> \
                    <button class="btn btn-xs btn-default edit-item" data-id="{0}">Edit</span></button>';
        row.push(temp.f([doc._id]));
        return row;
      },
      edit: function(id) {
        console.log('Edit', id);
        var self = this;
        store.get(id, function(doc) {
          _.each(self.columns, function(col) {
            console.log( $('#'+col + self.uni));
            $('#'+col + self.uni).val(doc[col]);
          });
          self.currentId = doc._id;
          self.show('form' + self.uni);
        });
      },
      submit: function() {
        var model = {
          ver_ : this.title + this.version,
        };
        _.each($('.input'), function(item) {
          var jitem = $(item);
          model[jitem.attr('name')] = jitem.val();
          jitem.val('');
        });
        model['_id'] = this.makeId(model);
        var self = this;
        store.upsert(model, function() {
          self.refresh();
        });
      },
      makeId: function(model) {
        if(this.currentId) {
          var id = this.currentId;
          this.currentId = null;
          return id;
        }
        return this.uni + this.idTemplate.f(model);
      },
      show: function(what) {
        $('a[href*="#'+what+'"]').click();
      },
      cancelEdit: function() {
        this.currentId = null;
        $('.input').val('')
      },
      tableClick: function(e) {
        var self = this;
        var elClass = e.target.getAttribute('class') || '';
        if(elClass.indexOf('delete-item') != -1) {
          store.removeById(e.target.getAttribute('data-id'), function() {
            self.refresh();
          });
        } else if (elClass.indexOf('edit-item') != -1) {
          this.edit(e.target.getAttribute('data-id'));
        }
      },
    }

  }
</script>

<style>
  .tab-pane {
    padding-top: 1em;
  }
</style>