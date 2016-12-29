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
              <div v-for="(name, type) in fields" class="form-group">
                <label class="control-label col-xs-3 col-md-2 text-right">{{name}}</label>
                <div class="col-xs-9 col-md-10">
                  <input id="{{name}}" class="form-control {{type}}" type="text" name="{{name}}"/>
                </div>
              </div>
            </div>
            <div class="panel-footer text-right">
              <button class="btn btn-danger" @click="submit">Add</button>
            </div>
          </div>
        </div>
        <div id="list" class="tab-pane fade">
          <table id="listTable" class="display" width="100%"></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  var fields = {
    Name: 'text',
    Position : 'text',
    Size : 'text',
    Office : 'text',
    Id : 'text',
    Start : 'date',
  };


  import StoreCollection from '../storeCollection';
  var _ = require('lodash');
  var store = new StoreCollection.Collection('workwear');

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
      }
    },
    methods: {
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
          })
          self.renderTable();
        }).catch(err => {
          console.log('Error', err);
        });
        setTimeout(function() {
          $('.date').datetimepicker({
            timepicker:false,
            format:'Y-m-d'
          });
        }, 500);
      },
      docToRow: function(doc) {
        var row = [];
        for(var col in this.fields) {
          row.push(doc[col] || "");
        }
        return row;
      },
      submit: function() {
        var inputs = inputs = document.getElementsByTagName('input');
        var model = {
          ver_ : this.title + this.version,
        };
        for (var i=0; i<inputs.length; i++){
          model[inputs[i].name] = inputs[i].value;
          inputs[i].value = "";
        }
        model['_id'] = this.makeId(model);
        store.put(model);
        this.refresh();
      },
      renderTable: function() {
        var columns = [];
        for(var key in this.fields) {
          columns.push({title:key});
        }
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
      makeId: function(model) {
        return this.title + this.idTemplate.f(model);
      },
    }

  }
</script>

<style>
  .tab-pane {
    padding-top: 1em;
  }
</style>