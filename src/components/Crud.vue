<template>
  <div>
    <div class="panel">
      <ul class="nav nav-tabs">
        <li v-bind:class="{ active: formActive }"><a data-toggle="tab" href="#form{{uni}}">Edit {{title}}</a></li>
        <li v-bind:class="{ active: listActive }"><a data-toggle="tab" href="#list{{uni}}">List</a></li>
      </ul>

      <div class="tab-content">
        <div id="form{{uni}}" v-bind:class="{ active: formActive }" class="tab-pane fade in">
          <form  v-on:submit.prevent="onSubmit">
            <div class="panel">
            <div class="panel-body">
              <div v-for="(index, item) in fieldsObject" class="row form-group" style="margin-bottom: 0.5em">
                <label class="control-label col-xs-3 col-md-2 text-right">{{item.name}}</label>
                <div class="col-xs-9 col-md-10">
                  <div v-if="item.type == 'select' || item.type == 'textarea'">
                    <select v-if="item.type == 'select'" id="{{item.name + uni}}" class="form-control input {{item.class}}"
                            name="{{item.name}}" v-model="item.value">
                      <option v-for="(key, val) in item.options" :value="val" v-text="key"></option>
                    </select>
                  <textarea v-if="item.type == 'textarea'" id="{{item.name  + uni}}" rows="6"
                            class="form-control input {{item.class}} " v-model="item.value"
                            name="{{item.name}}" placeholder="{{item.placeholder}}"></textarea>
                  </div>
                  <input v-else id="{{item.name  + uni}}" class="form-control input {{item.class}}"
                         placeholder="{{item.placeholder}}" type="{{item.type}}" name="{{item.name}}"
                         value="{{item.value}}" v-model="item.value"/>
                </div>
              </div>
            </div>
            <div class="panel-footer text-right">
              <button v-if="currentId" @click="cancelEdit">Cancel Edit</button>
              <button class="btn btn-danger" @click="submit">Submit</button>
            </div>
          </div>
          </form>
        </div>
        <div id="list{{uni}}" v-bind:class="{ active: listActive }" class="tab-pane fade in">
          <table @click="tableClick($event)" id="listTable{{uni}}" class="display" width="100%"></table>
        </div>
      </div>
    </div>
    <button class="btn btn-default" @click="toggleDebug">DEBUG</button>
    <pre v-if="debug">{{ fieldsObject | json }}</pre>
  </div>
</template>

<script>
  var debug = false;
  export default {
    name: 'Crud',
    props : {
      formActive : {
        type: Boolean,
        'default': true
      },
      listActive : {
        type: Boolean,
        'default': false
      },
      model: {
        type: Object,
        required: true,
      },
      extension: {
        type: Object,
      },
    },
    data: function() {
      return {
        items: [],
        currentId: null,
        fieldsObject : this.model.getFieldsObject(),
        debug : debug,

      }
    },
    created: function() {
      console.log('CREATED');
      var self = this;
      this.$nextTick(function() {
        $('.ignore-input').removeClass('input');
        self.$nextTick(function () {
          if(self.extension) {
            self.extension.extend(self);
          }
          for(var key in self.fieldsObject) {
            if(self.fieldsObject[key].extend) {
              self.fieldsObject[key].extend(self);
            }
            if(self.fieldsObject[key].attrs) {
              var $el = $('#'+key + self.uni);
              for(var attr in self.fieldsObject[key].attrs) {
                $el.attr(attr, self.fieldsObject[key].attrs[attr]);
              }
            }
          }
        });
      });
    },
    events: {
      refresh: function() {
        this.refresh();
      },
      appendInput: function(e) {
        this.fieldsObject[e.name]['value'] += e.value;
      },
      call: function(e) {
        e.func(this, e.params);
      }
    },
    computed: {
      uni: function() {
        return this.model.getUni();
      },
      columns : function() {
        return this.model.columns()
      },
      title: function() {
        return this.model.title;
      }
    },
    methods: {
      onSubmit:function() {
        console.log('DEFAULT');
      },
      isEdit: function() {
        return this.currentId;
      },
      refresh: function() {
        debug && console.log('REFRESHING');
        var self = this;
        self.items = [];
        self.model.list( function(res) {
          _.each(res.rows, function(doc) {
            self.items.push(self.docToRow(doc.doc));
          });
          self.renderTable();
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
        self.currentId = id;
        this.model.get(id, function(doc) {
          for(var name in self.fieldsObject) {
            self.fieldsObject[name].value = doc[name];
          }
          self.show('form' + self.uni);
        });
      },
      submit: function() {
        var data = {};
        var self = this;
        _.each(this.columns, function(name) {
          data[name] = self.fieldsObject[name].value;
          self.fieldsObject[name].value = "";
        });
        this.model.upsert(this.currentId, data, function() {
          self.refresh();
        });
        this.currentId = null;
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
          this.model.removeById(e.target.getAttribute('data-id'), function() {
            self.refresh();
          });
        } else if (elClass.indexOf('edit-item') != -1) {
          this.edit(e.target.getAttribute('data-id'));
        }
      },
      toggleDebug: function() {
        this.debug = !this.debug;
      }
    }
  }
</script>

<style>
  .tab-pane {
    padding-top: 1em;
  }
</style>