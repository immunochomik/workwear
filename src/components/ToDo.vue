<template>
  <div class="container-fluid">
    <messages
        :messages.sync="messages"
        ></messages>
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <div class="col-sm-6">
            <h4>To Do</h4>
          </div>
          <div class="col-sm-6 text-right">
            <button class="btn btn-danger" @click="calculate">Calculate</button>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <!-- Table -->
        <table @click="tableClick($event)" id="listTableToDo" class="display" width="100%"></table>
      </div>
    </div>
  </div>
</template>

<script>
  import Workers from '../data/Workers.js'
  import WorkPositions from '../data/WorkPositions.js';
  import ReleaseHistory from '../data/ReleaseHistory.js';
  var workers = Workers.Workers;
  var workPositions = WorkPositions.WorkPositions;
  var rHistory = ReleaseHistory.ReleaseHistory;

  var positions = {};
  var sizes = {};

  var privates = (function() {
    function p(context) {
      this.context = context;
    }
    // for each get hers position
    // for item in position check release history for that worker
    p.prototype.processWorker = function(worker) {
      var self = this;
      rHistory.list(function(rHistory) {
        var received = {};
        _.each(rHistory.rows, function(item) {
          // get name from workwear description
          var workweare = item.doc.Workwear.split('_')[0];
          if(! received[workweare]) {
            received[workweare] = []
          }
          //save what and when was given to the worker
          received[workweare].push(item.doc.DateTime);
        });
        self.toDosForWorker(worker, received);
        self.context.renderTable();
      }, worker.doc.Name);
    };

    p.prototype.toDosForWorker = function(worker, received) {
      // we know what she received and
      // for each item in position get the date from last received and calculate nex data
      var position = positions[worker.doc.Position];
      for(var item in position) {
        var last = received[item] ? received[item][0] : false;
        this.context.addToDo(worker.doc, item, whenNeeded(last, position[item]));
      }
    };

    function whenNeeded(lastReceived, monthsAllowed) {
      if(!lastReceived) {
        return now();
      }
      var last = new Date(lastReceived);
      last = last.setMonth(last.getMonth() + parseInt(monthsAllowed))
      return new Date(last).toISOString().replace('T', ' ').replace('.000Z', '');
    }

    return p;
  })();


  export default {
    name: 'ToDo',
    data: function() {
      return {
        title: 'ToDo',
        todos: [],
        messages : {
          warning : '',
          success : '',
          error : '',
        },
      }
    },
    route: {
      data: function(to) {
        document.title = 'To Do';
        toggleTopNavActive('topNavLiToDo');
      }
    },
    created: function() {
      this.privates = new privates(this);
      workPositions.generateOptions({
        oKey : ['Description'],
        oValue : ['WorkweareTypes'],
        callback : function(options) {
          for(var position in options) {
            positions[position] = preparePosition(options[position].split('\n').filter(
                function(x) {return x;}));
          }
        }
      })
    },
    methods: {
      renderTable: function() {
        var data = {
          data: this.todos,
          columns: [
            {title:'Employee'},
            {title:'Workwear'},
            {title:'Needed'},
            {title:'Position'},
            {title:''},
          ],
          destroy:true,
        };
        var table = $('#listTableToDo');
        table.destroy && table.destroy();
        table.DataTable(data);
      },
      tableClick: function(e) {
        var elClass = e.target.getAttribute('class') || '';
        if(elClass.indexOf('delete-item') != -1) {
          this.deleteItem(e.target.getAttribute('data-id'));
        } else if (elClass.indexOf('edit-item') != -1) {
          this.edit(e.target.getAttribute('data-id'));
        }
      },
      addToDo: function(worker, item, whenToAdd) {
        if(!sizes[worker.Name]) {
          sizes[worker.Name] = workers.workerSizes(worker.Sizes);
        }
        var self = this;
        _.each(sizes[worker.Name][item], function(wokweare) {
          self.todos.push([worker.Name, wokweare, whenToAdd || now(), worker.Position, ''])
        });
      },
      release: function(item) {
        pp(item);
      },
      calculate: function() {
        // Take all workers
        var self = this;
        this.todos = [];
        workers.list(function(data ) {
          _.each(data.rows, function(worker) {
            self.privates.processWorker(worker);
          });
        });

      },
    },
  };

  // build an object from storage format
  // "Kalesony => 12;"  =  {Kalesony : 12}
  function preparePosition(list) {
    var out = {};
    _.each(list, function(row) {
      row = row.split('=>').map(function(x) {
        return x.replace(/^ | $/g, '').replace(';', '');});
      out[row[0]] = parseInt(row[1]);
    });
    return out;
  }


</script>

