<template>
  <div>
    <div class="panel">
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#form{{unique}}">Edit {{title}}</a></li>
        <li><a data-toggle="tab" href="#list{{unique}}">List</a></li>
      </ul>

      <div class="tab-content">
        <div id="form{{unique}}" class="tab-pane fade in active">
          <div class="panel">
            <div class="panel-body">
              <div v-for="item in fields" class="row form-group" style="margin-bottom: 0.5em">
                <label class="control-label col-xs-3 col-md-2 text-right">{{item.name}}</label>
                <div class="col-xs-9 col-md-10">
                  <select id="{{item.name + unique}}" class="form-control input" v-if="item.type == 'select'" name="{{item.name}}">
                    <option v-for="(key, val) in item.options" :value="val" v-text="key"></option>
                  </select>
                  <input v-else id="{{item.name  + unique}}" class="form-control input {{item.class}} " type="{{item.type}}" name="{{item.name}}"/>
                </div>
              </div>
            </div>
            <div class="panel-footer text-right">
              <button v-if="currentId" @click="cancelEdit">Cancel Edit</button>
              <button class="btn btn-danger" @click="submit">Submit</button>
            </div>
          </div>
        </div>
        <div id="list{{unique}}" class="tab-pane fade in">
          <table @click="tableClick($event)" id="listTable{{unique}}" class="display" width="100%"></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import StoreCollection from '../storeCollection';
  var _ = require('lodash');
  var store = new StoreCollection.Collection('workwear');
  var cache = {};
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
      unique : {
        type: String,
        required: true,
      },
    },
    data: function() {
      return {
        items: [],
        currentId: null,
      }
    },
    events: {
      refresh: function() {
        this.refresh();
      }
    },
    methods: {
      cancelEdit: function() {
        this.currentId = null;
        $('.input').val('')
      },
      columns : function() {
        if(!cache._columns) {
          console.log('calculating columns');
          cache._columns = [];
          _.each(this.fields, function (item) {
            cache._columns.push(item.name);
          });
        }
        return cache._columns;
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
      edit: function(id) {
        var self = this;
        store.get(id, function(doc) {
          _.each(self.columns(), function(col) {
            $('#'+col + self.unique).val(doc[col]);
          });
          self.currentId = doc._id;
          self.show('form' + self.unique);
        });
      },
      show: function(what) {
        $('a[href*="#'+what+'"]').click();
      },
      refresh: function() {
        console.log('REFRESHING');
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
      docToRow: function(doc) {
        var row = [];
        _.each(this.columns(), function(col) {
          row.push(doc[col] || "");
        });
        var temp = '<button class="btn btn-xs btn-danger delete-item" data-id="{0}">Delete</button> \
                    <button class="btn btn-xs btn-default edit-item" data-id="{0}">Edit</span></button>';
        row.push(temp.f([doc._id]));
        return row;
      },
      renderTable: function() {
        var columns = [];
        _.each(this.columns(), function(col) {
          columns.push({title:col});
        });
        columns.push({title:""});
        var data = {
          data: this.items,
          columns: columns,
          destroy:true,
        };
        var table = $('#listTable'+ this.unique);
        table.destroy && table.destroy();
        table.DataTable(data);
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
        var id = this.currentId;
        if(id) {
          this.currentId = null;
          return id;
        }
        id = this.title + this.idTemplate.f(model);
        return id.replace(/ /g, '_');
      },
    }

  }
</script>

<style>
  .tab-pane {
    padding-top: 1em;
  }
</style>