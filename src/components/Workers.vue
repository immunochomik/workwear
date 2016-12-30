<template>
  <div class="container-fluid">
    <!-- Latest compiled and minified CSS -->
    <div class="panel">
      <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#form">Add {{title}}</a></li>
        <li><a data-toggle="tab" href="#list">List</a></li>
      </ul>

      <div class="tab-content">
        <div id="form" class="tab-pane fade in active">
          <div class="panel">
            <div class="panel-body">
              <div v-for="item in fields" class="form-group">
                <label class="control-label col-xs-3 col-md-2 text-right">{{item.name}}</label>
                <div class="col-xs-9 col-md-10">
                  <select id="{{item.name}}" class="form-control input" v-if="item.type == 'select'" name="{{item.name}}">
                    <option v-for="(key, val) in item.options" :value="val" v-text="key"></option>
                  </select>
                  <input v-else id="{{item.name}}" class="form-control input {{item.class}} " type="{{item.type}}" name="{{item.name}}"/>
                </div>
              </div>
            </div>
            <div class="panel-footer text-right">
              <button class="btn btn-danger" @click="submit">Add</button>
            </div>
          </div>
        </div>
        <div id="list" class="tab-pane fade in">
          <table @click="tableClick($event)" id="listTable" class="display" width="100%"></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  var fields = [
    { name: 'Name', type :'text'},
    { name: 'Position', type: 'text'},
    { name: 'Gender',  type: 'select', options : {Male: 'M',Female : 'F'}},
    { name: 'Start', type: 'text', 'class': 'date' },
  ];

  import StoreCollection from '../storeCollection';
  var _ = require('lodash');
  var store = new StoreCollection.Collection('workwear');

  var cache = {};
  export default {
    name: 'Workers',
    data: function() {
      return {
        title: 'Workers',
        fields: fields,
        items: [],
        version : 1,
        idTemplate : "_{Name}_{Start}"
      }
    },
    route: {
      data: function(to) {
        document.title = this.title;
        toggleTopNavActive('topNavLi' + this.title);
        this.refresh();
        setTimeout(function() {
          $('.date').datetimepicker({timepicker:false, format:'Y-m-d'});
        }, 800);
      }
    },
    methods: {
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
            $('#'+col).val(doc[col]);
          });
          self.show('form');
        });
      },
      show: function(what) {
        $('a[href*="#'+what+'"]').click();
      },
      refresh: function() {
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
        var table = $('#listTable');
        console.log(table.destroy);
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
        store.put(model);
        this.refresh();
      },
      makeId: function(model) {
        var id = this.title + this.idTemplate.f(model);
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